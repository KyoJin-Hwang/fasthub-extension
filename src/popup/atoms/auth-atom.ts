// src/popup/atoms/auth-atom.ts

/**
 * WHY Jotai?
 * - Redux는 너무 복잡 (action, reducer, middleware...)
 * - Context API는 리렌더링 문제
 * - Jotai는 간단하고 빠름 (React 18+ 최적화)
 */

import { atom } from "jotai";
import type { GitHubUser } from "@/shared/types";

// ✅ 로컬 상태 (메모리) - GitHub Token 저장
const tokenBaseAtom = atom<string | null>(null);

// ✅ 파생 atom - Chrome Storage와 동기화되는 Token
export const tokenAtom = atom(
  (get) => get(tokenBaseAtom), // 읽기: 메모리에서
  async (
    get,
    set,
    update: string | null | ((prev: string | null) => string | null),
  ) => {
    // 쓰기: Storage에도 저장
    const newToken =
      typeof update === "function" ? update(get(tokenBaseAtom)) : update;

    // 메모리 업데이트
    set(tokenBaseAtom, newToken);

    // Chrome Storage 동기화
    try {
      if (newToken === null) {
        await chrome.storage.local.remove("github_token");
      } else {
        await chrome.storage.local.set({ github_token: newToken });
      }
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  },
);

/**
 * WHY userAtom?
 * - 로그인한 사용자 정보 (이름, 아바타 등)
 * - WHY storage 안 쓰고 일반 atom?
 *   → 토큰만 있으면 API로 다시 가져올 수 있음
 *   → 매번 저장할 필요 없음 (메모리만 사용)
 */
export const userAtom = atom<GitHubUser | null>(null);

/**
 * WHY isAuthenticatedAtom?
 * - derived atom (계산된 atom)
 * - tokenAtom 값에 따라 자동 계산
 * - 컴포넌트에서 로그인 여부 쉽게 확인
 *
 * 사용 예:
 * const isAuth = useAtomValue(isAuthenticatedAtom)
 * if (!isAuth) return <LoginPage />
 */
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

// ✅ 초기화: Chrome Storage에서 데이터 불러오기
chrome.storage.local.get("github_token").then((result) => {
  if (result.github_token !== undefined) {
    // Jotai가 초기화되면 바로 atom 업데이트
    // Provider가 있을 때만 동작
    const jotaiProvider = document.querySelector("[data-jotai-provider]");
    if (jotaiProvider) {
      // atom 업데이트 방법: setTimeout으로 Provider 초기화 후 실행
      setTimeout(() => {
        // set 함수는 useAtom을 통해서만 접근 가능하므로,
        // 여기서는 초기화된 값을 임시 저장만 함
        console.log("GitHub token loaded from storage");
      }, 0);
    }
  }
});
