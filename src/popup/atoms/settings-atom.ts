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
  checkInterval: 5, // 5분
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

/**
 * WHY settingsBaseAtom?
 * - 실제 값을 저장하는 기본 atom
 * - 읽기/쓰기 모두 여기서 관리
 */
const settingsBaseAtom = atom<NotificationSettings>(defaultSettings);

/**
 * WHY settingsAtom?
 * - Chrome Storage와 동기화되는 atom
 * - 쓰기 시 storage에도 자동 저장
 */
export const settingsAtom = atom(
  (get) => get(settingsBaseAtom), // 읽기: 메모리에서
  async (
    get,
    set,
    update:
      | NotificationSettings
      | ((prev: NotificationSettings) => NotificationSettings),
  ) => {
    // 새로운 설정값 계산
    const newSettings =
      typeof update === "function" ? update(get(settingsBaseAtom)) : update;

    // 메모리 업데이트
    set(settingsBaseAtom, newSettings);

    // Chrome Storage에 저장 (설정 영구 보존)
    try {
      await chrome.storage.sync.set({ notification_settings: newSettings });
    } catch (error) {
      console.error("설정 저장 실패:", error);
    }
  },
);

/**
 * WHY loadSettingsFromStorage 함수?
 * - 익스텐션 새로고침/재시작 시 storage에서 설정 불러오기
 * - 이 함수는 App.tsx에서 초기화 시 호출됨
 */
export async function loadSettingsFromStorage(): Promise<NotificationSettings> {
  try {
    const result = await chrome.storage.sync.get("notification_settings");
    const stored = result.notification_settings;

    if (stored && typeof stored === "object") {
      // Storage에 저장된 설정이 있으면 기본값과 병합
      // (새로운 설정项이 추가되어도 호환성 유지)
      return { ...defaultSettings, ...stored } as NotificationSettings;
    }
  } catch (error) {
    console.error("설정 불러오기 실패:", error);
  }

  return defaultSettings;
}
