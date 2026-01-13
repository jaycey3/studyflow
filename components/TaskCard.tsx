"use client";

import { Card, Chip, Button, Select, ListBox } from "@heroui/react";
import { Trash, SquarePen, Circle, CircleMinus, Check, CircleAlert, TriangleAlert, Loader2, CalendarClock } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    title: string;
    description: string;
}

export default function TaskCard(props: TaskCardProps) {
    const [selectedPriority, setSelectedPriority] = useState<TaskCardProps["priority"]>(props.priority);
    const [selectedStatus, setSelectedStatus] = useState<TaskCardProps["status"]>(props.status);

    const priorityConfig = {
        low: {
            label: "Low",
            className: "text-blue-500 bg-blue-100",
            icon: <CircleMinus size={16} strokeWidth={3} />
        },
        medium: {
            label: "Medium",
            className: "text-amber-500 bg-amber-100",
            icon: <TriangleAlert size={16} strokeWidth={3} />
        },
        high: {
            label: "High",
            className: "text-red-500 bg-red-100",
            icon: <CircleAlert size={16} strokeWidth={3} />
        }
    };

    const statusConfig = {
        todo: {
            label: "To Do",
            className: "text-gray-500 bg-gray-100",
            icon: <Circle size={16} strokeWidth={3} />
        },
        doing: {
            label: "Doing",
            className: "text-amber-500 bg-amber-100",
            icon: <Loader2 size={16} strokeWidth={3} className="animate-spin" />
        },
        done: {
            label: "Done",
            className: "text-green-500 bg-green-100",
            icon: <Check size={16} strokeWidth={3} />
        }
    };

    const selectedStatusConfig = statusConfig[selectedStatus];
    const selectedPriorityConfig = priorityConfig[selectedPriority];

    return (
        <Card className="min-w-0 p-4">
            <Card.Content className="grid grid-cols-[5%_70%_15%] gap-10 ">
                <div className="justify-center flex items-center">
                    <Select defaultValue={selectedStatus} onChange={(key) => setSelectedStatus(key as TaskCardProps["status"])}>
                        <Select.Trigger className={`${selectedStatusConfig.className} bg-transparent `} aria-label="Change Status">
                            <Button isIconOnly className={`${selectedStatusConfig.className}`} >
                                {selectedStatusConfig.icon}
                            </Button>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="todo" className="text-gray-500 hover:bg-gray-100"><Circle size={16} strokeWidth={3} /> To Do</ListBox.Item>
                                <ListBox.Item id="doing" className="text-amber-500 hover:bg-amber-100"><Loader2 size={16} strokeWidth={3} />Doing</ListBox.Item>
                                <ListBox.Item id="done" className="text-green-500 hover:bg-green-100"><Check size={16} strokeWidth={3} /> Done</ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
                <div>
                    <Select defaultValue={selectedPriority} onChange={(key) => setSelectedPriority(key as TaskCardProps["priority"])}>
                        <Select.Trigger className={`${selectedPriorityConfig.className} bg-transparent w-8 p-0`} aria-label="Change Priority">
                            <Chip className={`${selectedPriorityConfig.className} h-7`} size="md">
                                {selectedPriorityConfig.icon} {selectedPriorityConfig.label}
                            </Chip>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="low" className="text-blue-500 hover:bg-blue-100"><CircleMinus size={16} strokeWidth={3} /> Low</ListBox.Item>
                                <ListBox.Item id="medium" className="text-amber-500 hover:bg-amber-100"><TriangleAlert size={16} strokeWidth={3} /> Medium</ListBox.Item>
                                <ListBox.Item id="high" className="text-red-500 hover:bg-red-100"><CircleAlert size={16} strokeWidth={3} /> High</ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <div className="ml-1">
                        <Card.Title className="text-lg">{props.title}</Card.Title>
                        <Card.Description className="text-base">{props.description}</Card.Description>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <Chip size="md">
                        <CalendarClock size={16} strokeWidth={2} />
                        <span>Feb 20</span>
                    </Chip>
                </div>
            </Card.Content>
        </Card>
    )
}