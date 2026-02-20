import { useState } from "react";
import {
  useRepositories,
  useSearchRepositories,
} from "@/popup/hooks/useRepositories";
import { RepositoryCard } from "@/popup/components/repository/RepositoryCard";
import { RepositoryListSkeleton } from "@/popup/components/common/Skeleton";
import { EmptyState } from "@/popup/components/common/EmptyState";
import { Input } from "@/popup/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/popup/components/ui/tabs";
import { Search, FolderGit2, RefreshCw, Star } from "lucide-react";
import { useAtom } from "jotai";
import { favoritesAtom } from "@/popup/atoms/favorites-atom";
import { toast } from "sonner";

export function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allRepos, isLoading, error, refetch } = useRepositories();
  const { data: searchResults } = useSearchRepositories(searchQuery);
  // favorites? 즐겨찾기 필터링
  const [favorites] = useAtom(favoritesAtom);

  // WHY displayRepos? 검색어 있으면 검색 결과, 없으면 전체
  const displayRepos = searchQuery ? searchResults : allRepos;

  // WHY favoriteRepos? 즐겨찾기한 레포만 필터링
  const favoriteRepos =
    allRepos?.filter((repo) => favorites.includes(repo.id)) || [];

  // WHY 강제 Repository 목록 새로고침
  const handleRefresh = async () => {
    const result = await refetch();
    if (result.error) {
      toast.error("Repository 목록 새로고침 실패하였습니다.");
    } else {
      toast.success("Repository 목록이 업데이트되었습니다.");
    }
  };

  if (isLoading) {
    return <RepositoryListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Repository를 불러올 수 없습니다</p>
        <button
          onClick={handleRefresh}
          className="text-blue-500 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* WHY 검색바? 사용자가 레포 검색 */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Repository 검색..."
              className="pl-10"
            />
          </div>

          {/* WHY 새로고침 버튼? 캐시 무시하고 최신 데이터 */}
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            title="새로고침"
          >
            <RefreshCw size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* WHY Tabs? 전체 vs 즐겨찾기 필터 */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="px-4 bg-white border-b border-slate-200">
          <TabsTrigger value="all" className="gap-2">
            <FolderGit2 size={16} />
            전체 ({allRepos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star size={16} />
            즐겨찾기 ({favoriteRepos.length})
          </TabsTrigger>
        </TabsList>

        {/* WHY TabsContent? 탭별 컨텐츠 */}
        <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
          {displayRepos && displayRepos.length > 0 ? (
            <div>
              {displayRepos.map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderGit2}
              title={searchQuery ? "검색 결과 없음" : "Repository 없음"}
              description={
                searchQuery
                  ? "다른 검색어를 시도해보세요"
                  : "새 Repository를 만들어보세요"
              }
            />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="flex-1 overflow-y-auto m-0">
          {favoriteRepos.length > 0 ? (
            <div>
              {favoriteRepos.map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="즐겨찾기 없음"
              description="별 아이콘을 눌러 즐겨찾기를 추가하세요"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
