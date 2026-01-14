import { Modal, Surface, Button, TextField, Input, Label, TextArea, Form, DateField, DateInputGroup, Select, ListBox } from "@heroui/react";
import { useActionState, useEffect, useState, useRef } from "react";
import { Trash, CheckCircle } from "lucide-react";
import { updateTask, deleteTask, SubmitState } from "@/lib/tasks/actions";
import { DateValue } from "@internationalized/date";
import { parseDate } from "@internationalized/date";

const initialState: SubmitState = { status: "idle" };

type EditTaskModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    task: {
        id: number;
        title: string;
        description: string;
        dueDate: string;
        priority: "low" | "medium" | "high";
        status: "todo" | "doing" | "done";
    } | null;
    onResult?: (state: SubmitState) => void;
}

type Priority = NonNullable<EditTaskModalProps["task"]>["priority"];
type Status = NonNullable<EditTaskModalProps["task"]>["status"];

export default function EditTaskModal({ isOpen, onOpenChange, task, onResult }: EditTaskModalProps) {
    const [updateState, updateAction, isUpdating] = useActionState(updateTask, initialState);
    const [deleteState, deleteAction, isDeleting] = useActionState(deleteTask, initialState);
    const loadedTaskIdRef = useRef<number | null>(null);
    const onResultRef = useRef(onResult);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDateValue, setDueDateValue] = useState<DateValue | null>(null);
    const [priority, setPriority] = useState<Priority>("low");
    const [status, setStatus] = useState<Status>("todo");

    const activeState = deleteState.status !== "idle" ? deleteState : updateState;

    useEffect(() => {
        if (!task || !isOpen) return;

        if (loadedTaskIdRef.current === task.id) return;
        loadedTaskIdRef.current = task.id;

        setTitle(task.title);
        setDescription(task.description);
        setDueDateValue(parseDate(task.dueDate));
        setPriority(task.priority);
        setStatus(task.status);
    }, [task, isOpen]);

    useEffect(() => {
        if (activeState.status === "success" || activeState.status === "error") {
            onResultRef.current?.(activeState);

            if (activeState.status === "success") {
                onOpenChange(false);
            }
        }
    }, [activeState, onOpenChange]);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading className="text-2xl font-semibold">Edit Task</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="p-6">
                                <Surface variant="default">
                                    <Form action={updateAction} className="flex flex-col gap-4">
                                        <input type="hidden" name="id" value={task?.id ?? ""} />
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
                                            <Select isRequired name="priority" placeholder="Select Priority" className="w-1/2" value={priority} onChange={(key) => setPriority(key as Priority)}>
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
                                            <Select isRequired name="status" placeholder="Select Status" className="w-1/2" value={status} onChange={(key) => setStatus(key as Status)}>
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
                                        <div className="flex flex-row gap-4 justify-end mt-4">
                                            <Button type="submit" className="bg-blue-600 w-full">
                                                <CheckCircle size={16} strokeWidth={3} className="inline mr-1" />
                                                {isUpdating ? "Updating..." : "Update Task"}
                                            </Button>
                                            <button className="button button--ghost hover:bg-red-100 text-red-600 w-full" formAction={deleteAction} type="submit">
                                                <Trash size={16} strokeWidth={3} className="inline mr-1" />
                                                {isDeleting ? "Deleting..." : "Delete Task"}
                                            </button>
                                        </div>
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