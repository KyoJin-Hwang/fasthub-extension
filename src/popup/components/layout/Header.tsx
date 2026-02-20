import { useAtom } from "jotai";
import { userAtom } from "@/popup/atoms/auth-atom";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const rateLimit = rateLimitMonitor.current;

  // WHY 색상 함수? API 상태를 시각적으로 즉시 파악
  const getRateLimitColor = () => {
    if (!rateLimit) return "text-gray-500";
    if (rateLimit.remaining < 100) return "text-red-500"; // 위험
    if (rateLimit.remaining < 1000) return "text-yellow-500"; // 주의
    return "text-green-500"; // 안전
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">FastHub</h1>

        {/* WHY 사용자 정보? 어떤 계정인지 확인 */}
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-6 h-6 rounded-full"
            />
            <span>{user.login}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* WHY API 표시? 사용자가 상태 알아야 API 절약 */}
        {rateLimit && (
          <span className={`text-xs font-medium ${getRateLimitColor()}`}>
            {rateLimit.remaining} / {rateLimit.limit}
          </span>
        )}

        {/* WHY 설정 버튼? 알림 등 설정 필요 */}
        <button
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
