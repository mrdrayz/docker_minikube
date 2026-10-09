import type { ChangeEvent, ComponentPropsWithoutRef } from "react"
import { Field, type FieldControlProps } from "../Field"

export type SelectOption<T extends string> = {
	value: T
	label: string
}

export type SelectProps<T extends string> = FieldControlProps &
	Omit<
		ComponentPropsWithoutRef<"select">,
		"id" | "className" | "value" | "onChange"
	> & {
		value: T
		options: readonly SelectOption<T>[]
		onValueChange: (value: T) => void
	}

export function Select<T extends string>({
	id,
	label,
	hideLabel,
	className,
	value,
	options,
	onValueChange,
	...props
}: SelectProps<T>) {
	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		const selected = options.find(
			(option) => option.value === event.target.value,
		)

		if (selected) onValueChange(selected.value)
	}

	return (
		<Field
			id={id}
			label={label}
			hideLabel={hideLabel}
			className={className}
		>
			<select id={id} value={value} onChange={handleChange} {...props}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</Field>
	)
}
