import { Card, Chip, Button } from "@heroui/react";
import { Trash, SquarePen, Check } from "lucide-react";

export default function TaskCard() {
    return (
        <Card className="min-w-0">
            <Card.Header>
                <div className="flex flex-row gap-3">
                    <Chip variant="soft" className="bg-green-100 text-green-500"><Check size={14} strokeWidth={3} /> Done</Chip>
                    <Chip variant="soft" className="bg-amber-100 text-amber-500">Medium</Chip>
                </div>
            </Card.Header>
            <Card.Content className="flex-row justify-between items-center">
                <div>
                    <Card.Title>Task Title</Card.Title>
                    <Card.Description>Task Description</Card.Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Button size="sm" variant="ghost" className=" text-amber-500 hover:bg-orange-50" isIconOnly><SquarePen /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" isIconOnly><Trash /></Button>
                </div>
            </Card.Content>
        </Card>
    )
}