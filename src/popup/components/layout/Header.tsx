import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/popup/atoms/auth-atom";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * WHY rate limit을 표시하지 않음?
 * - Search API (30)와 일반 API (5000)가 다르기 때문에 복잡함
 * - 대신 다 떨어지면 토스트 알림으로 경고
 */
export function Header() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const prevSearchRemaining = useRef<number | null>(null);
  const prevCoreRemaining = useRef<number | null>(null);

  useEffect(() => {
    const checkRateLimit = () => {
      const search = rateLimitMonitor.searchLimit;
      const core = rateLimitMonitor.coreLimit;

      if (search && prevSearchRemaining.current !== null) {
        if (prevSearchRemaining.current > 10 && search.remaining <= 10) {
          toast.warning(`검색 API가 ${search.remaining}번 남았습니다.`);
        } else if (prevSearchRemaining.current > 5 && search.remaining <= 5) {
          toast.error(`검색 API가 ${search.remaining}번 남았습니다!`);
        }
      }
      if (search) prevSearchRemaining.current = search.remaining;

      if (core && prevCoreRemaining.current !== null) {
        if (prevCoreRemaining.current > 1000 && core.remaining <= 1000) {
          toast.warning(`API가 ${core.remaining}번 남았습니다.`);
        } else if (prevCoreRemaining.current > 100 && core.remaining <= 100) {
          toast.error(`API가 ${core.remaining}번 남았습니다!`);
        }
      }
      if (core) prevCoreRemaining.current = core.remaining;
    };

    checkRateLimit();
  }, []);

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
