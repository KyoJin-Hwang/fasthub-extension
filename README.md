# FastHub Extension

GitHub를 더 빠르게. 브라우저 팝업에서 **Repositories / Pull Requests / Issues**를 확인하고, 백그라운드에서 **리뷰 요청/멘션/할당**을 주기적으로 체크해 알림을 띄우는 크롬 익스텐션입니다.

## 주요 기능

- **Repositories**
  - 검색, 즐겨찾기, 수동 새로고침
- **Pull Requests**
  - 리뷰 요청 / 내 PR / 참여 중 탭
- **Issues**
  - 할당됨 / 생성함 / 멘션됨 탭
- **Notifications (Background)**
  - 알람 기반 폴링으로 리뷰 요청/멘션/이슈 할당 변화 감지 시 OS 알림
  - 조용한 시간(quiet hours) 및 타입별 on/off 지원

## 개발 환경

### 설치

```bash
npm install
```

### 개발 서버

```bash
npm run dev
```

## 빌드 & 로드(개발자 모드)

### 빌드

```bash
npm run build
```

### Chrome에 로드

- Chrome → `chrome://extensions`
- 우측 상단 **개발자 모드** ON
- **압축해제된 확장 프로그램을 로드** → `dist/` 폴더 선택

## 권한(permissions) 설명

- **storage**: 토큰/설정/즐겨찾기 저장
- **alarms**: 백그라운드에서 주기적 체크 트리거
- **notifications**: OS 알림 표시
- **host_permissions**
  - `https://api.github.com/*`: GitHub API 호출
  - `https://github.com/*`: 알림 클릭 시 GitHub 페이지 이동

## 👏 Credits (출처 및 감사)
* **Icon:** [Github 아이콘 제작자: pocike - Flaticon](https://www.flaticon.com/kr/free-icons/github)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
