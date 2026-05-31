import { CheckCircle2, Pause, Play, SkipForward, TimerReset } from "lucide-react";

type CookingControlsProps = {
  paused: boolean;
  stepDisabled?: boolean;
  delayDisabled?: boolean;
  onDone: () => void;
  onSkip: () => void;
  onDelay: () => void;
  onTogglePause: () => void;
};

export function CookingControls({
  paused,
  stepDisabled = false,
  delayDisabled = false,
  onDone,
  onSkip,
  onDelay,
  onTogglePause
}: CookingControlsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
        onClick={onTogglePause}
        type="button"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        {paused ? "Tiếp tục" : "Tạm dừng"}
      </button>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={delayDisabled}
        onClick={onDelay}
        type="button"
      >
        <TimerReset className="h-4 w-4" />
        Dời 5 phút
      </button>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={stepDisabled}
        onClick={onSkip}
        type="button"
      >
        <SkipForward className="h-4 w-4" />
        Bỏ qua
      </button>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-zinc-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={stepDisabled}
        onClick={onDone}
        type="button"
      >
        <CheckCircle2 className="h-4 w-4" />
        Hoàn tất
      </button>
    </div>
  );
}
