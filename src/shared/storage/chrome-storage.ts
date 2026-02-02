/**
 * WHY: chrome.storage API는 콜백 기반 (구식)
 * Promise로 래핑해서 async/await 사용
 * 타입 안전성 추가
 */

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },

  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  },

  // sync는 여러 기기 동기화 (즐겨찾기 등)
  async getSync<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.sync.get(key);
    return (result[key] as T) ?? null;
  },

  async setSync<T>(key: string, value: T): Promise<void> {
    await chrome.storage.sync.set({ [key]: value });
  },
};
