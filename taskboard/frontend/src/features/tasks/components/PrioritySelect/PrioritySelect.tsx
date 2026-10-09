import type { TaskPriority } from "@/api"
import { Select, type SelectProps } from "@/shared/ui"
import { PRIORITY_OPTIONS } from "../../constants"

export type PrioritySelectProps = Omit<
	SelectProps<TaskPriority>,
	"options" | "label"
> & {
	label?: string
}

export function PrioritySelect({
	label = "Приоритет",
	...props
}: PrioritySelectProps) {
	return <Select label={label} options={PRIORITY_OPTIONS} {...props} />
}
