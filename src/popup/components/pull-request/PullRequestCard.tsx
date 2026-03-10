import { GitPullRequest, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { PullRequest } from "@/shared/types";

interface Props {
  pr: PullRequest;
}

export function PullRequestCard({ pr }: Props) {
  const handleClick = () => window.open(pr.html_url, "_blank");
  const getStatusColor = () =>
    pr.state === "open" ? "text-green-600" : "text-purple-600";
  const getStatusText = () => (pr.state === "open" ? "Open" : "Closed");

  // repository_url 없을 수도 있으니 html_url에서 추출
  const repoName = pr.repository_url
    ? pr.repository_url.split("/").slice(-2).join("/")
    : pr.html_url.split("/").slice(3, 5).join("/");

  return (
    <div
      onClick={handleClick}
      className="p-4 hover:bg-slate-50 cursor-pointer border-l-4 border-green-500 border-b border-slate-200"
    >
      <div className="flex items-start gap-3">
        <GitPullRequest className={getStatusColor()} size={20} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold hover:underline truncate">{pr.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{repoName}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span className={getStatusColor()}>{getStatusText()}</span>
            <span>#{pr.number}</span>
            <span>{pr.user.login}</span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {pr.comments}
            </span>
            <span>
              {formatDistanceToNow(new Date(pr.updated_at), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
          {pr.labels.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {pr.labels.slice(0, 3).map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-0.5 text-xs rounded"
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
