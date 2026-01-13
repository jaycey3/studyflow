import { Card } from "@heroui/react"
import { TrendingUp } from "lucide-react"

export default function FocusIntensity() {
    return (
        <Card className="w-full py-6">
            <Card.Content>
                <h3 className="text-neutral-700 font-bold text-sm mb-2">Focus Intensity</h3>
                <div className="flex items-center gap-4 mb-1">
                    <div className="bg-red-200 rounded-2xl p-2">
                        <TrendingUp className="text-red-600" size={32} strokeWidth={3}/>
                    </div>
                    <div className="w-full">
                        <h2 className="text-neutral-900 text-2xl font-bold">High</h2>
                        <p className="text-sm text-neutral-500">3 High Priority tasks today</p>
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}