import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ChefHat, Flame, Timer, Utensils, Play, SlidersHorizontal, CheckCircle2, AlertTriangle, Plus, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dishes = [
  { id: "rice", name: "Cơm trắng", time: 35, tags: ["nồi cơm điện", "giữ ấm"], selected: true },
  { id: "pork", name: "Thịt kho trứng", time: 65, tags: ["bếp", "nồi", "ăn nóng"], selected: true },
  { id: "soup", name: "Canh chua", time: 35, tags: ["bếp", "nồi", "gần cuối"], selected: true },
  { id: "veg", name: "Rau luộc", time: 12, tags: ["bếp", "ăn nóng"], selected: false },
  { id: "egg", name: "Trứng chiên", time: 8, tags: ["chảo", "rất nhanh"], selected: false },
];

const timeline = [
  { at: "18:00", title: "Vo gạo và cắm cơm", dish: "Cơm trắng", duration: "5 phút", type: "active", resource: "nồi cơm điện", state: "done" },
  { at: "18:05", title: "Sơ chế thịt và trứng", dish: "Thịt kho trứng", duration: "10 phút", type: "active", resource: "dao + thớt", state: "done" },
  { at: "18:15", title: "Ướp thịt", dish: "Thịt kho trứng", duration: "20 phút", type: "passive", resource: "chờ", state: "running" },
  { at: "18:20", title: "Sơ chế nguyên liệu canh", dish: "Canh chua", duration: "10 phút", type: "active", resource: "dao + thớt", state: "current" },
  { at: "18:35", title: "Bắt đầu kho thịt", dish: "Thịt kho trứng", duration: "35 phút", type: "passive", resource: "bếp 1 + nồi", state: "next" },
  { at: "18:45", title: "Nấu canh chua", dish: "Canh chua", duration: "20 phút", type: "active", resource: "bếp 2 + nồi", state: "next" },
  { at: "19:10", title: "Nêm lại và dọn món", dish: "Toàn bộ bữa ăn", duration: "5 phút", type: "active", resource: "phục vụ", state: "next" },
];

const resources = [
  { label: "Bếp", value: "2", icon: Flame },
  { label: "Nồi cơm điện", value: "Có", icon: Utensils },
  { label: "Mục tiêu", value: "19:15", icon: CalendarClock },
  { label: "Chế độ", value: "Ít stress", icon: SlidersHorizontal },
];

