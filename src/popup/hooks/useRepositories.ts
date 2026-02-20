/**
 * WHY Custom Hook?
 * - 컴포넌트: UI만 담당
 * - Hook: 데이터 로직 담당
 * - 여러 컴포넌트에서 같은 데이터 공유 (TanStack Query 캐싱)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRepositories,
  searchRepositories,
  createRepository,
} from "@/popup/api/repositories";

/**
 * WHY useRepositories?
 * - 레포 목록 가져오기
 * - 자동 캐싱 (5분)
 * - 로딩/에러 자동 처리
 */
export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"], // queryKey? 캐시 식별자
    queryFn: fetchRepositories, // queryFn? 실제 API 호출
    staleTime: 5 * 60 * 1000, // 5분? API 절약 (5분간 캐시 사용)
    gcTime: 30 * 60 * 1000, // 30분? 메모리 보관 (빠른 복구)
  });
}

/**
 * WHY useSearchRepositories?
 * - 검색 전용 Hook
 * - enabled: query 있을 때만 실행 (검색어 없으면 API 안 함)
 */
export function useSearchRepositories(query: string) {
  return useQuery({
    queryKey: ["repositories", "search", query], // query 포함? 검색어마다 다른 캐시
    queryFn: () => searchRepositories(query),
    enabled: query.length > 0, // enabled? 검색어 없으면 스킵
    staleTime: 2 * 60 * 1000, // 2분? 검색은 짧게 (더 동적)
  });
}

/**
 * WHY useCreateRepository?
 * - Mutation (데이터 변경)
 * - onSuccess: 성공 시 목록 새로고침 (자동!)
 */
export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRepository,
    onSuccess: () => {
      // → 레포 생성 후 목록 캐시 무효화 → 자동 새로고침!
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
  });
}
