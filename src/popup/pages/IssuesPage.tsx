import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/popup/components/ui/tabs";
import {
  useAssignedIssues,
  useCreatedIssues,
  useMentionedIssues,
} from "@/popup/hooks/useIssues";
import { IssueCard } from "@/popup/components/issue/IssueCard";
import { IssueListSkeleton } from "@/popup/components/common/Skeleton";
import { EmptyState } from "@/popup/components/common/EmptyState";
import { CircleDot, UserCheck, AtSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { rateLimitMonitor } from "@/shared/github/rate-limit";
import { getOctokit } from "@/shared/github/client";

export function IssuesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("assigned");

  const { data: assigned, isLoading: loading1 } = useAssignedIssues();
  const { data: created, isLoading: loading2 } = useCreatedIssues();
  const { data: mentioned, isLoading: loading3 } = useMentionedIssues();

  const isLoading = loading1 || loading2 || loading3;

  /**
   * WHY 새로고침 함수?
   * - 사용자가 수동으로 새로고침할 때 모든 탭의 API 다시 호출
   * - 성공/실패 시 토스트 알림 표시
   */
  const handleRefresh = useCallback(async () => {
    // 먼저 토스트 표시 (즉시 피드백)
    toast("이슈 목록을 새로고침하는 중...");

    try {
      await queryClient.invalidateQueries({ queryKey: ["issues"] });

      const octokit = await getOctokit();
      const rateLimitRes = await octokit.rest.rateLimit.get();
      rateLimitMonitor.update(rateLimitRes.headers, "search");

      toast.success("이슈 목록이 업데이트되었습니다.");
    } catch (error) {
      toast.error("이슈 목록 새로고침에 실패했습니다.");
    }
  }, [queryClient]);

  if (isLoading) return <IssueListSkeleton />;

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="assigned"
              className="gap-2 data-[state=active]:bg-slate-100 hover:bg-slate-200"
            >
              <UserCheck size={16} />
              할당됨 ({assigned?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="created"
              className="gap-2 data-[state=active]:bg-slate-100 hover:bg-slate-200"
            >
              <CircleDot size={16} />
              생성함 ({created?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="mentioned"
              className="gap-2 data-[state=active]:bg-slate-100 hover:bg-slate-200"
            >
              <AtSign size={16} />
              멘션됨 ({mentioned?.length || 0})
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

        <TabsContent value="assigned" className="flex-1 overflow-y-auto m-0">
          {assigned && assigned.length > 0 ? (
            <div>
              {assigned.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="할당된 이슈 없음"
              description="할당된 이슈가 없습니다"
            />
          )}
        </TabsContent>

        <TabsContent value="created" className="flex-1 overflow-y-auto m-0">
          {created && created.length > 0 ? (
            <div>
              {created.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CircleDot}
              title="생성한 이슈 없음"
              description="생성한 이슈가 없습니다"
            />
          )}
        </TabsContent>

        <TabsContent value="mentioned" className="flex-1 overflow-y-auto m-0">
          {mentioned && mentioned.length > 0 ? (
            <div>
              {mentioned.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={AtSign}
              title="멘션 없음"
              description="멘션된 이슈가 없습니다"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
