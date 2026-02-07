/**
 * WHY favorites?
 * - 자주 보는 레포를 즐겨찾기
 * - 빠른 접근
 *
 * WHY chrome.storage.sync?
 * - local: 한 기기에만 저장
 * - sync: 여러 기기에서 동기화
 * - 집 컴퓨터/회사 컴퓨터 모두 같은 즐겨찾기를 하기 위해서
 */

import { atom } from "jotai";

// ✅ 로컬 상태 (메모리)
const favoritesBaseAtom = atom<number[]>([]);

// ✅ Chrome Storage와 동기화되는 파생 atom
export const favoritesAtom = atom(
  (get) => get(favoritesBaseAtom),
  async (get, set, update: number[] | ((prev: number[]) => number[])) => {
    const newFavorites =
      typeof update === "function" ? update(get(favoritesBaseAtom)) : update;

    // 메모리 업데이트
    set(favoritesBaseAtom, newFavorites);

    // Chrome Storage 동기화
    try {
      await chrome.storage.sync.set({ favorites: newFavorites });
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  },
);

// ✅ 초기화: storage에서 데이터 불러오기
chrome.storage.sync.get("favorites").then((result) => {
  if (result.favorites && Array.isArray(result.favorites)) {
    console.log('Favorites loaded from storage:', result.favorites.length, 'items');
  }
});
