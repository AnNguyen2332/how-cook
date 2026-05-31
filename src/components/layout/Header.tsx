import { RotateCcw } from "lucide-react";
import type { AppView } from "@/types/domain";

type HeaderProps = {
  currentView: AppView;
  canOpenCooking: boolean;
  onViewChange: (view: AppView) => void;
  onLoadSample: () => void;
  onReset: () => void;
};

export function Header({
  currentView,
  canOpenCooking,
  onViewChange,
  onLoadSample,
  onReset
}: HeaderProps) {
  const tabs: Array<{ view: AppView; label: string; disabled?: boolean }> = [
    { view: "timeline", label: "Lịch nấu" },
    { view: "cook", label: "Đang nấu", disabled: !canOpenCooking }
  ];

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
            height={32}
            src="/how-cook-logo-mark.png"
            width={32}
          />
          Tối ưu quy trình nấu nhiều món
        </div>
        <h1 className="leading-none">
          <span className="sr-only">How Cook?</span>
          <img
            alt=""
            aria-hidden="true"
            className="block h-auto w-[min(430px,100%)] max-w-full"
            height={370}
            src="/how-cook-logo.png"
            width={1485}
          />
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Chọn nhiều món, cấu hình dụng cụ bếp, tạo lịch nấu hợp lý và làm
          theo từng bước với đồng hồ đếm ngược.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0 md:flex-col md:items-end lg:flex-row">
        <div className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-zinc-200">
          {tabs.map((tab) => (
            <button
              className={`h-10 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                currentView === tab.view
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
              disabled={tab.disabled}
              key={tab.view}
              onClick={() => onViewChange(tab.view)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="h-10 whitespace-nowrap rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            onClick={onLoadSample}
            type="button"
          >
            Bữa mẫu
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
            onClick={onReset}
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>
    </header>
  );
}
