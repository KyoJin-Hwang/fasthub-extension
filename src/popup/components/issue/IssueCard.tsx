import { CircleDot, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { Issue } from "@/shared/types";

interface Props {
  issue: Issue;
}

export function IssueCard({ issue }: Props) {
  const handleClick = () => window.open(issue.html_url, "_blank");
  const getStatusColor = () =>
    issue.state === "open" ? "text-green-600" : "text-purple-600";

  const repoName = issue.repository_url
    ? issue.repository_url.split("/").slice(-2).join("/")
    : issue.html_url.split("/").slice(3, 5).join("/");

  return (
    <div
      onClick={handleClick}
      className="p-4 hover:bg-slate-50 cursor-pointer border-l-4 border-orange-500 border-b border-slate-200"
    >
      <div className="flex items-start gap-3">
        <CircleDot className={getStatusColor()} size={20} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold hover:underline truncate">
            {issue.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{repoName}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span className={getStatusColor()}>
              {issue.state === "open" ? "Open" : "Closed"}
            </span>
            <span>#{issue.number}</span>
            <span>{issue.user.login}</span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {issue.comments}
            </span>
            <span>
              {formatDistanceToNow(new Date(issue.updated_at), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
          {issue.labels.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {issue.labels.slice(0, 3).map((label) => (
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
