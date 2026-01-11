import { Tabs, Separator, Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";

import { AddTaskModal } from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";

export default function Home() {
  const date = new Date();

  function getWeekAroundToday() {
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i - 3);

      return {
        key: d.toISOString().split("T")[0],
        date: d,
        month: d.toLocaleDateString("en-US", { month: "long" }),
        day: d.toLocaleDateString("en-US", { day: "numeric" }),
        weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
        isToday: d.toDateString() === today.toDateString(),
      }
    })
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);

  const days = getWeekAroundToday();

  return (
      <Tabs hideSeparator defaultSelectedKey={days.find(d => d.isToday)?.key}>
        <Tabs.ListContainer className="flex items-center justify-between gap-4">
          <Button variant="ghost" className="text-neutral-700" isIconOnly>
            <ArrowLeft size={16} strokeWidth={3} />
          </Button>
          <Tabs.List className="h-20 gap-3 bg-transparent">
            {days.map(day => (
              <Tabs.Tab key={day.key} id={day.key} className="h-20 bg-gray-50 border-2 border-gray-200 rounded-3xl px-4 py-2">
                <div className="flex flex-col items-center">
                  <span>{day.weekday}</span>
                  <span className="text-2xl font-semibold">{day.day}</span>
                  <span className="text-xs text-neutral-500">{day.month}</span>
                </div>
                <Tabs.Indicator className="rounded-3xl"/>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Button variant="ghost" className="text-neutral-700" isIconOnly>
            <ArrowRight size={16} strokeWidth={3} />
          </Button>
        </Tabs.ListContainer>
        {days.map(day => (
          <Tabs.Panel key={day.key} id={day.key} className="pt-4 overflow-visible">
            <div className="flex items-center justify-between mt-5">
              <h1 className="text-4xl font-semibold mb-2">Good Morning, Jaycey!</h1>
              <AddTaskModal />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              <TaskCard title="Task 1" description="Description 1" priority="low" status="todo" />
              <TaskCard title="Task 2" description="Description 2" priority="medium" status="doing" />
              <TaskCard title="Task 3" description="Description 3" priority="high" status="done" />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
  );
}
