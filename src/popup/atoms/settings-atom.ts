/**
 * WHY settings atom?
 * - 알림 설정 (켜기/끄기, 주기, 타입)
 * - 여러 기기에서 동기화 (sync storage)
 */

import { atom } from "jotai";
import type { NotificationSettings } from "@/shared/types";

/**
 * WHY 기본값 설정?
 * - 첫 설치 시 기본 설정
 * - 사용자가 변경하면 덮어씀
 */
const defaultSettings: NotificationSettings = {
  enabled: true, // 알림 기본으로 켜짐
  checkInterval: 5, // 5분 (권장 주기)
  types: {
    reviewRequest: true, // 가장 중요한 알림
    mention: true, // 두 번째로 중요
    assigned: true, // 세 번째로 중요
  },
  quietHours: {
    enabled: true, // 밤에 알림 안 받기 (배려)
    start: 22, // 오후 10시
    end: 8, // 아침 8시
  },
};

// ✅ 로컬 상태 (메모리) - 설정 저장
const settingsBaseAtom = atom<NotificationSettings>(defaultSettings);

// ✅ 파생 atom - Chrome Storage와 동기화되는 설정
export const settingsAtom = atom(
  (get) => get(settingsBaseAtom), // 읽기: 메모리에서
  async (
    get,
    set,
    update:
      | NotificationSettings
      | ((prev: NotificationSettings) => NotificationSettings),
  ) => {
    // 쓰기: Storage에도 저장
    const newSettings =
      typeof update === "function" ? update(get(settingsBaseAtom)) : update;

    // 메모리 업데이트
    set(settingsBaseAtom, newSettings);

    // Chrome Storage 동기화
    try {
      await chrome.storage.sync.set({ notification_settings: newSettings });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },
);

// ✅ 초기화: Storage에서 데이터 불러오기
chrome.storage.sync.get("notification_settings").then((result) => {
  if (
    result.notification_settings &&
    typeof result.notification_settings === "object"
  ) {
    console.log("Settings loaded from storage");

    // Jotai Provider가 있을 때만 atom 업데이트
    const jotaiProvider = document.querySelector("[data-jotai-provider]");
    if (jotaiProvider) {
      setTimeout(() => {
        console.log("Jotai initialized, will update settings");
      }, 0);
    }
  }
});
