import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/popup/components/ui/tabs";
import {
  useMyPullRequests,
  useReviewRequests,
  useParticipatingPRs,
} from "@/popup/hooks/usePullRequests";
import { PullRequestCard } from "@/popup/components/pull-request/PullRequestCard";
import { PullRequestListSkeleton } from "@/popup/components/common/Skeleton";
import { EmptyState } from "@/popup/components/common/EmptyState";
import { GitPullRequest, AlertCircle, UserCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { getOctokit } from "@/shared/github/client";

export function PullRequestsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("review-requests");

  const { data: myPRs, isLoading: loading1 } = useMyPullRequests();
  const { data: reviewRequests, isLoading: loading2 } = useReviewRequests();
  const { data: participating, isLoading: loading3 } = useParticipatingPRs();

  const isLoading = loading1 || loading2 || loading3;

  /**
   * WHY 새로고침 함수?
   * - 사용자가 수동으로 새로고침할 때 모든 탭의 API 다시 호출
   * - 성공/실패 시 토스트 알림 표시
   */
  const handleRefresh = useCallback(async () => {
    // 먼저 토스트 표시 (즉시 피드백)
    toast("PR 목록을 새로고침하는 중...");

    try {
      await queryClient.invalidateQueries({ queryKey: ["pull-requests"] });

      const octokit = await getOctokit();
      const rateLimitRes = await octokit.rest.rateLimit.get();
      rateLimitMonitor.update(rateLimitRes.headers, "search");

      toast.success("PR 목록이 업데이트되었습니다.");
    } catch (error) {
      toast.error("PR 목록 새로고침에 실패했습니다.");
    }
  }, [queryClient]);

  if (isLoading) return <PullRequestListSkeleton />;

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
          <TabsList className="bg-transparent">
            <TabsTrigger value="review-requests" className="gap-2">
              <AlertCircle size={16} />
              리뷰 요청 ({reviewRequests?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="mine" className="gap-2">
              <GitPullRequest size={16} />내 PR ({myPRs?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="participating" className="gap-2">
              <UserCheck size={16} />
              참여 중 ({participating?.length || 0})
            </TabsTrigger>
          </TabsList>

          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="새로고침"
          >
            <RefreshCw size={16} className="text-gray-500" />
          </button>
        </div>

        <TabsContent
          value="review-requests"
          className="flex-1 overflow-y-auto m-0"
        >
          {reviewRequests && reviewRequests.length > 0 ? (
            <div>
              {reviewRequests.map((pr) => (
                <PullRequestCard key={pr.id} pr={pr} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="리뷰 요청 없음"
              description="리뷰 요청된 PR이 없습니다"
            />
          )}
        </TabsContent>

        <TabsContent value="mine" className="flex-1 overflow-y-auto m-0">
          {myPRs && myPRs.length > 0 ? (
            <div>
              {myPRs.map((pr) => (
                <PullRequestCard key={pr.id} pr={pr} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={GitPullRequest}
              title="PR 없음"
              description="생성한 PR이 없습니다"
            />
          )}
        </TabsContent>

        <TabsContent
          value="participating"
          className="flex-1 overflow-y-auto m-0"
        >
          {participating && participating.length > 0 ? (
            <div>
              {participating.map((pr) => (
                <PullRequestCard key={pr.id} pr={pr} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="참여 중인 PR 없음"
              description="참여 중인 PR이 없습니다"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
