/**
 * WHY Octokit Client?
 * - GitHub 공식 JavaScript 클라이언트
 * - REST API를 TypeScript로 안전하게 사용
 * - 자동 인증, 자동 pagination 등
 *
 * WHY 싱글톤?
 * - Octokit 인스턴스를 매번 생성하면 비효율
 * - 토큰 변경 시에만 재생성
 */

import { Octokit } from "octokit";
import { storage } from "../storage/chrome-storage";

let octokitInstance: Octokit | null = null;

/**
 * WHY getOctokit 함수?
 * - storage에서 토큰 가져오기
 * - Octokit 인스턴스 생성 (없으면)
 * - 기존 인스턴스 재사용 (있으면)
 */
export async function getOctokit(): Promise<Octokit> {
  // WHY 재사용? 매번 생성하면 메모리 낭비
  if (octokitInstance) {
    return octokitInstance;
  }

  // WHY storage.get? chrome.storage에서 토큰 가져오기
  const token = await storage.get<string>("github_token");

  // WHY throw? 로그인 안 했으면 에러 (UI에서 처리)
  if (!token) {
    throw new Error("Not authenticated");
  }

  // WHY Octokit 생성?
  octokitInstance = new Octokit({
    auth: token, // 토큰으로 인증
    userAgent: "FastHub-Extension/0.1.0", // WHY userAgent? GitHub API 필수 (없으면 403)
  });

  return octokitInstance;
}

/**
 * WHY resetOctokit?
 * - 로그아웃 시 인스턴스 제거
 * - 토큰 변경 시 재생성 필요
 */
export function resetOctokit() {
  octokitInstance = null;
}
