import { useId, type FormEvent } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/api"
import { useAsyncAction, useFormState } from "@/shared/hooks"
import { confirmAction } from "@/shared/lib"
import {
	Button,
	ErrorBanner,
	Modal,
	ModalActions,
	TextArea,
	TextField,
} from "@/shared/ui"
import {
	DEFAULT_PRIORITY,
	DEFAULT_STATUS,
	TASK_DESCRIPTION_MAX,
	TASK_TITLE_MAX,
} from "../../constants"
import type { TaskDraft } from "../../types"
import { PrioritySelect } from "../PrioritySelect"
import { StatusSelect } from "../StatusSelect"
import styles from "./TaskFormModal.module.css"

export type TaskFormModalProps = {
	isOpen: boolean
	task?: Task
	initialStatus?: TaskStatus
	onClose: () => void
	onSubmit: (draft: TaskDraft) => Promise<unknown>
	onDelete?: () => Promise<unknown>
}

export function TaskFormModal({
	isOpen,
	task,
	onClose,
	...formProps
}: TaskFormModalProps) {
	const title = task ? `Задача #${task.id}` : "Создать задачу"

	return (
		<Modal isOpen={isOpen} title={title} onClose={onClose} size="lg">
			<TaskForm task={task} onClose={onClose} {...formProps} />
		</Modal>
	)
}

type TaskFormValues = {
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	dueDate: string
}

type TaskFormProps = Omit<TaskFormModalProps, "isOpen">

function TaskForm({
	task,
	initialStatus = DEFAULT_STATUS,
	onClose,
	onSubmit,
	onDelete,
}: TaskFormProps) {
	const fieldId = useId()
	const { error, isPending, run, clearError } = useAsyncAction()
	const { values, setField } = useFormState<TaskFormValues>({
		title: task?.title ?? "",
		description: task?.description ?? "",
		status: task?.status ?? initialStatus,
		priority: task?.priority ?? DEFAULT_PRIORITY,
		dueDate: task?.due_date ?? "",
	})
	const trimmedTitle = values.title.trim()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!trimmedTitle) return

		await run(async () => {
			await onSubmit({
				title: trimmedTitle,
				description: values.description.trim(),
				status: values.status,
				priority: values.priority,
				due_date: values.dueDate || null,
			})
			onClose()
		})
	}

	async function handleDelete() {
		if (!onDelete || !task) return

		if (!confirmAction(`Удалить задачу «${task.title}»?`)) return

		await run(async () => {
			await onDelete()
			onClose()
		})
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			{error && <ErrorBanner message={error} onClose={clearError} />}
			<TextField
				id={`${fieldId}-title`}
				label="Название"
				required
				value={values.title}
				onChange={(event) => setField("title", event.target.value)}
				maxLength={TASK_TITLE_MAX}
				placeholder="Что нужно сделать?"
			/>
			<TextArea
				id={`${fieldId}-description`}
				label="Описание"
				value={values.description}
				onChange={(event) =>
					setField("description", event.target.value)
				}
				maxLength={TASK_DESCRIPTION_MAX}
				placeholder="Подробности, ссылки, критерии готовности"
				rows={5}
				showCounter
			/>
			<div className={styles.row}>
				<StatusSelect
					id={`${fieldId}-status`}
					value={values.status}
					onValueChange={(status) => setField("status", status)}
				/>
				<PrioritySelect
					id={`${fieldId}-priority`}
					value={values.priority}
					onValueChange={(priority) => setField("priority", priority)}
				/>
				<TextField
					id={`${fieldId}-due-date`}
					type="date"
					label="Срок"
					value={values.dueDate}
					onChange={(event) =>
						setField("dueDate", event.target.value)
					}
				/>
			</div>
			<ModalActions>
				{onDelete && (
					<Button
						variant="dangerSubtle"
						onClick={handleDelete}
						disabled={isPending}
					>
						Удалить задачу
					</Button>
				)}
				<Button variant="subtle" onClick={onClose}>
					Отмена
				</Button>
				<Button
					type="submit"
					variant="primary"
					disabled={!trimmedTitle || isPending}
				>
					{task ? "Сохранить" : "Создать"}
				</Button>
			</ModalActions>
		</form>
	)
}
