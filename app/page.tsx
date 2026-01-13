"use client";

import { Tabs, Separator, Button, Chip } from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { AddTaskModal } from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";
import UpcomingTaskCard from "@/components/UpcomingTaskCard";
import DailyProgress from "@/components/DailyProgress";
import FocusIntensity from "@/components/FocusIntensity";
import StatusCard from "@/components/StatusCard";

export default function Home() {
  const [days, setDays] = useState<any[]>([]);

  function getWeekAround(base: Date) {
    return Array.from({ length: 9 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i - 4);

      return {
        key: d.toISOString().split("T")[0],
        date: d,
        month: d.toLocaleDateString("en-US", { month: "long" }),
        day: d.toLocaleDateString("en-US", { day: "numeric" }),
        weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
        isToday: d.toDateString() === base.toDateString(),
      }
    })
  }

  useEffect(() => {
    const now = new Date();
    setDays(getWeekAround(now));
  }, []);

  if (days.length === 0) {
    return null;
  }

  const defaultKey = days.find(d => d.isToday)?.key;

  return (
    <div className="w-full flex flex-col gap-5 mt-5">
      <div className="flex items-center justify-between my-5">
        <h1 className="text-4xl font-semibold mb-2">Good Morning, Jaycey! 👋</h1>
        <AddTaskModal />
      </div>
      <Tabs hideSeparator defaultSelectedKey={defaultKey} className="w-full">
        <Tabs.ListContainer className="flex items-center gap-5 mx-auto">
          <Button variant="ghost" isIconOnly>
            <ArrowLeft size={16} strokeWidth={3} />
          </Button>
          <Tabs.List className="h-24 w-full gap-5 bg-transparent">
            {days.map(day => (
              <Tabs.Tab key={day.key} id={day.key} className="h-24 w-24 bg-gray-50 border-2 border-gray-200 rounded-3xl data-selected:border-blue-600 data-selected:border-4 data-selected:text-neutral-900 data-selected:bg-white">
                <div className="flex flex-col items-center">
                  <span>{day.weekday}</span>
                  <span className="text-2xl font-semibold">{day.day}</span>
                  <span className="text-xs text-neutral-500">{day.month}</span>
                </div>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Button variant="ghost" isIconOnly>
            <ArrowRight size={16} strokeWidth={3} />
          </Button>
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
                    <h2 className="text-2xl font-medium">Tasks for {day.weekday}, {day.month} {day.day}</h2>
                  </div>
                  <Chip className="mt-2" size="lg">
                    <span>3 Due</span>
                  </Chip>
                </div>
                <div className="flex flex-col gap-4">
                  <TaskCard title="Task 1" description="Description 1" priority="low" status="todo" />
                  <TaskCard title="Task 2" description="Description 2" priority="medium" status="doing" />
                  <TaskCard title="Task 3" description="Description 3" priority="high" status="done" />
                  <TaskCard title="Task 4" description="Description 4" priority="medium" status="todo" />

                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium">Upcoming</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <UpcomingTaskCard title="Apply Norman Design principles" description="Description 4" priority="low" status="todo" />
                  <UpcomingTaskCard title="Task 5" description="Description 5" priority="medium" status="doing" />
                  <UpcomingTaskCard title="Task 6" description="Description 6" priority="high" status="done" />
                </div>
              </div>


            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
