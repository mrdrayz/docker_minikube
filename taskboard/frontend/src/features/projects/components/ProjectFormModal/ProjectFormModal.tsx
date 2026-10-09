import { useId, type FormEvent } from "react"
import type { Project, ProjectInput } from "@/api"
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
import { PROJECT_DESCRIPTION_MAX, PROJECT_NAME_MAX } from "../../constants"
import styles from "./ProjectFormModal.module.css"

export type ProjectFormModalProps = {
	isOpen: boolean
	project?: Project
	onClose: () => void
	onSubmit: (input: ProjectInput) => Promise<unknown>
	onDelete?: () => Promise<unknown>
}

export function ProjectFormModal({
	isOpen,
	project,
	onClose,
	onSubmit,
	onDelete,
}: ProjectFormModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			title={project ? "Настройки проекта" : "Создать проект"}
			onClose={onClose}
		>
			<ProjectForm
				project={project}
				onClose={onClose}
				onSubmit={onSubmit}
				onDelete={onDelete}
			/>
		</Modal>
	)
}

type ProjectFormProps = Omit<ProjectFormModalProps, "isOpen">

function ProjectForm({
	project,
	onClose,
	onSubmit,
	onDelete,
}: ProjectFormProps) {
	const fieldId = useId()
	const { error, isPending, run, clearError } = useAsyncAction()
	const { values, setField } = useFormState<ProjectInput>({
		name: project?.name ?? "",
		description: project?.description ?? "",
	})
	const trimmedName = values.name.trim()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!trimmedName) return

		await run(async () => {
			await onSubmit({
				name: trimmedName,
				description: values.description.trim(),
			})
			onClose()
		})
	}

	async function handleDelete() {
		if (!onDelete || !project) return

		if (
			!confirmAction(
				`Удалить проект «${project.name}» вместе со всеми задачами?`,
			)
		)
			return

		await run(onDelete)
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			{error && <ErrorBanner message={error} onClose={clearError} />}
			<TextField
				id={`${fieldId}-name`}
				label="Название"
				required
				value={values.name}
				onChange={(event) => setField("name", event.target.value)}
				maxLength={PROJECT_NAME_MAX}
				placeholder="Например, «Курс SRE»"
			/>
			<TextArea
				id={`${fieldId}-description`}
				label="Описание"
				value={values.description}
				onChange={(event) =>
					setField("description", event.target.value)
				}
				maxLength={PROJECT_DESCRIPTION_MAX}
				placeholder="Коротко: о чём этот проект"
				rows={3}
				showCounter
			/>
			<ModalActions>
				{onDelete && (
					<Button
						variant="dangerSubtle"
						onClick={handleDelete}
						disabled={isPending}
					>
						Удалить проект
					</Button>
				)}
				<Button variant="subtle" onClick={onClose}>
					Отмена
				</Button>
				<Button
					type="submit"
					variant="primary"
					disabled={!trimmedName || isPending}
				>
					{project ? "Сохранить" : "Создать"}
				</Button>
			</ModalActions>
		</form>
	)
}
