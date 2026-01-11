"use client";

import { Button, Input, Label, Modal, Surface, TextField, TextArea, DateField, DateInputGroup, Select, ListBox } from "@heroui/react";
import { Plus } from "lucide-react";

export function AddTaskModal() {
    return (
        <Modal>
            <Button className="bg-neutral-900" size="lg">
                <Plus size={16} strokeWidth={3} />
                Add Task
            </Button>
            <Modal.Backdrop>
                <Modal.Container placement="auto">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Add Task</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <Surface variant="default">
                                <form className="flex flex-col gap-4">
                                    <TextField className="w-full" name="title" type="text">
                                        <Label>Title</Label>
                                        <Input placeholder="Enter task title" />
                                    </TextField>
                                    <TextField className="w-full" name="description" type="textarea">
                                        <Label>Description</Label>
                                        <TextArea placeholder="Enter task description" />
                                    </TextField>
                                    <DateField className="w-full" name="dueDate" >
                                        <Label>Due Date</Label>
                                        <DateInputGroup>
                                            <DateInputGroup.Input>
                                                {(segment) => <DateInputGroup.Segment segment={segment} />}
                                            </DateInputGroup.Input>
                                        </DateInputGroup>
                                    </DateField>
                                    <div className="flex flex-row gap-4 ">
                                        <Select placeholder="Select Priority" className="w-1/2">
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
                                        <Select placeholder="Select Status" className="w-1/2" defaultValue="todo">
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
                                </form>
                            </Surface>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}