import { Tabs, Card, Chip, Button, Separator} from "@heroui/react";
import { Trash, SquarePen } from "lucide-react";

import TaskCard from "@/components/TaskCard";

export default function Home() {
  const date = new Date();

  const formattedDate = new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
  return (
    <div className="flex font-sans flex-col">
      <div className="w-[80%] mx-auto flex flex-col mt-4">
        <p className="font-medium text-2xl mx-auto">{formattedDate}</p>
        <Tabs className="w-full mt-4" defaultSelectedKey={"today"}>
          <Tabs.ListContainer>
            <Tabs.List>
              <Tabs.Tab id="2jan">
                2 Jan
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="3jan">
                3 Jan
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="yesterday">
                Yesterday
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="today">
                Today
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="tomorrow">
                Tomorrow
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="7jan">
                7 Jan
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="8jan">
                8 Jan
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id="2jan">
            <p>2 Jan</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="3jan">
            <p>3 Jan</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="yesterday">
            <p>Yesterday</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4 overflow-visible" id="today">
            <div className="grid grid-cols-3 gap-4">
              <TaskCard title="Task 1" description="Description 1" priority="low" status="todo" />
              
              <TaskCard title="Task 2" description="Description 2" priority="medium" status="doing" />
              <TaskCard title="Task 3" description="Description 3" priority="high" status="done" />            
            </div>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="tomorrow">
            <p>Tomorrow</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="7jan">
            <p>7 Jan</p>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="8jan">
            <p>8 Jan</p>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
