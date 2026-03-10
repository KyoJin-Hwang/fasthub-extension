// src/background/index.ts
import { getOctokit } from "../shared/github/client";
import type { NotificationSettings } from "../shared/types";

const ALARM_NAME = "notification-check";
const DEFAULT_INTERVAL_MINUTES = 5;

async function ensureAlarm(intervalMinutes = DEFAULT_INTERVAL_MINUTES) {
  try {
    const existing = await chrome.alarms.get(ALARM_NAME);
    if (existing) return;
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: intervalMinutes });
    console.log(`✅ Alarm ensured: ${intervalMinutes}min`);
  } catch (error) {
    console.error("❌ Failed to ensure alarm:", error);
  }
}

// Chrome Storage 타입 정의
interface StorageSync {
  notification_settings?: NotificationSettings;
}

interface StorageLocal {
  github_token?: string;
  last_review_count?: number;
  last_mention_count?: number;
  last_assigned_count?: number;
}

// Extension 설치 시 알람 등록
chrome.runtime.onInstalled.addListener(async () => {
  console.log("✅ FastHub installed");
  await ensureAlarm(DEFAULT_INTERVAL_MINUTES);
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("✅ FastHub started");
  await ensureAlarm(DEFAULT_INTERVAL_MINUTES);
});

// 서비스 워커가 깨졌을 때도 알람이 없으면 복구
void ensureAlarm(DEFAULT_INTERVAL_MINUTES);

// 5분마다 알람 트리거
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  console.log("🔔 Checking notifications...");

  try {
    const { notification_settings } = (await chrome.storage.sync.get(
      "notification_settings",
    )) as StorageSync;

    // 알림 꺼져있으면 종료
    if (!notification_settings?.enabled) {
      console.log("⏸️  Notifications disabled");
      return;
    }

    // 조용한 시간 체크 (22시 ~ 8시)
    if (notification_settings.quietHours?.enabled) {
      const now = new Date().getHours();
      const { start, end } = notification_settings.quietHours;
      if (now >= start || now < end) {
        console.log("🌙 Quiet hours, skipping");
        return;
      }
    }

    // 로그인 안 되어있으면 종료
    const { github_token } = (await chrome.storage.local.get(
      "github_token",
    )) as StorageLocal;
    if (!github_token) {
      console.log("❌ Not authenticated");
      return;
    }

    // 타입별 체크
    if (notification_settings.types?.reviewRequest) await checkReviewRequests();
    if (notification_settings.types?.mention) await checkMentions();
    if (notification_settings.types?.assigned) await checkAssignedIssues();
  } catch (error) {
    console.error("❌ Notification check failed:", error);
  }
});

// 리뷰 요청 체크
async function checkReviewRequests() {
  try {
    const octokit = await getOctokit();
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: `is:pr review-requested:${user.login} is:open`,
      per_page: 1,
    });

    const { last_review_count } = (await chrome.storage.local.get(
      "last_review_count",
    )) as StorageLocal;
    const currentCount = data.total_count;

    if (
      last_review_count !== undefined &&
      currentCount > (last_review_count ?? 0)
    ) {
      const newCount = currentCount - last_review_count;
      chrome.notifications.create("fasthub-review-" + Date.now(), {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "FastHub - 리뷰 요청",
        message: `${newCount}개의 새로운 리뷰 요청이 있습니다`,
        priority: 2,
      });
      console.log(`✅ Review request notification sent: +${newCount}`);
    }

    await chrome.storage.local.set({ last_review_count: currentCount });
  } catch (error) {
    console.error("❌ Review request check failed:", error);
  }
}

// 멘션 체크
async function checkMentions() {
  try {
    const octokit = await getOctokit();
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: `mentions:${user.login} is:open`,
      per_page: 1,
    });

    const { last_mention_count } = (await chrome.storage.local.get(
      "last_mention_count",
    )) as StorageLocal;
    const currentCount = data.total_count;

    if (
      last_mention_count !== undefined &&
      currentCount > (last_mention_count ?? 0)
    ) {
      const newCount = currentCount - last_mention_count;
      chrome.notifications.create("fasthub-mention-" + Date.now(), {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "FastHub - 멘션",
        message: `${newCount}개의 새로운 멘션이 있습니다`,
        priority: 1,
      });
      console.log(`✅ Mention notification sent: +${newCount}`);
    }

    await chrome.storage.local.set({ last_mention_count: currentCount });
  } catch (error) {
    console.error("❌ Mention check failed:", error);
  }
}

// 이슈 할당 체크
async function checkAssignedIssues() {
  try {
    const octokit = await getOctokit();
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: `is:issue assignee:${user.login} is:open`,
      per_page: 1,
    });

    const { last_assigned_count } = (await chrome.storage.local.get(
      "last_assigned_count",
    )) as StorageLocal;
    const currentCount = data.total_count;

    if (
      last_assigned_count !== undefined &&
      currentCount > (last_assigned_count ?? 0)
    ) {
      const newCount = currentCount - last_assigned_count;
      chrome.notifications.create("fasthub-assigned-" + Date.now(), {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "FastHub - 이슈 할당",
        message: `${newCount}개의 새로운 이슈가 할당되었습니다`,
        priority: 1,
      });
      console.log(`✅ Assigned issue notification sent: +${newCount}`);
    }

    await chrome.storage.local.set({ last_assigned_count: currentCount });
  } catch (error) {
    console.error("❌ Assigned issue check failed:", error);
  }
}

// 알림 클릭 시 해당 페이지로 이동
chrome.notifications.onClicked.addListener((notificationId) => {
  let url = "https://github.com";

  // 알림 ID로 어떤 알림인지 구분해서 해당 페이지로 이동
  if (notificationId?.includes("review")) {
    url = "https://github.com/pulls?q=review-requested:@me";
  } else if (notificationId?.includes("mention")) {
    url = "https://github.com/notifications?query=is:issue+mentions:@me";
  } else if (notificationId?.includes("assigned")) {
    url = "https://github.com/issues?q=is:issue+assignee:@me";
  }

  chrome.tabs.create({ url });
});

// 설정 변경 시 알람 주기 업데이트
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.notification_settings) {
    const newSettings = changes.notification_settings.newValue as
      | NotificationSettings
      | undefined;

    if (newSettings?.enabled && newSettings?.checkInterval) {
      chrome.alarms.clear(ALARM_NAME, () => {
        chrome.alarms.create(ALARM_NAME, {
          periodInMinutes: newSettings.checkInterval,
        });
        console.log(`✅ Alarm updated: ${newSettings.checkInterval}min`);
      });
    } else if (!newSettings?.enabled) {
      chrome.alarms.clear(ALARM_NAME);
      console.log("⏸️  Alarm cleared");
    }
  }
});
