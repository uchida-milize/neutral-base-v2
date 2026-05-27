"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast("プロジェクトを作成しました", {
            description: "5 秒以内に Undo できます",
          })
        }
      >
        通常トースト
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("保存しました", {
            description: "変更がサーバーに反映されました",
          })
        }
      >
        成功トースト
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("削除に失敗しました", {
            description: "ネットワーク接続を確認してください",
          })
        }
      >
        失敗トースト
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
              loading: "アップロード中…",
              success: "アップロード完了",
              error: "失敗しました",
            },
          )
        }
      >
        Promise トースト
      </Button>
    </div>
  );
}
