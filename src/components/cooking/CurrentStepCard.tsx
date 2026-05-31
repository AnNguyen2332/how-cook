import { Timer } from "lucide-react";
import { formatResources, formatSeconds } from "@/lib/format";
import type { Dish, ScheduledTask } from "@/types/domain";

type CurrentStepCardProps = {
  task?: ScheduledTask;
  dish?: Dish;
  nextTask?: ScheduledTask;
  nextDish?: Dish;
  remainingSeconds: number;
  waitSeconds?: number;
  hasRemainingTasks?: boolean;
  paused: boolean;
};

export function CurrentStepCard({
  task,
  dish,
  nextTask,
  nextDish,
  remainingSeconds,
  waitSeconds,
  hasRemainingTasks = false,
  paused
}: CurrentStepCardProps) {
  if (!task) {
    if (hasRemainingTasks) {
      return (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Đang chờ</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
                Chưa tới bước chủ động tiếp theo
              </h2>
              <p className="mt-2 text-base text-zinc-500">
                {nextTask
                  ? `${nextTask.name} · ${nextDish?.name ?? "Món ăn"} · ${formatResources(nextTask.resources)}`
                  : "Không còn bước chủ động; theo dõi các bước chờ nếu còn."}
              </p>
            </div>
            <Timer className="h-7 w-7 text-zinc-500" />
          </div>

          <div className="grid min-h-64 place-items-center rounded-lg bg-zinc-100 px-4 py-8 text-center">
            <div>
              <div className="text-7xl font-semibold tracking-tight text-zinc-950 tabular md:text-8xl">
                {formatSeconds(waitSeconds ?? 0)}
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-500">
                {nextTask
                  ? "nữa đến bước chủ động tiếp theo"
                  : "theo dõi đồng hồ đang chạy"}
              </p>
            </div>
          </div>

          <p className="mt-5 rounded-lg bg-zinc-50 p-4 leading-7 text-zinc-600">
            Các bước chờ tự chạy sẽ xuất hiện ở khung Đồng hồ đang chạy khi tới
            giờ.
          </p>
        </section>
      );
    }

    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-950">
          Bữa ăn đã hoàn tất
        </h2>
        <p className="mt-2 text-zinc-500">
          Không còn bước đang chờ. Bạn có thể quay lại lịch nấu hoặc làm mới
          dữ liệu.
        </p>
      </section>
    );
  }

  const isExpired = remainingSeconds <= 0;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">
            Bước hiện tại
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
            {task.name}
          </h2>
          <p className="mt-2 text-base text-zinc-500">
            {dish?.name ?? "Món ăn"} · {formatResources(task.resources)}
          </p>
        </div>
        <Timer className="h-7 w-7 text-zinc-500" />
      </div>

      <div className="grid min-h-64 place-items-center rounded-lg bg-zinc-100 px-4 py-8 text-center">
        <div>
          <div className="text-7xl font-semibold tracking-tight text-zinc-950 tabular md:text-8xl">
            {formatSeconds(remainingSeconds)}
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-500">
            {paused
              ? "Đang tạm dừng"
              : isExpired
                ? "Hết giờ, bấm Hoàn tất khi bạn đã xong bước này"
                : "còn lại trong bước này"}
          </p>
        </div>
      </div>

      {task.description ? (
        <p className="mt-5 rounded-lg bg-zinc-50 p-4 leading-7 text-zinc-600">
          {task.description}
        </p>
      ) : null}
    </section>
  );
}
