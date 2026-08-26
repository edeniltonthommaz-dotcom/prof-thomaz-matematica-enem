"use client";

const STORAGE_KEY = "enem-questoes-meta-diaria-v1";

export const META_DIARIA_PADRAO = 10;
export const META_DIARIA_MIN = 1;
export const META_DIARIA_MAX = 100;

let cache: number | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): number {
  if (typeof window === "undefined") return META_DIARIA_PADRAO;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const valor = raw ? Number(raw) : NaN;
    return Number.isFinite(valor) && valor >= META_DIARIA_MIN && valor <= META_DIARIA_MAX
      ? valor
      : META_DIARIA_PADRAO;
  } catch {
    return META_DIARIA_PADRAO;
  }
}

export function getSnapshot(): number {
  if (cache === null) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): number {
  return META_DIARIA_PADRAO;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function definirMetaDiaria(valor: number) {
  const clamped = Math.min(META_DIARIA_MAX, Math.max(META_DIARIA_MIN, Math.round(valor)));
  cache = clamped;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, String(clamped));
  }
  listeners.forEach((l) => l());
}
