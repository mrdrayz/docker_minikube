import type { ReactNode } from "react"
import { cx } from "@/shared/lib"
import styles from "./Field.module.css"

export type FieldControlProps = {
	id: string
	label: string
	hideLabel?: boolean
	className?: string
}

export type FieldProps = FieldControlProps & {
	hint?: string
	isRequired?: boolean
	children: ReactNode
}

export function Field({
	id,
	label,
	hideLabel = false,
	hint,
	isRequired = false,
	className,
	children,
}: FieldProps) {
	return (
		<div className={cx(styles.field, className)}>
			<label
				htmlFor={id}
				className={hideLabel ? "visually-hidden" : styles.label}
			>
				{label}
				{isRequired && (
					<span className={styles.required} aria-hidden="true">
						*
					</span>
				)}
			</label>
			{children}
			{hint && <p className={styles.hint}>{hint}</p>}
		</div>
	)
}
