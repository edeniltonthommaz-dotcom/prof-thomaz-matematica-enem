import { test } from "node:test";
import assert from "node:assert/strict";
import { validar } from "./validate-all.mjs";

test("o banco atual passa em todas as regras", () => {
  const { erros } = validar();
  assert.deepEqual(erros, [], erros.join("\n"));
});
