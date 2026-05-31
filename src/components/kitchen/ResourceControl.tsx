type ResourceControlProps = {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function ResourceControl({
  label,
  description,
  value,
  min = 0,
  max = 8,
  onChange
}: ResourceControlProps) {
  const update = (nextValue: number) => {
    onChange(Math.min(max, Math.max(min, nextValue)));
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <label className="text-sm font-semibold text-zinc-950">{label}</label>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label={`Giảm ${label}`}
            className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-100 text-lg font-bold text-zinc-800 disabled:opacity-40"
            disabled={value <= min}
            onClick={() => update(value - 1)}
            type="button"
          >
            -
          </button>
          <input
            aria-label={label}
            className="h-9 w-12 rounded-lg border border-zinc-200 bg-zinc-50 text-center font-semibold tabular text-zinc-950"
            max={max}
            min={min}
            onChange={(event) => update(Number(event.target.value))}
            type="number"
            value={value}
          />
          <button
            aria-label={`Tăng ${label}`}
            className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-950 text-lg font-bold text-white disabled:opacity-40"
            disabled={value >= max}
            onClick={() => update(value + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
