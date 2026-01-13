"use client";

import { Card, Chip, Button, Select, ListBox } from "@heroui/react";
import { Trash, SquarePen, Circle, CircleMinus, Check, CircleAlert, TriangleAlert, Loader2, Clock } from "lucide-react";
import { useState } from "react";

type UpcomingTaskCardProps = {
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    title: string;
    description: string;
}

export default function UpcomingTaskCard(props: UpcomingTaskCardProps) {
    const [selectedPriority, setSelectedPriority] = useState<UpcomingTaskCardProps["priority"]>(props.priority);
    const [selectedStatus, setSelectedStatus] = useState<UpcomingTaskCardProps["status"]>(props.status);

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
            icon: <Loader2 size={16} strokeWidth={3} />
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
            <Card.Content className="">
                <div className="flex flex-row justify-between mb-1">
                    <div className="flex flex-row gap-2">
                        <Chip className={`${selectedStatusConfig.className}`} size="md">
                            {selectedStatusConfig.icon} {selectedStatusConfig.label}
                        </Chip>
                        <Chip className={`${selectedPriorityConfig.className}`} size="md">
                            {selectedPriorityConfig.icon} {selectedPriorityConfig.label}
                        </Chip>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <Clock size={14} strokeWidth={2} />
                        <span className="text-sm">Feb 20</span>
                    </div>
                </div>
                <div>
                    <Card.Title className="text-base font-normal">{props.title}</Card.Title>
                </div>
            </Card.Content>
        </Card>
    )
}