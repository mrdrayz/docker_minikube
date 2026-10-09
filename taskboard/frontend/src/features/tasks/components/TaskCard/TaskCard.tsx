import type { Task, TaskStatus } from "@/api"
import { cx, formatDate } from "@/shared/lib"
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	CalendarIcon,
} from "@/shared/ui"
import { getAdjacentStatuses, isTaskOverdue } from "../../lib"
import { PriorityLozenge } from "../PriorityLozenge"
import styles from "./TaskCard.module.css"

export type TaskCardProps = {
	task: Task
	onOpen: (task: Task) => void
	onMove: (task: Task, status: TaskStatus) => void
}

export function TaskCard({ task, onOpen, onMove }: TaskCardProps) {
	const { prev, next } = getAdjacentStatuses(task.status)
	const isOverdue = isTaskOverdue(task)

	return (
		<article className={cx(styles.card, styles[task.priority])}>
			<h3 className={styles.title}>
				<button
					type="button"
					className={cx(
						styles.open,
						task.status === "done" && styles.done,
					)}
					onClick={() => onOpen(task)}
				>
					{task.title}
				</button>
			</h3>

			{task.description && (
				<p className={styles.description}>{task.description}</p>
			)}

			<div className={styles.meta}>
				<PriorityLozenge priority={task.priority} />
				{task.due_date && (
					<span
						className={cx(styles.due, isOverdue && styles.overdue)}
					>
						<CalendarIcon size={13} />
						{isOverdue && "Просрочено: "}
						<time dateTime={task.due_date}>
							{formatDate(task.due_date)}
						</time>
					</span>
				)}
				<span className={styles.key}>#{task.id}</span>
			</div>

			{(prev || next) && (
				<div className={styles.actions}>
					{prev && (
						<Button
							size="sm"
							variant="subtle"
							aria-label={`Вернуть в «${prev.title}»`}
							title={`Вернуть в «${prev.title}»`}
							onClick={() => onMove(task, prev.id)}
						>
							<ArrowLeftIcon size={14} />
							{prev.title}
						</Button>
					)}
					{next && (
						<Button
							size="sm"
							variant="secondary"
							className={styles.next}
							aria-label={`Перенести в «${next.title}»`}
							title={`Перенести в «${next.title}»`}
							onClick={() => onMove(task, next.id)}
						>
							{next.title}
							<ArrowRightIcon size={14} />
						</Button>
					)}
				</div>
			)}
		</article>
	)
}
