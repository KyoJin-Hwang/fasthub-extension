import { useQuery } from "@tanstack/react-query";
import {
  fetchMyPullRequests,
  fetchReviewRequests,
  fetchParticipatingPRs,
} from "@/popup/api/pull-requests";

/**
 * WHY useMyPullRequests?
 * - 내가 만든 PR 목록
 * - 기본 5분 주기
 */
export function useMyPullRequests() {
  return useQuery({
    queryKey: ["pull-requests", "mine"],
    queryFn: fetchMyPullRequests,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * WHY useReviewRequests?
 * - 나에게 리뷰 요청된 PR
 * - 기본 5분 주기 + Background 알림 즉시 반영
 */
export function useReviewRequests() {
  return useQuery({
    queryKey: ["pull-requests", "review-requests"],
    queryFn: fetchReviewRequests,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * WHY useParticipatingPRs?
 * - 내가 참여 중인 PR (코멘트, 리뷰 등)
 */
export function useParticipatingPRs() {
  return useQuery({
    queryKey: ["pull-requests", "participating"],
    queryFn: fetchParticipatingPRs,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
