"use client";

import { Card, Chip, Select, ListBox, Form } from "@heroui/react";
import { Circle, CircleMinus, Check, CircleAlert, TriangleAlert, Loader2, CalendarClock } from "lucide-react";
import { useState, useEffect, useMemo, useActionState, useRef } from "react";
import type { SubmitState } from "@/lib/tasks/actions";
import { updateTaskStatus, updateTaskPriority } from "@/lib/tasks/actions";

type TaskCardProps = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    onClick?: () => void;
    onResult?: (state: SubmitState) => void;
}

const initialState: SubmitState = { status: "idle" };

export default function TaskCard(props: TaskCardProps) {
    const [selectedPriority, setSelectedPriority] = useState<TaskCardProps["priority"]>(props.priority);
    const [selectedStatus, setSelectedStatus] = useState<TaskCardProps["status"]>(props.status);
    const statusFormRef = useRef<HTMLFormElement | null>(null);
    const priorityFormRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => setSelectedPriority(props.priority), [props.priority]);
    useEffect(() => setSelectedStatus(props.status), [props.status]);

    const [statusState, statusAction, isStatusPending] = useActionState(updateTaskStatus, initialState);
    const [priorityState, priorityAction, isPriorityPending] = useActionState(updateTaskPriority, initialState);

    useEffect(() => {
        if (statusState.status === "success" || statusState.status === "error") {
            props.onResult?.(statusState);
            if (statusState.status === "error") setSelectedStatus(props.status);
        }
    }, [statusState]);

    useEffect(() => {
        if (priorityState.status === "success" || priorityState.status === "error") {
            props.onResult?.(priorityState);
            if (priorityState.status === "error") setSelectedPriority(props.priority);
        }
    }, [priorityState]);

    const priorityConfig = useMemo(() => ({
        low: { label: "Low", className: "text-blue-600 bg-blue-100", icon: <CircleMinus size={16} strokeWidth={3} /> },
        medium: { label: "Medium", className: "text-amber-600 bg-amber-100", icon: <TriangleAlert size={16} strokeWidth={3} /> },
        high: { label: "High", className: "text-red-600 bg-red-100", icon: <CircleAlert size={16} strokeWidth={3} /> }
    }), []);

    const statusConfig = useMemo(() => ({
        todo: { label: "To Do", className: "text-blue-600 bg-blue-100", icon: <Circle size={16} strokeWidth={3} /> },
        doing: { label: "Doing", className: "text-amber-600 bg-amber-100", icon: <Loader2 size={16} strokeWidth={3} className="animate-spin" /> },
        done: { label: "Done", className: "text-green-600 bg-green-100", icon: <Check size={16} strokeWidth={3} /> },
    }), []);

    const selectedStatusConfig = statusConfig[selectedStatus];
    const selectedPriorityConfig = priorityConfig[selectedPriority];

    const formattedDueDate = new Date(props.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <Card className="min-w-0 p-4" onClick={props.onClick}>
            <Card.Content className="grid grid-cols-2 p-2">
                <div>
                    <div className="flex items-center gap-2">

                        <Form ref={statusFormRef} action={statusAction}>
                            <input type="hidden" name="id" value={props.id} />
                            <input type="hidden" name="status" value={selectedStatus} />

                            <Select
                                defaultValue={selectedStatus}
                                onChange={(key) => {
                                    const next = String(key) as TaskCardProps["status"];
                                    setSelectedStatus(next);
                                    queueMicrotask(() => statusFormRef.current?.requestSubmit());
                                }}
                                isDisabled={isStatusPending || isPriorityPending}
                                onClick={(e) => e.stopPropagation()}>
                                <Select.Trigger className={`${selectedStatusConfig.className} bg-transparent w-auto p-0`} aria-label="Change Status">
                                    <Chip className={`${selectedStatusConfig.className} h-7`} size="md">
                                        {selectedStatusConfig.icon} {selectedStatusConfig.label}
                                    </Chip>
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item id="todo" className="text-blue-600 hover:bg-blue-100"><Circle size={16} strokeWidth={3} /> To Do</ListBox.Item>
                                        <ListBox.Item id="doing" className="text-amber-600 hover:bg-amber-100"><Loader2 size={16} strokeWidth={3} /> Doing</ListBox.Item>
                                        <ListBox.Item id="done" className="text-green-600 hover:bg-green-100"><Check size={16} strokeWidth={3} /> Done</ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                            <button
                                type="submit"
                                className="hidden"
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        </Form>

                        <Form ref={priorityFormRef} action={priorityAction}>
                            <input type="hidden" name="id" value={props.id} />
                            <input type="hidden" name="priority" value={selectedPriority} />

                            <Select 
                            defaultValue={selectedPriority} 
                            onChange={(key) => {
                                const next = String(key) as TaskCardProps["priority"];
                                setSelectedPriority(next);
                                queueMicrotask(() => priorityFormRef.current?.requestSubmit());
                            }}
                            isDisabled={isStatusPending || isPriorityPending}
                            onClick={(e) => e.stopPropagation()}>
                                <Select.Trigger className={`${selectedPriorityConfig.className} bg-transparent w-auto p-0`} aria-label="Change Priority">
                                    <Chip className={`${selectedPriorityConfig.className} h-7`} size="md">
                                        {selectedPriorityConfig.icon} {selectedPriorityConfig.label}
                                    </Chip>
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item id="low" className="text-blue-600 hover:bg-blue-100"><CircleMinus size={16} strokeWidth={3} /> Low</ListBox.Item>
                                        <ListBox.Item id="medium" className="text-amber-600 hover:bg-amber-100"><TriangleAlert size={16} strokeWidth={3} /> Medium</ListBox.Item>
                                        <ListBox.Item id="high" className="text-red-600 hover:bg-red-100"><CircleAlert size={16} strokeWidth={3} /> High</ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                            <button
                                type="submit"
                                className="hidden"
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        </Form>
                    </div>
                    <div>
                        <Card.Title className="text-lg">{props.title}</Card.Title>
                        <Card.Description className="text-base">{props.description}</Card.Description>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <Chip size="md" className="w-auto">
                        <CalendarClock size={16} strokeWidth={2} />
                        <span>{formattedDueDate}</span>
                    </Chip>
                </div>
            </Card.Content>
        </Card>
    )
}