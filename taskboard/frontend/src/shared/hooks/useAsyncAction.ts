import { useCallback, useState } from "react"

export type RunAction = <T>(action: () => Promise<T>) => Promise<T | undefined>

export type AsyncActionState = {
	error: string
	isPending: boolean
	run: RunAction
	clearError: () => void
}

export function useAsyncAction(): AsyncActionState {
	const [error, setError] = useState("")
	const [pendingCount, setPendingCount] = useState(0)

	const run = useCallback<RunAction>(async (action) => {
		setError("")
		setPendingCount((count) => count + 1)
    
		try {
			return await action()
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err))
			return undefined
		} finally {
			setPendingCount((count) => count - 1)
		}
	}, [])

	const clearError = useCallback(() => setError(""), [])

	return { error, isPending: pendingCount > 0, run, clearError }
}
