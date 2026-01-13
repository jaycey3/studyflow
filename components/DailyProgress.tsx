import { Card } from "@heroui/react"
import { Goal } from "lucide-react"

export default function DailyProgress() {
    return (
        <Card className="bg-blue-600 w-full py-6">
            <Card.Content>
                <h3 className="text-gray-100 font-bold text-sm mb-2">Daily Goal</h3>
                <div className="flex items-center gap-4 mb-1">
                    <div className="bg-blue-500 rounded-2xl p-2">
                        <Goal className="text-white" size={32} />
                    </div>
                    <div className="w-full">
                        <h2 className="text-white text-2xl font-bold mb-2">40% Complete</h2>
                        <div className="w-full bg-blue-700 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-[40%]"></div>
                        </div>
                    </div>
                </div>
                <p className="text-gray-100 text-xs text-end">2/5 Tasks Completed</p>
            </Card.Content>
        </Card>
    )
}