import { useQuery } from "@tanstack/react-query";
import {
  fetchAssignedIssues,
  fetchCreatedIssues,
  fetchMentionedIssues,
} from "@/popup/api/issues";

/**
 * WHY useAssignedIssues?
 * - 나에게 할당된 Issue 목록
 * - 기본 5분 주기 + Background 알림 즉시 반영
 */
export function useAssignedIssues() {
  return useQuery({
    queryKey: ["issues", "assigned"],
    queryFn: fetchAssignedIssues,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * WHY useCreatedIssues?
 * - 내가 만든 Issue 목록
 */
export function useCreatedIssues() {
  return useQuery({
    queryKey: ["issues", "created"],
    queryFn: fetchCreatedIssues,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * WHY useMentionedIssues?
 * - 나를 멘션한 Issue 목록
 * - 기본 5분 주기 + Background 알림 즉시 반영
 */
export function useMentionedIssues() {
  return useQuery({
    queryKey: ["issues", "mentioned"],
    queryFn: fetchMentionedIssues,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
