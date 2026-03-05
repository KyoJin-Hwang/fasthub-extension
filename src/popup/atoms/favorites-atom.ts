import { atom } from "jotai";

const STORAGE_KEY = import.meta.env.VITE_FAVORITES_KEY || "fasthub_favorites";

const baseAtom = atom<number[]>([]);

export const favoritesAtom = atom(
  (get) => get(baseAtom),
  async (get, set, update: number[] | ((prev: number[]) => number[])) => {
    const current = get(baseAtom);
    const newFavorites =
      typeof update === "function" ? update(current) : update;

    set(baseAtom, newFavorites);

    await chrome.storage.sync.set({ [STORAGE_KEY]: newFavorites });
  },
);

export const loadFavorites = async () => {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const saved = result[STORAGE_KEY];
  if (Array.isArray(saved)) {
    return saved;
  }
  return [];
};