function StateBadge({ state, type }) {
  const label = state === "done" ? "Done" : state === "running" ? "Đang chạy" : state === "current" ? "Hiện tại" : type === "passive" ? "Chờ" : "Sắp tới";
  const className = state === "current"
    ? "bg-zinc-950 text-white"
    : state === "done"
    ? "bg-zinc-100 text-zinc-500"
    : state === "running"
    ? "bg-zinc-900/10 text-zinc-900"
    : "bg-white text-zinc-500 border border-zinc-200";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

export default function MealFlowPlannerPreview() {
  const [mode, setMode] = useState("timeline");
  const selectedDishes = useMemo(() => dishes.filter(d => d.selected), []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
              <ChefHat className="h-4 w-4" />
              Multi-dish cooking workflow optimizer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Meal Flow Planner</h1>
            <p className="mt-2 max-w-2xl text-zinc-600">Chọn nhiều món, set tài nguyên bếp, tạo timeline nấu tối ưu và chạy guided cooking với timer theo từng bước.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={mode === "timeline" ? "default" : "outline"} onClick={() => setMode("timeline")}>Timeline</Button>
            <Button variant={mode === "cook" ? "default" : "outline"} onClick={() => setMode("cook")}>Cooking Mode</Button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-5">
            <Card className="rounded-2xl border-zinc-200 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Bữa tối hôm nay</h2>
                  <Button size="sm" variant="outline"><Plus className="mr-1 h-4 w-4" />Thêm món</Button>
                </div>
                <div className="space-y-3">
                  {dishes.map((dish) => (
                    <div key={dish.id} className={`rounded-2xl border p-3 ${dish.selected ? "border-zinc-950 bg-white" : "border-zinc-200 bg-zinc-50 opacity-70"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{dish.name}</div>
                          <div className="mt-1 flex items-center gap-1 text-sm text-zinc-500"><Clock className="h-3.5 w-3.5" />~{dish.time} phút</div>
                        </div>
                        <div className={`mt-1 h-5 w-5 rounded-full border ${dish.selected ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white"}`} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dish.tags.map(tag => <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{tag}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-lg font-semibold">Kitchen setup</h2>
                <div className="grid grid-cols-2 gap-3">
                  {resources.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
                      <Icon className="mb-2 h-4 w-4 text-zinc-500" />
                      <div className="text-xs text-zinc-500">{label}</div>
                      <div className="font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" />Chỉnh tài nguyên</Button>
              </CardContent>
            </Card>
          </aside>

          <main>
            {mode === "timeline" ? (
              <Card className="rounded-2xl border-zinc-200 shadow-sm">
                <CardContent className="p-5 md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Generated cooking timeline</h2>
                      <p className="text-sm text-zinc-500">{selectedDishes.length} món được sắp xếp để hoàn thành khoảng 19:15.</p>
                    </div>
                    <Button><Play className="mr-2 h-4 w-4" />Start Cooking</Button>
                  </div>

                  <div className="space-y-3">
                    {timeline.map((item, index) => (
                      <motion.div
                        key={`${item.at}-${item.title}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={`grid gap-3 rounded-2xl border p-4 md:grid-cols-[80px_1fr_130px] md:items-center ${item.state === "current" ? "border-zinc-950 bg-white shadow-sm" : "border-zinc-200 bg-white"}`}
                      >
                        <div className="text-lg font-semibold tabular-nums">{item.at}</div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <StateBadge state={item.state} type={item.type} />
                          </div>
                          <div className="mt-1 text-sm text-zinc-500">{item.dish} · {item.duration} · {item.resource}</div>
                        </div>
                        <div className="flex justify-start md:justify-end">
                          <span className={`rounded-xl px-3 py-2 text-sm ${item.type === "passive" ? "bg-zinc-100 text-zinc-700" : "bg-zinc-950 text-white"}`}>{item.type === "passive" ? "Passive" : "Active"}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-600">
                    <div className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Nếu chỉ có 1 bếp, app sẽ tự dời “Nấu canh chua” sau bước “Bắt đầu kho thịt” hoặc đề xuất đổi thứ tự.</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <Card className="rounded-2xl border-zinc-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-zinc-500">Current step</p>
                        <h2 className="text-2xl font-semibold">Sơ chế nguyên liệu canh</h2>
                      </div>
                      <Timer className="h-7 w-7 text-zinc-500" />
                    </div>
                    <div className="mb-6 flex min-h-64 items-center justify-center rounded-2xl bg-zinc-100">
                      <div className="text-center">
                        <div className="text-7xl font-semibold tracking-tight tabular-nums">07:42</div>
                        <p className="mt-2 text-zinc-500">còn lại trong bước này</p>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Button size="lg" variant="outline">Pause</Button>
                      <Button size="lg" variant="outline">Delay 5 phút</Button>
                      <Button size="lg"><CheckCircle2 className="mr-2 h-4 w-4" />Done</Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-5">
                  <Card className="rounded-2xl border-zinc-200 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-semibold">Running timers</h3>
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-zinc-100 p-3">
                          <div className="flex justify-between text-sm"><span>Ướp thịt</span><span className="font-semibold tabular-nums">12:18</span></div>
                        </div>
                        <div className="rounded-2xl bg-zinc-100 p-3">
                          <div className="flex justify-between text-sm"><span>Cơm đang nấu</span><span className="font-semibold tabular-nums">24:10</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-zinc-200 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-semibold">Next steps</h3>
                      <div className="space-y-3 text-sm">
                        <div className="rounded-2xl border border-zinc-200 p-3">
                          <div className="font-medium">18:35 · Bắt đầu kho thịt</div>
                          <div className="text-zinc-500">Bếp 1 + nồi · 35 phút</div>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 p-3">
                          <div className="font-medium">18:45 · Nấu canh chua</div>
                          <div className="text-zinc-500">Bếp 2 + nồi · 20 phút</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
