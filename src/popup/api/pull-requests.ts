/**
 * WHY Search API 사용?
 * - 모든 레포의 PR을 한 번에 검색 (효율적!)
 * - 레포별로 루프 돌리면 API 폭발 (100개 레포 = 100번 호출)
 * - Search API는 1번 호출로 모든 레포 검색
 */

import { getOctokit } from "@/shared/github/client";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import type { PullRequest } from "@/shared/types";

/**
 * WHY fetchMyPullRequests?
 * - 내가 만든 PR 목록
 * - 상태 확인 (리뷰 중? 승인됨? 머지됨?)
 */
export async function fetchMyPullRequests(): Promise<PullRequest[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  // WHY 이런 쿼리?
  // is:pr → Pull Request만 (Issue 제외)
  // author:me → 내가 만든 것
  // is:open → 열린 것만 (닫힌 것 제외)
  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:pr author:${user.login} is:open`,
    sort: "updated", // 최근 업데이트 순
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as PullRequest[];
}

/**
 * WHY fetchReviewRequests?
 * - 나에게 리뷰 요청된 PR (가장 중요!)
 * - 팀원이 기다리는 중 → 빠르게 확인 필요
 */
export async function fetchReviewRequests(): Promise<PullRequest[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  // WHY review-requested?
  // → GitHub가 나를 리뷰어로 지정한 PR만
  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:pr review-requested:${user.login} is:open`,
    sort: "updated",
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as PullRequest[];
}

/**
 * WHY fetchParticipatingPRs?
 * - 내가 참여 중인 PR (코멘트, 리뷰 등)
 * - 토론 중인 PR 추적
 */
export async function fetchParticipatingPRs(): Promise<PullRequest[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  // WHY involves?
  // → author, assignee, mentions, commenter 모두 포함
  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:pr involves:${user.login} is:open`,
    sort: "updated",
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as PullRequest[];
}

/**
 * WHY createPullRequest?
 * - 익스텐션에서 바로 PR 생성
 * - head: 내 브랜치
 * - base: 타겟 브랜치 (보통 main)
 */
export async function createPullRequest(params: {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  head: string; // 내 브랜치 (예: "feature/new-feature")
  base: string; // 타겟 브랜치 (예: "main")
  draft?: boolean; // Draft PR 여부
}): Promise<PullRequest> {
  const octokit = await getOctokit();

  const response = await octokit.rest.pulls.create(params);

  rateLimitMonitor.update(response.headers);

  return response.data as PullRequest;
}

/**
 * WHY fetchBranches?
 * - PR 생성 시 브랜치 선택 필요
 * - 드롭다운에 브랜치 목록 표시용
 */
export async function fetchBranches(
  owner: string,
  repo: string,
): Promise<string[]> {
  const octokit = await getOctokit();

  const response = await octokit.rest.repos.listBranches({
    owner,
    repo,
    per_page: 100,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.map((branch) => branch.name);
}
