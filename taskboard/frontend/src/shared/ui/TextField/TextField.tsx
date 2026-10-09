import type { ComponentPropsWithoutRef } from "react"
import { Field, type FieldControlProps } from "../Field"

export type TextFieldProps = FieldControlProps &
	Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
		hint?: string
		inputClassName?: string
	}

export function TextField({
	id,
	label,
	hideLabel,
	hint,
	className,
	inputClassName,
	...inputProps
}: TextFieldProps) {
	return (
		<Field
			id={id}
			label={label}
			hideLabel={hideLabel}
			hint={hint}
			isRequired={inputProps.required}
			className={className}
		>
			<input
				id={id}
				className={inputClassName}
				autoComplete="off"
				{...inputProps}
			/>
		</Field>
	)
}
