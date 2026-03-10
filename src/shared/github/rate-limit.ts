/**
 * WHY Rate Limit Monitor?
 * - GitHub API는 시간당 5000번 제한 (일반 API)
 * - Search API는 시간당 30번 제한
 * - 모든 응답 헤더에서 남은 횟수 추출
 * - 부족하면 토스트 알림으로 경고
 */

import type { RateLimitInfo } from "@/shared/types";

/**
 * GitHub API 응답 헤더 타입
 */
interface GitHubResponseHeaders {
  "x-ratelimit-limit"?: string;
  "x-ratelimit-remaining"?: string;
  "x-ratelimit-reset"?: string;
}

/**
 * Rate Limit 타입 구분
 * - search: Search API (30/hour)
 * - core: 일반 API (5000/hour)
 */
export type RateLimitType = "search" | "core";

class RateLimitMonitor {
  private core: RateLimitInfo | null = null;
  private search: RateLimitInfo | null = null;

  /**
   * WHY update 메서드?
   * - 모든 GitHub API 응답 후 호출
   * - 헤더에서 rate limit 정보 추출
   */
  update(headers: GitHubResponseHeaders, type: RateLimitType = "core") {
    const info: RateLimitInfo = {
      limit: parseInt(headers["x-ratelimit-limit"] || "5000"),
      remaining: parseInt(headers["x-ratelimit-remaining"] || "5000"),
      reset: new Date(parseInt(headers["x-ratelimit-reset"] || "0") * 1000),
    };

    if (type === "search") {
      this.search = info;
    } else {
      this.core = info;
    }
  }

  /**
   * WHY searchLimit getter?
   * - Search API (30/hour) 상태 조회
   */
  get searchLimit(): RateLimitInfo | null {
    return this.search;
  }

  /**
   * WHY coreLimit getter?
   * - 일반 API (5000/hour) 상태 조회
   */
  get coreLimit(): RateLimitInfo | null {
    return this.core;
  }

  /**
   * WHY isSearchLow?
   * - Search API 10번 미만일 때
   */
  get isSearchLow(): boolean {
    return this.search ? this.search.remaining < 10 : false;
  }

  /**
   * WHY isSearchCritical?
   * - Search API 5번 미만일 때
   */
  get isSearchCritical(): boolean {
    return this.search ? this.search.remaining < 5 : false;
  }

  /**
   * WHY isCoreLow?
   * - 일반 API 1000번 미만일 때
   */
  get isCoreLow(): boolean {
    return this.core ? this.core.remaining < 1000 : false;
  }

  /**
   * WHY isCoreCritical?
   * - 일반 API 100번 미만일 때
   */
  get isCoreCritical(): boolean {
    return this.core ? this.core.remaining < 100 : false;
  }
}

/**
 * WHY 싱글톤?
 * - 앱 전체에서 단 하나의 인스턴스만 사용
 * - popup과 background 모두 같은 인스턴스 공유
 */
export const rateLimitMonitor = new RateLimitMonitor();
