import { useCallback, useRef, useState } from "react"

export type FormState<T extends object> = {
	values: T
	setField: <K extends keyof T>(key: K, value: T[K]) => void
	reset: () => void
}

export function useFormState<T extends object>(initialValues: T): FormState<T> {
	const initialRef = useRef(initialValues)
	const [values, setValues] = useState<T>(initialValues)

	const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
		setValues((previous) => ({ ...previous, [key]: value }))
	}, [])

	const reset = useCallback(() => setValues(initialRef.current), [])

	return { values, setField, reset }
}
