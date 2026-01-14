import { Card } from "@heroui/react"
import { Goal } from "lucide-react"
import type { Task } from "@/lib/tasks/actions";
import { useMemo } from "react";

type DailyProgressProps = {
    tasks: Task[];
}

export default function DailyProgress({ tasks }: DailyProgressProps) {
    const { total, done, percent, titleText } = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter((task) => task.status === "done").length;

        if (total === 0) {
            return {
                total,
                done,
                percent: 100,
                titleText: "No Tasks Today"
            }
        }

        const percent = Math.round((done / total) * 100);

        return {
            total,
            done,
            percent,
            titleText: `${percent}% Complete`
        }
    }, [tasks])

    return (
        <Card className="bg-blue-600 w-full py-6">
            <Card.Content>
                <h3 className="text-gray-100 font-bold text-sm mb-2">Daily Goal</h3>

                <div className="flex items-center gap-4 mb-1">
                    <div className="bg-blue-500 rounded-2xl p-2">
                        <Goal className="text-white" size={32} strokeWidth={2} />
                    </div>

                    <div className="w-full">
                        <h2 className="text-white text-2xl font-bold mb-2">{titleText}</h2>

                        <div className="w-full bg-blue-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-white h-2 rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                    </div>
                </div>
                <p className="text-gray-100 text-xs text-end">
                    {total === 0 ? (
                        "No tasks"
                    ) : (
                        `${done}/${total} Tasks Completed`
                    )}
                </p>
            </Card.Content>
        </Card>
    )
}