import { useAtom } from "jotai";
import { settingsAtom } from "@/popup/atoms/settings-atom";
import { Switch } from "@/popup/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/popup/components/ui/select";
import { Input } from "@/popup/components/ui/input";

export function SettingsPage() {
  const [settings, setSettings] = useAtom(settingsAtom);

  // 전체 알림 토글
  const toggleEnabled = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  // 개별 알림 타입 토글
  const toggleNotificationType = (type: keyof typeof settings.types) => {
    setSettings((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type],
      },
    }));
  };

  // 체크 주기 변경
  const changeCheckInterval = (interval: number) => {
    setSettings((prev) => ({
      ...prev,
      checkInterval: interval as 3 | 5 | 10 | 15 | 30,
    }));
  };

  // 조용한 시간 모드 토글
  const toggleQuietHours = () => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }));
  };

  // 조용한 시간 변경
  const changeQuietHours = (type: "start" | "end", value: number) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [type]: value,
      },
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">알림 설정</h1>

      {/* 전체 알림 켜기/끄기 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">알림 활성화</h3>
          <p className="text-sm text-gray-500">
            알림을 활성화하거나 비활성화합니다
          </p>
        </div>
        <Switch checked={settings.enabled} onCheckedChange={toggleEnabled} />
      </div>

      {/* 체크 주기 설정 */}
      <div className="space-y-2">
        <h3 className="font-medium">체크 주기</h3>
        <p className="text-sm text-gray-500">GitHub 알림 확인 주기</p>
        <Select
          value={settings.checkInterval.toString()}
          onValueChange={(value) => changeCheckInterval(Number(value))}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3분</SelectItem>
            <SelectItem value="5">5분</SelectItem>
            <SelectItem value="10">10분</SelectItem>
            <SelectItem value="15">15분</SelectItem>
            <SelectItem value="30">30분</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 개별 알림 타입 설정 */}
      <div className="space-y-4">
        <h3 className="font-medium">알림 타입</h3>
        <p className="text-sm text-gray-500">받을 알림 종류를 선택하세요</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">코드 리뷰 요청</span>
              <p className="text-sm text-gray-500">Review Request 알림</p>
            </div>
            <Switch
              checked={settings.types.reviewRequest}
              onCheckedChange={() => toggleNotificationType("reviewRequest")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">멘션</span>
              <p className="text-sm text-gray-500">@멘션 알림</p>
            </div>
            <Switch
              checked={settings.types.mention}
              onCheckedChange={() => toggleNotificationType("mention")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">할당</span>
              <p className="text-sm text-gray-500">이슈/PR 할당 알림</p>
            </div>
            <Switch
              checked={settings.types.assigned}
              onCheckedChange={() => toggleNotificationType("assigned")}
              disabled={!settings.enabled}
            />
          </div>
        </div>
      </div>

      {/* 조용한 시간 설정 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">조용한 시간</h3>
            <p className="text-sm text-gray-500">
              지정된 시간에는 알림을 받지 않습니다
            </p>
          </div>
          <Switch
            checked={settings.quietHours.enabled}
            onCheckedChange={toggleQuietHours}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">시작:</label>
            <Input
              type="number"
              min="0"
              max="23"
              value={settings.quietHours.start}
              onChange={(e) =>
                changeQuietHours("start", Number(e.target.value))
              }
              className="w-16"
            />
            <span className="text-sm">시</span>
          </div>

          <span className="text-sm">~</span>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">종료:</label>
            <Input
              type="number"
              min="0"
              max="23"
              value={settings.quietHours.end}
              onChange={(e) => changeQuietHours("end", Number(e.target.value))}
              className="w-16"
            />
            <span className="text-sm">시</span>
          </div>
        </div>
      </div>

      {/* 현재 설정 표시 */}
      {/* <div className="p-4 rounded-lg">
        <h3 className="font-medium mb-2">현재 설정</h3>
        <pre className="text-xs p-2 rounded border">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
