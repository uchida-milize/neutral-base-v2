"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("保存が完了しました", {
            description: "変更内容はすべてサーバーに反映されました。",
          })
        }
      >
        成功通知
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("エラーが発生しました", {
            description: "サーバーに接続できません。ネットワークをご確認ください。",
          })
        }
      >
        エラー通知
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("ご注意", {
            description: "パスワードの有効期限が 3 日以内に切れます。",
          })
        }
      >
        警告通知
      </Button>
    </div>
  );
}
