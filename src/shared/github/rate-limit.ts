/**
 * WHY Rate Limit Monitor?
 * - GitHub API는 시간당 5000번 제한
 * - 모든 응답 헤더에서 남은 횟수 추출
 * - UI에 실시간 표시 (사용자가 상태 확인)
 * - 부족하면 경고
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

class RateLimitMonitor {
  private info: RateLimitInfo | null = null;

  /**
   * WHY update 메서드?
   * - 모든 GitHub API 응답 후 호출
   * - 헤더에서 rate limit 정보 추출
   */
  update(headers: GitHubResponseHeaders) {
    this.info = {
      limit: parseInt(headers["x-ratelimit-limit"] || "5000"),
      remaining: parseInt(headers["x-ratelimit-remaining"] || "5000"),
      reset: new Date(parseInt(headers["x-ratelimit-reset"] || "0") * 1000),
    };
  }

  /**
   * WHY current getter?
   * - 컴포넌트에서 현재 상태 조회
   * - 예: const { remaining } = rateLimitMonitor.current
   */
  get current(): RateLimitInfo | null {
    return this.info;
  }

  /**
   * WHY isLow?
   * - 1000번 미만일 때 노란색 경고
   * - UI에서 색상 변경에 사용
   */
  get isLow(): boolean {
    return this.info ? this.info.remaining < 1000 : false;
  }

  /**
   * WHY isCritical?
   * - 100번 미만일 때 빨간색 경고
   * - 기능 제한 시작 (백그라운드 알림 스킵 등)
   */
  get isCritical(): boolean {
    return this.info ? this.info.remaining < 100 : false;
  }

  /**
   * WHY resetTime?
   * - "42분 후 리셋" 같은 메시지 표시용
   */
  get resetTime(): Date | null {
    return this.info?.reset || null;
  }
}

/**
 * WHY 싱글톤?
 * - 앱 전체에서 단 하나의 인스턴스만 사용
 * - popup과 background 모두 같은 인스턴스 공유
 */
export const rateLimitMonitor = new RateLimitMonitor();
