import type { TaskStatus } from "@/api"
import { Select, type SelectProps } from "@/shared/ui"
import { STATUS_OPTIONS } from "../../constants"

export type StatusSelectProps = Omit<
	SelectProps<TaskStatus>,
	"options" | "label"
> & {
	label?: string
}

export function StatusSelect({
	label = "Статус",
	...props
}: StatusSelectProps) {
	return <Select label={label} options={STATUS_OPTIONS} {...props} />
}
