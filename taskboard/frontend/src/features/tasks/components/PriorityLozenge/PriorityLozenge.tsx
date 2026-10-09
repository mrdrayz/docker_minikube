import type { TaskPriority } from "@/api"
import { Lozenge } from "@/shared/ui"
import { PRIORITY_TONES } from "../../constants"
import { getPriorityLabel } from "../../lib"

export type PriorityLozengeProps = {
	priority: TaskPriority
}

export function PriorityLozenge({ priority }: PriorityLozengeProps) {
	return (
		<Lozenge tone={PRIORITY_TONES[priority]}>
			{getPriorityLabel(priority)}
		</Lozenge>
	)
}
