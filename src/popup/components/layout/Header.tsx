import { useAtom } from "jotai";
import { userAtom } from "@/popup/atoms/auth-atom";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const rateLimit = rateLimitMonitor.current;

  const getRateLimitColor = () => {
    if (!rateLimit) return "text-gray-500";
    if (rateLimit.remaining < 100) return "text-red-500";
    if (rateLimit.remaining < 1000) return "text-yellow-500";
    return "text-green-500";
  };

  const getPercent = () => {
    if (!rateLimit) return 0;
    return Math.round((rateLimit.remaining / rateLimit.limit) * 100);
  };

  const getResetTime = () => {
    if (!rateLimit?.reset) return "";
    const diff = rateLimit.reset.getTime() - Date.now();
    if (diff <= 0) return "리셋됨";
    const minutes = Math.floor(diff / 60000);
    return `${minutes}분 후`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">FastHub</h1>

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
        {rateLimit && (
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium ${getRateLimitColor()}`}>
              {rateLimit.remaining.toLocaleString()} / {rateLimit.limit.toLocaleString()}
            </span>
            <span className="text-gray-400">({getPercent()}%)</span>
            <span className="text-gray-400">{getResetTime()}</span>
          </div>
        )}

        <button
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
