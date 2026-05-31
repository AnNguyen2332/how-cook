import { AlertTriangle } from "lucide-react";
import type { SchedulerWarning } from "@/types/domain";

type TimelineWarningPanelProps = {
  warnings: SchedulerWarning[];
};

export function TimelineWarningPanel({ warnings }: TimelineWarningPanelProps) {
  if (warnings.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-100 p-4 text-sm text-zinc-600">
        Lịch nấu hiện không có cảnh báo lớn. Bạn vẫn có thể điều chỉnh tài
        nguyên bếp rồi tạo lại nếu muốn nhẹ tay hơn.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-100 p-4">
      <div className="mb-2 flex items-center gap-2 font-semibold text-zinc-900">
        <AlertTriangle className="h-4 w-4" />
        Cảnh báo lịch nấu
      </div>
      <ul className="space-y-2 text-sm leading-6 text-zinc-600">
        {warnings.map((warning) => (
          <li key={`${warning.type}-${warning.message}`}>{warning.message}</li>
        ))}
      </ul>
    </div>
  );
}
