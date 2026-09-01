import { test } from "node:test";
import assert from "node:assert/strict";
import { norm, planejarRemocao } from "./dedupe-banco.mjs";

test("norm colapsa espaço, acento, caixa e marcador ordinal", () => {
  assert.equal(norm("  O  2º  DIA  é  Ótimo "), norm("o 2o dia e otimo"));
});

test("mantém a questão de menor id em grupo idêntico do banco", () => {
  const banco = [
    { id: "banco-50", enunciado: "Qual o valor de x?", categoriaId: "numeros" },
    { id: "banco-12", enunciado: "Qual o  valor de x?", categoriaId: "numeros" },
    { id: "banco-99", enunciado: "QUAL O VALOR DE X?", categoriaId: "numeros" },
    { id: "banco-77", enunciado: "Outra pergunta.", categoriaId: "numeros" },
  ];
  const { remover, manter } = planejarRemocao(banco, []);
  assert.deepEqual([...remover].sort(), ["banco-50", "banco-99"]);
  assert.equal(manter.get(norm("Qual o valor de x?")), "banco-12");
  assert.ok(!remover.has("banco-77"));
});

test("remove do banco toda questão cujo enunciado também existe em real.json", () => {
  const banco = [
    { id: "banco-100", enunciado: "Enunciado repetido do ENEM.", categoriaId: "numeros" },
    { id: "banco-101", enunciado: "Enunciado só do banco.", categoriaId: "numeros" },
  ];
  const real = [{ id: "enem-2010-176", enunciado: "Enunciado repetido do  ENEM.", categoriaId: "numeros" }];
  const { remover } = planejarRemocao(banco, real);
  assert.deepEqual([...remover], ["banco-100"]);
});
