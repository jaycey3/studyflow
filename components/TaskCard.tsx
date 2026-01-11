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
            className: "text-blue-400",
            icon: <CircleMinus size={16} strokeWidth={3} />
        },
        medium: {
            label: "Medium",
            className: "text-amber-400",
            icon: <TriangleAlert size={16} strokeWidth={3} />
        },
        high: {
            label: "High",
            className: "text-red-400",
            icon: <CircleAlert size={16} strokeWidth={3} />
        }
    };

    const statusConfig = {
        todo: {
            label: "To Do",
            className: "text-gray-400",
            icon: <Circle size={16} strokeWidth={3} />
        },
        doing: {
            label: "Doing",
            className: "text-amber-400",
            icon: <Loader2 size={16} strokeWidth={3} className="animate-spin" />
        },
        done: {
            label: "Done",
            className: "text-green-400",
            icon: <Check size={16} strokeWidth={3} />
        }
    };

    const selectedStatusConfig = statusConfig[selectedStatus];
    const selectedPriorityConfig = priorityConfig[selectedPriority];

    return (
        <Card className="min-w-0">
            <Card.Header>
                <div className="flex flex-row gap-3">
                    <div className="flex flex-row gap-2 w-full">
                    <Select defaultValue={selectedPriority} onChange={(key) => setSelectedPriority(key as TaskCardProps["priority"])}>
                        <Select.Trigger className={`${selectedPriorityConfig.className} bg-gray-100 w-26`} aria-label="Change Priority">
                            <Select.Value className="flex items-center gap-2">
                                {selectedPriorityConfig.icon} {selectedPriorityConfig.label}
                            </Select.Value>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="low" className="text-blue-400"><CircleMinus size={16} strokeWidth={3} /> Low</ListBox.Item>
                                <ListBox.Item id="medium" className="text-amber-400"><TriangleAlert size={16} strokeWidth={3} /> Medium</ListBox.Item>
                                <ListBox.Item id="high" className="text-red-400"><CircleAlert size={16} strokeWidth={3} /> High</ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select defaultValue={selectedStatus} onChange={(key) => setSelectedStatus(key as TaskCardProps["status"])}>
                        <Select.Trigger className={`${selectedStatusConfig.className} bg-gray-100 w-26`} aria-label="Change Status">
                            <Select.Value className="flex items-center gap-2">
                                {selectedStatusConfig.icon} {selectedStatusConfig.label}
                            </Select.Value>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="todo" className="text-gray-400"><Circle size={16} strokeWidth={3} /> To Do</ListBox.Item>
                                <ListBox.Item id="doing" className="text-amber-400"><Loader2 size={16} strokeWidth={3} />Doing</ListBox.Item>
                                <ListBox.Item id="done" className="text-green-400"><Check size={16} strokeWidth={3} /> Done</ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    </div>
                    <Chip className="w-32 mb-3 text-gray-500 bg-gray-100" size="lg">
                        <CalendarClock size={16} strokeWidth={3} />
                        20-02-2026
                    </Chip>
                </div>
            </Card.Header>
            <Card.Content className="flex-row justify-between items-center">
                <div>
                    <Card.Title className="text-xl">{props.title}</Card.Title>
                    <Card.Description className="text-lg">{props.description}</Card.Description>
                </div>
                {/* <div className="flex flex-row gap-2">
                    <Button size="sm" variant="ghost" className=" text-amber-400 hover:bg-orange-50" isIconOnly><SquarePen size={16} strokeWidth={3} /></Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-50" isIconOnly><Trash size={16} strokeWidth={3} /></Button>
                </div> */}
            </Card.Content>
        </Card>
    )
}