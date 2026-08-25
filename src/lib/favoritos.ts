"use client";

const STORAGE_KEY = "enem-questoes-favoritos-v1";

export type FavoritosSet = Record<string, number>;

const EMPTY: FavoritosSet = {};
let cache: FavoritosSet | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): FavoritosSet {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoritosSet) : {};
  } catch {
    return {};
  }
}

function apply(set: FavoritosSet) {
  cache = set;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
  }
  listeners.forEach((l) => l());
}

export function getSnapshot(): FavoritosSet {
  if (!cache) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): FavoritosSet {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function alternarFavorito(questaoId: string) {
  const set = { ...getSnapshot() };
  if (set[questaoId]) delete set[questaoId];
  else set[questaoId] = Date.now();
  apply(set);
}
