// src/popup/api/issues.ts

/**
 * WHY Issue API?
 * - GitHub에서 PR도 Issue의 일종
 * - is:issue vs is:pr로만 구분
 * - 나머지 쿼리는 PR과 거의 동일
 */

import { getOctokit } from "@/shared/github/client";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import type { Issue } from "@/shared/types";

/**
 * WHY fetchAssignedIssues?
 * - 나에게 할당된 이슈 (내가 해결해야 할 것)
 * - 우선순위 높음
 */
export async function fetchAssignedIssues(): Promise<Issue[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:issue assignee:${user.login} is:open`,
    sort: "updated",
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as Issue[];
}

/**
 * WHY fetchCreatedIssues?
 * - 내가 만든 이슈
 * - 진행 상황 추적
 */
export async function fetchCreatedIssues(): Promise<Issue[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:issue author:${user.login} is:open`,
    sort: "updated",
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as Issue[];
}

/**
 * WHY fetchMentionedIssues?
 * - 나를 @멘션한 이슈
 * - 의견을 구하는 것 → 확인 필요
 */
export async function fetchMentionedIssues(): Promise<Issue[]> {
  const octokit = await getOctokit();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:issue mentions:${user.login} is:open`,
    sort: "updated",
    per_page: 50,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as Issue[];
}

/**
 * WHY createIssue?
 * - 익스텐션에서 바로 이슈 생성
 * - 버그 발견 → 즉시 이슈 등록
 */
export async function createIssue(params: {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[]; // 라벨 (예: ["bug", "high-priority"])
  assignees?: string[]; // 할당자 (예: ["octocat"])
}): Promise<Issue> {
  const octokit = await getOctokit();

  const response = await octokit.rest.issues.create(params);

  rateLimitMonitor.update(response.headers);

  return response.data as Issue;
}
