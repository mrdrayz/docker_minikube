import { TASK_STATUSES } from "../../constants"
import type { TasksByStatus } from "../../types"
import { TaskColumn, type TaskColumnProps } from "../TaskColumn"
import styles from "./TaskBoard.module.css"

export type TaskBoardProps = Pick<
	TaskColumnProps,
	"isFiltered" | "onOpen" | "onMove" | "onCreate"
> & {
	tasksByStatus: TasksByStatus
}

export function TaskBoard({ tasksByStatus, ...columnProps }: TaskBoardProps) {
	return (
		<div className={styles.board}>
			{TASK_STATUSES.map((status) => (
				<TaskColumn
					key={status.id}
					status={status}
					tasks={tasksByStatus[status.id]}
					{...columnProps}
				/>
			))}
		</div>
	)
}
