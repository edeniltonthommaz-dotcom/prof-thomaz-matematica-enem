import { test } from "node:test";
import assert from "node:assert/strict";
import { resetRng, randInt, shuffle, SEED } from "./helpers.mjs";

test("SEED é 20260828", () => {
  assert.equal(SEED, 20260828);
});

test("resetRng reproduz a mesma sequência de randInt", () => {
  resetRng();
  const a = Array.from({ length: 20 }, () => randInt(0, 1000));
  resetRng();
  const b = Array.from({ length: 20 }, () => randInt(0, 1000));
  assert.deepEqual(a, b);
});

test("sequências com sementes diferentes divergem", () => {
  resetRng(1);
  const a = Array.from({ length: 10 }, () => randInt(0, 1e6));
  resetRng(2);
  const b = Array.from({ length: 10 }, () => randInt(0, 1e6));
  assert.notDeepEqual(a, b);
});

test("shuffle é determinístico após resetRng", () => {
  resetRng();
  const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  resetRng();
  const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(a, b);
});

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

test("generate.mjs produz saída idêntica em duas execuções", () => {
  const dir = path.join(import.meta.dirname, "..", "src", "data", "questions");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "real.json" && f !== "banco.json");
  const hash = () => files.map((f) => fs.readFileSync(path.join(dir, f), "utf-8")).join(" ");
  execFileSync("node", ["scripts/generate.mjs"], { cwd: path.join(import.meta.dirname, "..") });
  const first = hash();
  execFileSync("node", ["scripts/generate.mjs"], { cwd: path.join(import.meta.dirname, "..") });
  assert.equal(hash(), first);
});
