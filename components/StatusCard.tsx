import { Card } from "@heroui/react"
import { CalendarCheck } from "lucide-react"

export default function StatusCard() {
    return (
        <Card className="w-full py-6">
            <Card.Content>
                <h3 className="text-neutral-700 font-bold text-sm mb-2">On Track</h3>
                <div className="flex items-center gap-4 mb-1">
                    <div className="bg-green-200 rounded-2xl p-2 justify-center flex">
                        <CalendarCheck className="text-green-600" size={32} strokeWidth={3}/>
                    </div>
                    <div className="w-full">
                        <h2 className="text-neutral-900 text-2xl font-bold">Good Pace</h2>
                        <p className="text-sm text-neutral-500">No overdue tasks</p>
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}