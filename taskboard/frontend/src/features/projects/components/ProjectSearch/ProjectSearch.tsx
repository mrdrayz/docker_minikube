import { useId, useState, type KeyboardEvent } from "react"
import { useNavigate } from "react-router"
import type { ProjectWithStats } from "@/api"
import { routes } from "@/shared/config"
import { cx } from "@/shared/lib"
import { Avatar, SearchInput } from "@/shared/ui"
import { filterProjects } from "../../lib"
import { useProjects } from "../../model"
import styles from "./ProjectSearch.module.css"

const MAX_RESULTS = 8

export type ProjectSearchProps = {
	className?: string
}

export function ProjectSearch({ className }: ProjectSearchProps) {
	const { items } = useProjects()
	const navigate = useNavigate()
	const listboxId = useId()
	const [query, setQuery] = useState("")
	const [isOpen, setIsOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(0)

	const results = filterProjects(items, query).slice(0, MAX_RESULTS)
	const activeProject = results[activeIndex]
	const optionId = (project: ProjectWithStats) =>
		`${listboxId}-option-${project.id}`

	function openProject(project: ProjectWithStats) {
		navigate(routes.project(project.id))
		setQuery("")
		setIsOpen(false)
	}

	function handleQueryChange(value: string) {
		setQuery(value)
		setActiveIndex(0)
		setIsOpen(true)
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault()
			setIsOpen(true)

			if (results.length === 0) return

			const step = event.key === "ArrowDown" ? 1 : -1

			setActiveIndex(
				(index) => (index + step + results.length) % results.length,
			)
		} else if (event.key === "Enter" && isOpen && activeProject) {
			event.preventDefault()
			openProject(activeProject)
		} else if (event.key === "Escape") {
			setIsOpen(false)
		}
	}

	return (
		<div className={cx(styles.search, className)}>
			<SearchInput
				id={`${listboxId}-input`}
				label="Поиск проектов"
				placeholder="Поиск проектов"
				value={query}
				onValueChange={handleQueryChange}
				role="combobox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				aria-autocomplete="list"
				aria-activedescendant={
					isOpen && activeProject
						? optionId(activeProject)
						: undefined
				}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setIsOpen(false)}
				onKeyDown={handleKeyDown}
			/>
			<div className={cx(styles.popup, isOpen && styles.open)}>
				<p className={styles.heading}>
					{query.trim() ? "Найденные проекты" : "Проекты"}
				</p>
				<ul
					id={listboxId}
					role="listbox"
					aria-label="Проекты"
					className={styles.list}
				>
					{results.map((project, index) => (
						<li
							key={project.id}
							id={optionId(project)}
							role="option"
							aria-selected={index === activeIndex}
							className={cx(
								styles.option,
								index === activeIndex && styles.active,
							)}
							onMouseDown={(event) => event.preventDefault()}
							onMouseEnter={() => setActiveIndex(index)}
							onClick={() => openProject(project)}
						>
							<Avatar
								name={project.name}
								seed={project.id}
								size="sm"
							/>
							<span className={styles.name}>{project.name}</span>
						</li>
					))}
				</ul>
				{results.length === 0 && (
					<p className={styles.empty}>
						{items.length === 0
							? "Проектов пока нет"
							: "Ничего не найдено"}
					</p>
				)}
			</div>
		</div>
	)
}
