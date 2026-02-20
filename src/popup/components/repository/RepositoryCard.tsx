import { Star, GitFork } from "lucide-react";
import { useAtom } from "jotai";
import { favoritesAtom } from "@/popup/atoms/favorites-atom";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { Repository } from "@/shared/types";
import { languageColors } from "@/shared/language-colors";

interface Props {
  repo: Repository;
}

export function RepositoryCard({ repo }: Props) {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const isFavorite = favorites.includes(repo.id);

  // WHY toggleFavorite? 클릭 시 즐겨찾기 추가/제거
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기

    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== repo.id));
    } else {
      setFavorites([...favorites, repo.id]);
    }
  };

  // WHY handleClick? GitHub 페이지 새 탭으로 열기
  const handleClick = () => {
    window.open(repo.html_url, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-blue-600 hover:underline truncate">
            {repo.name}
          </h3>

          {repo.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColors[repo.language] || "#6e7681" }}
                />
                {repo.language}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Star size={12} />
              {repo.stargazers_count}
            </span>

            {repo.forks_count > 0 && (
              <span className="flex items-center gap-1">
                <GitFork size={12} />
                {repo.forks_count}
              </span>
            )}

            <span>
              {formatDistanceToNow(new Date(repo.updated_at), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
        </div>

        <button
          onClick={toggleFavorite}
          className="flex-shrink-0 p-2 hover:bg-slate-200 rounded transition-colors"
        >
          <Star
            size={18}
            className={
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
            }
          />
        </button>
      </div>
    </div>
  );
}
