import { NavLink } from "react-router-dom";
import { FolderGit2, GitPullRequest, CircleDot } from "lucide-react";

export function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 p-3 text-xs transition-colors ${
      isActive
        ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        : "text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="w-20 border-r dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">
      <NavLink to="/" className={linkClass}>
        <FolderGit2 size={20} />
        <span>Repos</span>
      </NavLink>

      <NavLink to="/pull-requests" className={linkClass}>
        <GitPullRequest size={20} />
        <span>PRs</span>
      </NavLink>

      <NavLink to="/issues" className={linkClass}>
        <CircleDot size={20} />
        <span>Issues</span>
      </NavLink>
    </nav>
  );
}
