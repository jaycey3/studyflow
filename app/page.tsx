"use client";

import { Tabs, Button, Chip, Modal } from "@heroui/react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState, useMemo, useTransition, useCallback, use } from "react";

import { AddTaskModal } from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";
import UpcomingTaskCard from "@/components/UpcomingTaskCard";
import DailyProgress from "@/components/DailyProgress";
import FocusIntensity from "@/components/FocusIntensity";
import StatusCard from "@/components/StatusCard";
import EditTaskModal from "@/components/EditTaskModal";
import type { Task } from "@/lib/tasks/actions";
import type { SubmitState } from "@/lib/tasks/actions";

type SelectedTask = {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  dueDate: string;
}

function toDateKeyLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKeyLocal(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastState, setToastState] = useState<SubmitState>({ status: "idle" });
  const [greeting, setGreeting] = useState(() => getGreeting());

  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcoming, setUpcoming] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const todayKey = useMemo(() => toDateKeyLocal(new Date()), []);

  function getGreeting(date = new Date()) {
    const hour = date.getHours();
    if (hour < 6) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  function getWindowAround(center: Date) {
    return Array.from({ length: 9 }, (_, i) => {
      const day = new Date(center);
      day.setDate(center.getDate() + i - 4);

      return {
        key: toDateKeyLocal(day),
        date: day,
        month: day.toLocaleDateString("en-US", { month: "long" }),
        day: day.toLocaleDateString("en-US", { day: "numeric" }),
        weekday: day.toLocaleDateString("en-US", { weekday: "long" }),
      }
    })
  }

  function upsert(list: Task[], task: Task) {
    const exists = list.some((x) => x.id === task.id);
    const next = exists ? list.map((x) => (x.id === task.id ? task : x)) : [task, ...list];
    return next.sort((a, b) => a.due_date.localeCompare(b.due_date));
  }

  function removeById(list: Task[], id: number) {
    return list.filter((x) => x.id !== id);
  }

  function addDaysLocal(yyyyMmDd: string, days: number) {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yy}-${mm}-${dd}`;
  }

  function inUpcomingrange(due: string, fromDate: string, days = 7) {
    const end = addDaysLocal(fromDate, days);
    return due >= fromDate && due <= end;
  }

  const applyMutation = useCallback((state: SubmitState) => {
    if (state.status !== "success") return;

    if (typeof state.deletedId === "number") {
      const id = state.deletedId;
      setTasks((cur) => removeById(cur, id));
      setUpcoming((cur) => removeById(cur, id));
      return;
    }

    if (state.task) {
      const task = state.task;

      setTasks((cur) => {
        if (!selectedKey) return cur;
        const onSelectedDay = task.due_date === selectedKey;
        if (!onSelectedDay) return removeById(cur, task.id);
        return upsert(cur, task);
      })

      setUpcoming((cur) => {
        const inRange = inUpcomingrange(task.due_date, todayKey, 7);
        if (!inRange) return removeById(cur, task.id);

        const next = upsert(cur, task);
        return next.slice(0, 5);
      })
    }
  }, [selectedKey, todayKey]);

  const fetchDayTasks = (dateKey: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/day?date=${encodeURIComponent(dateKey)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error((await res.json()).error ?? "Failed to fetch tasks.");
        }
        const data = await res.json();
        setTasks((data ?? []) as Task[]);
      } catch (e: any) {
        setError(e?.message ?? "An error occurred while fetching tasks.");
        setTasks([]);
      }
    })
  }

  const fetchUpcomingTasks = (fromDateKey: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/upcoming?fromDate=${encodeURIComponent(fromDateKey)}&days=7&limit=5`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error((await res.json()).error ?? "Failed to fetch upcoming tasks.");
        }
        const data = await res.json();
        setUpcoming((data ?? []) as Task[]);
      } catch {
        setUpcoming([]);
      }
    })
  }

  const shiftSelectedBy = (delta: number) => {
    if (!selectedKey) return;
    const date = fromDateKeyLocal(selectedKey);
    date.setDate(date.getDate() + delta);
    setSelectedKey(toDateKeyLocal(date));
  }

  const isTodaySelected = useMemo(() => {
    if (!selectedKey) return false;
    return selectedKey === todayKey;
  }, [selectedKey, todayKey]);

  const handleResult = useCallback((state: SubmitState) => {
    setToastState((prev) => {
      const prevMsg = "message" in prev ? prev.message : "";
      const nextMsg = "message" in state ? state.message : "";

      if (prev.status === state.status && prevMsg === nextMsg) {
        return prev;
      }
      return state;
    });

    if (state.status === "success") {
      applyMutation(state);
    }
  }, [applyMutation]);

  useEffect(() => {
    const tick = () => setGreeting(getGreeting());

    tick();

    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setSelectedKey(toDateKeyLocal(new Date()));
  }, []);

  const days = useMemo(() => {
    if (!selectedKey) return [];
    return getWindowAround(fromDateKeyLocal(selectedKey));
  }, [selectedKey]);

  useEffect(() => {
    if (!selectedKey) return;
    fetchDayTasks(selectedKey);
  }, [selectedKey]);

  useEffect(() => {
    fetchUpcomingTasks(todayKey);
  }, [todayKey]);

  useEffect(() => {
    if (toastState.status === "success" || toastState.status === "error") {
      setToastOpen(true);

      const timer = setTimeout(() => {
        setToastOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastState.status])

  if (days.length === 0) return null;


  return (
    <div className="w-full flex flex-col gap-5 mt-5">
      <div className="flex items-center justify-between my-5">
        <h1 className="text-4xl font-semibold mb-2">{greeting}, Jaycey! 👋</h1>
        <AddTaskModal onResult={handleResult} />
        {editOpen && (
          <EditTaskModal isOpen={editOpen} onOpenChange={setEditOpen} task={selectedTask} onResult={handleResult} />
        )}
      </div>
      <Tabs
        hideSeparator
        selectedKey={selectedKey}
        onSelectionChange={(key) => setSelectedKey(String(key))}
        className="w-full"
      >
        <Tabs.ListContainer className="relative w-full">
          <div
            className={[
              "absolute -top-10 left-1/2 -translate-x-1/2 z-10 transition-all duration-200",
              isTodaySelected ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"
            ].join(" ")}
          >
            <Button
              size="sm"
              variant="primary"
              className="shadow-sm bg-blue-600"
              onPress={() => setSelectedKey(todayKey)}
            >
              Today
            </Button>
          </div>

          <div className="grid grid-cols-[48px_1fr_48px] items-center">
            <Button variant="ghost" isIconOnly onClick={() => shiftSelectedBy(-1)} className="justify-self-start">
              <ArrowLeft size={16} strokeWidth={3} />
            </Button>

            <div className="flex justify-center">
              <Tabs.List className="h-24 gap-5 bg-transparent flex justify-center w-fit mx-auto">
                {days.map(day => (
                  <Tabs.Tab
                    key={day.key}
                    id={day.key}
                    className="h-24 w-24 bg-gray-50 border-2 border-gray-200 rounded-3xl data-selected:border-blue-600 data-selected:border-4 data-selected:text-neutral-900 data-selected:bg-white"
                  >
                    <div className="flex flex-col items-center">
                      <span>{day.weekday}</span>
                      <span className="text-2xl font-semibold">{day.day}</span>
                      <span className="text-xs text-neutral-500">{day.month}</span>
                    </div>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </div>

            <Button variant="ghost" isIconOnly onClick={() => shiftSelectedBy(1)} className="justify-self-end">
              <ArrowRight size={16} strokeWidth={3} />
            </Button>
          </div>
        </Tabs.ListContainer>

        {days.map(day => (
          <Tabs.Panel key={day.key} id={day.key} className="pt-4">
            <div className="grid grid-cols-3 gap-5 mb-4">
              <DailyProgress tasks={tasks} />
              <FocusIntensity />
              <StatusCard />
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-5">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-2 bg-blue-600 rounded-2xl" />
                    <h2 className="text-2xl font-medium">
                      Tasks for {day.weekday}, {day.month} {day.day}
                    </h2>
                  </div>

                  <Chip className="mt-2" size="lg">
                    <span>
                      {isPending ? "0 Due" : `${tasks.length} Due`}
                    </span>
                  </Chip>
                </div>

                {error && (
                  <div className="mb-4 text-red-600">{error}</div>
                )}

                <div className="flex flex-col gap-4">
                  {isPending && tasks.length === 0 ? (
                    <div>Loading tasks...</div>
                  ) : tasks.length === 0 ? (
                    <div>No tasks for this day.</div>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.due_date}
                        priority={task.priority}
                        status={task.status}
                        onResult={handleResult}
                        onClick={() => {
                          setSelectedTask({
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            dueDate: task.due_date,
                            priority: task.priority,
                            status: task.status,
                          });
                          setEditOpen(true);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium">Upcoming</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {upcoming.length === 0 ? (
                    <div>No upcoming tasks.</div>
                  ) : (
                    upcoming.map((task) => (
                      <UpcomingTaskCard
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        status={task.status}
                        dueDate={task.due_date}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
      <Modal isOpen={toastOpen} onOpenChange={setToastOpen}>
        <Modal.Backdrop variant="transparent">
          <Modal.Container placement="top" size="xs">
            <Modal.Dialog>
              <Modal.Body>
                <div
                  className={[
                    toastState.status === "success" ? "text-green-500" :
                      toastState.status === "error" ? "text-red-500" :
                        "text-neutral-900",
                    "flex items-center gap-2"
                  ].join(" ")}
                >
                  {toastState.status === "success" ? (
                    <CheckCircle size={20} className="inline mr-2" />
                  ) : toastState.status === "error" ? (
                    <XCircle size={20} className="inline mr-2" />
                  ) : null}
                  {"message" in toastState ? toastState.message : ""}
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
