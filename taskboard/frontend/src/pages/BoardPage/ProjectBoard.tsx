import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import type { ProjectInput, ProjectWithStats, Task, TaskStatus } from "@/api"
import {
	ProjectFormModal,
	ProjectSidebar,
	useProjects,
} from "@/features/projects"
import {
	TaskBoard,
	TaskFormModal,
	filterTasks,
	groupTasksByStatus,
	useTasks,
	type TaskDraft,
} from "@/features/tasks"
import { routes } from "@/shared/config"
import { useAsyncAction, useDocumentTitle } from "@/shared/hooks"
import {
	Button,
	ChevronRightIcon,
	ErrorBanner,
	ExpandableText,
	PlusIcon,
	SearchInput,
	SettingsIcon,
} from "@/shared/ui"
import styles from "./BoardPage.module.css"

type TaskModalState =
	| { mode: "closed" }
	| { mode: "create"; status: TaskStatus }
	| { mode: "edit"; task: Task }

export type ProjectBoardProps = {
	project: ProjectWithStats
}

export function ProjectBoard({ project }: ProjectBoardProps) {
	useDocumentTitle(project.name)
	const navigate = useNavigate()
	const projects = useProjects()
	const { error, run, clearError } = useAsyncAction()
	const tasks = useTasks(project.id, { run, onChange: projects.reload })

	const [query, setQuery] = useState("")
	const [taskModal, setTaskModal] = useState<TaskModalState>({
		mode: "closed",
	})
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	const filteredTasks = useMemo(
		() => filterTasks(tasks.tasks, query),
		[tasks.tasks, query],
	)
	const tasksByStatus = useMemo(
		() => groupTasksByStatus(filteredTasks),
		[filteredTasks],
	)
	const isFiltered = query.trim() !== ""

	const editedTask = taskModal.mode === "edit" ? taskModal.task : undefined
	const closeTaskModal = () => setTaskModal({ mode: "closed" })

	function handleTaskSubmit(draft: TaskDraft) {
		return editedTask
			? tasks.update(editedTask, draft)
			: tasks.create(draft)
	}

	function handleMove(task: Task, status: TaskStatus) {
		void run(() => tasks.move(task, status))
	}

	async function handleProjectUpdate(input: ProjectInput) {
		await projects.update(project.id, input)
	}

	async function handleProjectDelete() {
		await projects.remove(project.id)
		navigate(routes.projects, { replace: true })
	}

	return (
		<div className={styles.layout}>
			<ProjectSidebar
				project={project}
				onOpenSettings={() => setIsSettingsOpen(true)}
			/>

			<div className={styles.content}>
				<nav aria-label="Навигационная цепочка">
					<ol className={styles.breadcrumbs}>
						<li>
							<Link to={routes.projects}>Проекты</Link>
						</li>
						<li aria-hidden="true">
							<ChevronRightIcon size={14} />
						</li>
						<li aria-current="page" className={styles.currentCrumb}>
							{project.name}
						</li>
					</ol>
				</nav>

				<header className={styles.header}>
					<div className={styles.heading}>
						<h1 className={styles.title} title={project.name}>
							{project.name}
						</h1>
						{project.description && (
							<ExpandableText
								id={`project-${project.id}-description`}
								text={project.description}
								className={styles.description}
							/>
						)}
					</div>
					<Button
						className={styles.settingsButton}
						onClick={() => setIsSettingsOpen(true)}
					>
						<SettingsIcon />
						Настройки
					</Button>
				</header>

				<div className={styles.toolbar}>
					<SearchInput
						id="task-search"
						label="Поиск задач в проекте"
						placeholder="Поиск задач"
						value={query}
						onValueChange={setQuery}
						containerClassName={styles.search}
					/>
					{isFiltered && (
						<p className={styles.searchSummary} role="status">
							Найдено: {filteredTasks.length} из{" "}
							{tasks.tasks.length}
						</p>
					)}
					<Button
						variant="primary"
						className={styles.createButton}
						onClick={() =>
							setTaskModal({ mode: "create", status: "todo" })
						}
					>
						<PlusIcon />
						Создать задачу
					</Button>
				</div>

				{error && <ErrorBanner message={error} onClose={clearError} />}

				{tasks.isLoading ? (
					<p className={styles.status} role="status">
						Загружаем задачи…
					</p>
				) : (
					<TaskBoard
						tasksByStatus={tasksByStatus}
						isFiltered={isFiltered}
						onOpen={(task) => setTaskModal({ mode: "edit", task })}
						onMove={handleMove}
						onCreate={(status) =>
							setTaskModal({ mode: "create", status })
						}
					/>
				)}
			</div>

			<TaskFormModal
				isOpen={taskModal.mode !== "closed"}
				task={editedTask}
				initialStatus={
					taskModal.mode === "create" ? taskModal.status : undefined
				}
				onClose={closeTaskModal}
				onSubmit={handleTaskSubmit}
				onDelete={
					editedTask ? () => tasks.remove(editedTask) : undefined
				}
			/>

			<ProjectFormModal
				isOpen={isSettingsOpen}
				project={project}
				onClose={() => setIsSettingsOpen(false)}
				onSubmit={handleProjectUpdate}
				onDelete={handleProjectDelete}
			/>
		</div>
	)
}
