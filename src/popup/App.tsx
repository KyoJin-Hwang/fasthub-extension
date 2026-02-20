import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "./atoms/auth-atom";
import { getOctokit } from "@/shared/github/client";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { LoginPage } from "./pages/LoginPage";
import { RepositoriesPage } from "./pages/RepositoriesPage";
// import { PullRequestsPage } from './pages/PullRequestsPage'
// import { IssuesPage } from './pages/IssuesPage'
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function initAuth() {
      try {
        const result = (await chrome.storage.local.get("github_token")) as {
          github_token?: string;
        };
        if (result.github_token) {
          setToken(result.github_token);
        }
      } catch (error) {
        console.error("Failed to load token:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [setToken]);

  useEffect(() => {
    async function checkAuth() {
      if (token && !user) {
        try {
          const octokit = await getOctokit();
          const { data } = await octokit.rest.users.getAuthenticated();
          setUser(data);
        } catch (error) {
          console.error("Auto login failed:", error);
          navigate("/login");
        }
      }
    }

    checkAuth();
  }, [token, user, setUser, navigate]);

  if (isLoading) {
    return null;
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="w-[600px] h-[500px] flex flex-col bg-slate-100">
      {/* WHY Header? 모든 페이지 공통 - 사용자 정보, API Rate Limit */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* WHY Navigation? 좌측 탭 메뉴 - Repos/PRs/Issues */}
        <Navigation />

        {/* WHY Routes? 페이지 라우팅 - 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Routes>
            <Route path="/" element={<RepositoriesPage />} />
            {/* <Route path="/pull-requests" element={<PullRequestsPage />} /> */}
            {/* <Route path="/issues" element={<IssuesPage />} /> */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
