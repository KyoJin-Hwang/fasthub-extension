import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "@/popup/atoms/auth-atom";
import { getOctokit, resetOctokit } from "@/shared/github/client";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { RequestError } from "octokit";
import { Input } from "@/popup/components/ui/input";
import { Button } from "@/popup/components/ui/button";
import { toast } from "sonner";
import { Github } from "lucide-react";

export function LoginPage() {
  const [token, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedToken = token.trim();

    if (!trimmedToken) {
      toast.error("토큰을 입력하세요");
      return;
    }

    if (
      !trimmedToken.startsWith("ghp_") &&
      !trimmedToken.startsWith("github_pat_")
    ) {
      toast.error("올바른 GitHub Personal Access Token 형식이 아닙니다");
      return;
    }

    setIsLoading(true);

    try {
      await chrome.storage.local.set({ github_token: trimmedToken });

      resetOctokit();

      const octokit = await getOctokit();

      const [userRes, rateLimitRes] = await Promise.all([
        octokit.rest.users.getAuthenticated(),
        octokit.rest.rateLimit.get(),
      ]);

      const { data: userData } = userRes;
      const { data: rateLimitData } = rateLimitRes;

      rateLimitMonitor.update({
        "x-ratelimit-limit": String(rateLimitData.rate.limit),
        "x-ratelimit-remaining": String(rateLimitData.rate.remaining),
        "x-ratelimit-reset": String(rateLimitData.rate.reset),
      });

      setToken(trimmedToken);
      setUser(userData);

      toast.success(`${userData.login}님, 환영합니다!`);
      navigate("/");
    } catch (error) {
      const octokitError = error as RequestError;
      console.error("Login failed:", error);

      if (octokitError.status === 401) {
        toast.error("토큰이 유효하지 않습니다");
      } else if (octokitError.status === 403) {
        toast.error("API 요청 한도를 초과했습니다");
      } else if (octokitError.message?.includes("network")) {
        toast.error("인터넷 연결을 확인하세요");
      } else {
        toast.error("로그인 실패. 다시 시도하세요");
      }

      await chrome.storage.local.remove("github_token");
      resetOctokit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[600px] h-[500px] flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Github size={32} className="text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-800">FastHub</h1>
          </div>
          <p className="text-slate-600">GitHub를 더 빠르게</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Personal Access Token
            </label>
            <Input
              type="password"
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_••••••••••••••••••••••••"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,read:user,read:org&description=FastHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            토큰 발급하기 →
          </a>
          <p className="text-xs text-slate-500">
            필요 권한: repo, read:user, read:org
          </p>
        </div>
      </div>
    </div>
  );
}
