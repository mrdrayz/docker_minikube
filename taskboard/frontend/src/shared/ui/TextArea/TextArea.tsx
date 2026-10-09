import type { ComponentPropsWithoutRef } from "react"
import { Field, type FieldControlProps } from "../Field"

export type TextAreaProps = FieldControlProps &
	Omit<ComponentPropsWithoutRef<"textarea">, "id" | "className" | "value"> & {
		value: string
		showCounter?: boolean
	}

export function TextArea({
	id,
	label,
	hideLabel,
	className,
	value,
	maxLength,
	showCounter = false,
	...props
}: TextAreaProps) {
	const hint =
		showCounter && maxLength ? `${value.length} / ${maxLength}` : undefined

	return (
		<Field
			id={id}
			label={label}
			hideLabel={hideLabel}
			hint={hint}
			className={className}
		>
			<textarea id={id} value={value} maxLength={maxLength} {...props} />
		</Field>
	)
}
