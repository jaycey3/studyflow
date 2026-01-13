"use client";

import { Tabs, Button, Chip } from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo, useTransition } from "react";

import { AddTaskModal } from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";
import UpcomingTaskCard from "@/components/UpcomingTaskCard";
import DailyProgress from "@/components/DailyProgress";
import FocusIntensity from "@/components/FocusIntensity";
import StatusCard from "@/components/StatusCard";

import { getTasksForDate, getUpcomingTasks } from "@/lib/tasks/actions";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  due_date: string;
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
  const [days, setDays] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcoming, setUpcoming] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const todayKey = useMemo(() => toDateKeyLocal(new Date()), []);

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

  const refreshDayTasks = (dateKey: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await getTasksForDate(dateKey);
        setTasks((data ?? []) as Task[]);
      } catch (e: any) {
        setError(e?.message ?? "An error occurred while fetching tasks.");
        setTasks([]);
      }
    })
  }

  const refreshUpcoming = (fromDateKey: string) => {
    startTransition(async () => {
      try {
        const data = await getUpcomingTasks(fromDateKey, 7, 5);
        setUpcoming((data ?? []) as Task[]);
      } catch {
        setUpcoming([]);
      }
    })
  }

  const refreshAll = () => {
    if (!selectedKey) return;
    refreshDayTasks(selectedKey);
    refreshUpcoming(todayKey);
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

  useEffect(() => {
    const now = new Date();
    const key = toDateKeyLocal(now);

    setSelectedKey(key);
    setDays(getWindowAround(now));
  }, []);

  useEffect(() => {
    if (!selectedKey) return;

    const center = fromDateKeyLocal(selectedKey);
    setDays(getWindowAround(center));

    refreshDayTasks(selectedKey);
    refreshUpcoming(todayKey);
  }, [selectedKey, todayKey]);

  if (days.length === 0) return null;


  return (
    <div className="w-full flex flex-col gap-5 mt-5">
      <div className="flex items-center justify-between my-5">
        <h1 className="text-4xl font-semibold mb-2">Good Morning, Jaycey! 👋</h1>
        <AddTaskModal onSuccess={refreshAll} />
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
              "absolute -top-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-200",
              isTodaySelected ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"
            ].join(" ")}
          >
            <Button
              size="sm"
              variant="primary"
              className="shadow-sm"
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
              <Tabs.List className="h-24 gap-5 bg-transparent flex justify-center w-fit mx-auto gap-5">
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
              <DailyProgress />
              <FocusIntensity />
              <StatusCard />
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-10">
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
    </div>
  );
}
