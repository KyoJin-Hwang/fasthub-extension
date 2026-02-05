// 공통 타입

/**
 * WHY 이 파일?
 * TypeScript 타입을 한 곳에서 관리
 * GitHub API 응답 구조 정의
 * 중복 제거, 타입 안전성
 */

/**
 * GitHub 사용자 정보
 * @description GitHub API에서 반환되는 사용자 기본 정보
 * @property {string} login - 사용자 로그인 ID (예: "octocat")
 * @property {number} id - 고유 사용자 ID
 * @property {string} avatar_url - 프로필 이미지 URL
 * @property {string} html_url - GitHub 프로필 페이지 URL
 */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

/**
 * GitHub 저장소 정보
 * @description GitHub 저장소의 상세 정보와 통계 데이터
 * @property {number} id - 저장소 고유 ID
 * @property {string} name - 저장소 이름 (예: "fasthub")
 * @property {string} full_name - 전체 저장소 이름 (예: "username/fasthub")
 * @property {string|null} description - 저장소 설명
 * @property {string} html_url - 저장소 GitHub 페이지 URL
 * @property {number} stargazers_count - Star 개수
 * @property {string|null} language - 주요 프로그래밍 언어
 * @property {string} updated_at - 마지막 업데이트 시간 (ISO 8601 형식)
 * @property {string} created_at - 저장소 생성 시간
 * @property {object} owner - 저장소 소유자 정보
 * @property {string} owner.login - 소유자 로그인 ID
 * @property {string} owner.avatar_url - 소유자 프로필 이미지 URL
 * @property {boolean} private - 비공개 저장소 여부
 * @property {boolean} fork - Fork된 저장소 여부
 */
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  private: boolean;
  fork: boolean;
}

/**
 * Pull Request 정보
 * @description GitHub Pull Request의 상세 정보와 상태
 * @property {number} id - PR 고유 ID
 * @property {number} number - PR 번호 (예: #123)
 * @property {string} title - PR 제목
 * @property {string} html_url - PR GitHub 페이지 URL
 * @property {"open"|"closed"} state - PR 현재 상태
 * @property {GitHubUser} user - PR 작성자 정보
 * @property {string} created_at - PR 생성 시간
 * @property {string} updated_at - PR 마지막 업데이트 시간
 * @property {Label[]} labels - PR에 달린 라벨 목록
 * @property {number} comments - PR 코멘트 개수
 * @property {string} repository_url - 저장소 API URL
 * @property {string} [body] - PR 상세 설명 (선택 사항)
 */
export interface PullRequest {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  labels: Label[];
  comments: number;
  repository_url: string;
  body?: string;
}

/**
 * GitHub Issue 정보
 * @description GitHub Issue의 상세 정보와 관련 데이터
 * @property {number} id - Issue 고유 ID
 * @property {number} number - Issue 번호
 * @property {string} title - Issue 제목
 * @property {string} html_url - Issue GitHub 페이지 URL
 * @property {"open"|"closed"} state - Issue 현재 상태
 * @property {GitHubUser} user - Issue 작성자 정보
 * @property {string} created_at - Issue 생성 시간
 * @property {string} updated_at - Issue 마지막 업데이트 시간
 * @property {Label[]} labels - Issue에 달린 라벨 목록
 * @property {number} comments - Issue 코멘트 개수
 * @property {string} repository_url - 저장소 API URL
 * @property {string} [body] - Issue 상세 설명 (선택 사항)
 * @property {GitHubUser[]} [assignees] - Issue에 할당된 사용자 목록 (선택 사항)
 */
export interface Issue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  labels: Label[];
  comments: number;
  repository_url: string;
  body?: string;
  assignees?: GitHubUser[];
}

/**
 * GitHub 라벨 정보
 * @description Issues와 PRs에 적용되는 라벨 정보
 * @property {number} id - 라벨 고유 ID
 * @property {string} name - 라벨 이름 (예: "bug")
 * @property {string} color - 라벨 색상 (16진수, 예: "d73a4a")
 * @property {string} [description] - 라벨 설명 (선택 사항)
 */
export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

/**
 * 알림 설정 정보
 * @description 사용자가 설정한 알림 관련 환경 설정
 * @property {boolean} enabled - 알림 기능 활성화 여부
 * @property {3|5|10|15|30} checkInterval - 알림 확인 주기 (분 단위)
 * @property {object} types - 알림 유형별 설정
 * @property {boolean} types.reviewRequest - 코드 리뷰 요청 알림
 * @property {boolean} types.mention - 멘션 알림
 * @property {boolean} types.assigned - 이슈 할당 알림
 * @property {object} quietHours - 조용한 시간대 설정
 * @property {boolean} quietHours.enabled - 조용한 시간대 사용 여부
 * @property {number} quietHours.start - 시작 시간 (24시간제, 예: 22 = 오후 10시)
 * @property {number} quietHours.end - 종료 시간 (24시간제, 예: 8 = 오전 8시)
 */
export interface NotificationSettings {
  enabled: boolean;
  checkInterval: 3 | 5 | 10 | 15 | 30;
  types: {
    reviewRequest: boolean;
    mention: boolean;
    assigned: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: number;
    end: number;
  };
}

/**
 * API Rate Limit 정보
 * @description GitHub API 요청 제한 정보
 * @property {number} limit - 전체 API 요청 한도
 * @property {number} remaining - 남은 API 요청 수
 * @property {Date} reset - 제한 초기화 시간
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}
