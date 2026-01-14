"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Button, Input, Label, Modal, Surface, TextField, TextArea, DateField, DateInputGroup, Select, ListBox, Form } from "@heroui/react";
import { Plus } from "lucide-react";
import type { DateValue } from "@internationalized/date";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

import { addTask, SubmitState } from "@/lib/tasks/actions";
const initialState: SubmitState = { status: "idle" };

type AddTaskModalProps = {
    onResult?: (state: SubmitState) => void;
}

export function AddTaskModal({ onResult }: AddTaskModalProps) {
    const [submitState, addTaskAction, isSubmitting] = useActionState(addTask, initialState);
    const [isOpen, setIsOpen] = useState(false);
    const onResultRef = useRef(onResult);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDateValue, setDueDateValue] = useState<DateValue | null>(null);
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("todo");

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        if (isOpen) {
            setDueDateValue(today(getLocalTimeZone()));
        }
    }, [isOpen]);

    useEffect(() => {
        if (submitState.status === "success" || submitState.status === "error") {
            onResultRef.current?.(submitState);

            if (submitState.status === "success") {
                setTitle("");
                setDescription("");
                setDueDateValue(null);
                setPriority("");
                setStatus("todo");
                setIsOpen(false);
            }
        }
    }, [submitState]);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                <Button className="bg-blue-600" size="lg" onPress={() => setIsOpen(true)}>
                    <Plus size={16} strokeWidth={3} />
                    Add Task
                </Button>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading className="text-2xl font-semibold">Add Task</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="p-6">
                                <Surface variant="default">
                                    <Form action={addTaskAction} className="flex flex-col gap-4">
                                        <TextField isRequired className="w-full" name="title" type="text" onChange={setTitle}>
                                            <Label>Title</Label>
                                            <Input value={title} placeholder="Enter task title" />
                                        </TextField>
                                        <TextField isRequired className="w-full" name="description" type="textarea" onChange={setDescription}>
                                            <Label>Description</Label>
                                            <TextArea value={description} placeholder="Enter task description" />
                                        </TextField>
                                        <DateField isRequired className="w-full" name="dueDate" value={dueDateValue} onChange={setDueDateValue} >
                                            <Label>Due Date</Label>
                                            <DateInputGroup>
                                                <DateInputGroup.Input>
                                                    {(segment) => <DateInputGroup.Segment segment={segment} />}
                                                </DateInputGroup.Input>
                                            </DateInputGroup>
                                        </DateField>
                                        <div className="flex flex-row gap-4 ">
                                            <Select isRequired name="priority" placeholder="Select Priority" className="w-1/2" value={priority} onChange={(key) => setPriority(key as string)}>
                                                <Label>Priority</Label>
                                                <Select.Trigger>
                                                    <Select.Value />
                                                    <Select.Indicator />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        <ListBox.Item id="low">Low</ListBox.Item>
                                                        <ListBox.Item id="medium">Medium</ListBox.Item>
                                                        <ListBox.Item id="high">High</ListBox.Item>
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                            <Select isRequired name="status" placeholder="Select Status" className="w-1/2" value={status} onChange={(key) => setStatus(key as string)}>
                                                <Label>Status</Label>
                                                <Select.Trigger>
                                                    <Select.Value />
                                                    <Select.Indicator />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        <ListBox.Item id="todo">To do</ListBox.Item>
                                                        <ListBox.Item id="doing">Doing</ListBox.Item>
                                                        <ListBox.Item id="done">Done</ListBox.Item>
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>
                                        <Button type="submit" className="bg-blue-600 mt-4 w-full" isDisabled={isSubmitting}>
                                            <Plus size={16} strokeWidth={3} />
                                            Add Task
                                        </Button>
                                    </Form>
                                </Surface>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    )
}