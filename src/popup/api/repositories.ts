// src/popup/api/repositories.ts

/**
 * WHY 이 파일?
 * - Repository 관련 모든 API 함수
 * - GitHub REST API를 TypeScript로 안전하게 사용
 * - UI와 완전 분리 (관심사 분리)
 */

import { getOctokit } from "@/shared/github/client";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import type { Repository } from "@/shared/types";

/**
 * WHY fetchRepositories?
 * - 사용자의 모든 레포지토리 가져오기
 * - sort: 'updated' → 최근 작업한 것부터 (실용적)
 * - per_page: 100 → 레포 많은 사람도 한 번에 (기본 30개는 적음)
 */
export async function fetchRepositories(): Promise<Repository[]> {
  const octokit = await getOctokit();

  const response = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
  });

  // WHY rateLimitMonitor? API 남은 횟수 추적 (헤더에서 추출)
  rateLimitMonitor.update(response.headers);

  return response.data as Repository[];
}

/**
 * WHY searchRepositories?
 * - 레포 이름으로 검색
 * - Search API 사용 → 부분 일치, 대소문자 무시
 * - 예: "fast" 검색 → "FastHub", "my-fast-api" 모두 찾음
 */
export async function searchRepositories(query: string): Promise<Repository[]> {
  // WHY 빈 문자열 체크?
  // → 불필요한 API 호출 방지 (Rate Limit 절약)
  if (!query.trim()) {
    return [];
  }

  const octokit = await getOctokit();

  // WHY getAuthenticated?
  // → Search API는 "user:username query" 형식 필요
  const { data: user } = await octokit.rest.users.getAuthenticated();

  const response = await octokit.rest.search.repos({
    q: `user:${user.login} ${query}`, // "user:myname fast" → 내 레포 중 "fast" 검색
    per_page: 30,
  });

  rateLimitMonitor.update(response.headers);

  return response.data.items as Repository[];
}

/**
 * WHY createRepository?
 * - 익스텐션에서 바로 레포 생성 (GitHub 웹사이트 안 열어도 됨!)
 * - auto_init: README 자동 생성
 * - gitignore_template: .gitignore 템플릿 (Node, Python 등)
 */
export async function createRepository(params: {
  name: string; // 필수: 레포 이름
  description?: string; // 선택: 설명
  private: boolean; // 필수: Public/Private
  auto_init?: boolean; // 선택: README.md 자동 생성
  gitignore_template?: string; // 선택: .gitignore 템플릿
  license_template?: string; // 선택: 라이선스 (MIT, Apache 등)
}): Promise<Repository> {
  const octokit = await getOctokit();

  const response = await octokit.rest.repos.createForAuthenticatedUser(params);

  rateLimitMonitor.update(response.headers);

  return response.data as Repository;
}

/**
 * WHY starRepository?
 * - 레포에 Star 추가 (즐겨찾기와는 다름!)
 * - 즐겨찾기: 우리 앱 내부 (로컬)
 * - Star: GitHub 서버에 저장
 */
export async function starRepository(
  owner: string,
  repo: string,
): Promise<void> {
  const octokit = await getOctokit();

  await octokit.rest.activity.starRepoForAuthenticatedUser({
    owner,
    repo,
  });
}

/**
 * WHY unstarRepository?
 * - Star 제거
 */
export async function unstarRepository(
  owner: string,
  repo: string,
): Promise<void> {
  const octokit = await getOctokit();

  await octokit.rest.activity.unstarRepoForAuthenticatedUser({
    owner,
    repo,
  });
}
