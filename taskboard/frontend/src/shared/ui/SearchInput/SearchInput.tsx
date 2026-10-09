import type { ComponentPropsWithoutRef } from "react"
import { cx } from "@/shared/lib"
import { CloseIcon, SearchIcon } from "../Icon"
import styles from "./SearchInput.module.css"

export type SearchInputProps = Omit<
	ComponentPropsWithoutRef<"input">,
	"value" | "onChange" | "type"
> & {
	id: string
	label: string
	value: string
	onValueChange: (value: string) => void
	containerClassName?: string
}

export function SearchInput({
	id,
	label,
	value,
	onValueChange,
	containerClassName,
	className,
	...props
}: SearchInputProps) {
	return (
		<div className={cx(styles.container, containerClassName)}>
			<label htmlFor={id} className="visually-hidden">
				{label}
			</label>
			<SearchIcon className={styles.icon} />
			<input
				id={id}
				type="search"
				autoComplete="off"
				className={cx(styles.input, className)}
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				{...props}
			/>
			{value && (
				<button
					type="button"
					className={styles.clear}
					aria-label="Очистить поиск"
					onClick={() => onValueChange("")}
				>
					<CloseIcon size={14} />
				</button>
			)}
		</div>
	)
}
