import {
	useEffect,
	useId,
	useRef,
	type MouseEvent,
	type ReactNode,
	type SyntheticEvent,
} from "react"
import { cx } from "@/shared/lib"
import { CloseIcon } from "../Icon"
import styles from "./Modal.module.css"

const INITIAL_FOCUS_SELECTOR = 'input:not([type="hidden"]), textarea, select'

export type ModalProps = {
	isOpen: boolean
	title: string
	onClose: () => void
	children: ReactNode
	size?: "md" | "lg"
}

export type ModalActionsProps = {
	children: ReactNode
}

export function ModalActions({ children }: ModalActionsProps) {
	return <div className={styles.actions}>{children}</div>
}

export function Modal({
	isOpen,
	title,
	onClose,
	children,
	size = "md",
}: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) return

		if (isOpen && !dialog.open) {
			dialog.showModal()
			dialog.querySelector<HTMLElement>(INITIAL_FOCUS_SELECTOR)?.focus()
		}

		if (!isOpen && dialog.open) dialog.close()
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return undefined

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen])

	function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
		event.preventDefault()
		onClose()
	}

	function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
		if (event.target === event.currentTarget) onClose()
	}

	return (
		<dialog
			ref={dialogRef}
			className={cx(styles.dialog, styles[size])}
			aria-labelledby={titleId}
			onCancel={handleCancel}
			onClick={handleBackdropClick}
		>
			{isOpen && (
				<div className={styles.content}>
					<header className={styles.header}>
						<h2 id={titleId} className={styles.title}>
							{title}
						</h2>
						<button
							type="button"
							className={styles.close}
							aria-label="Закрыть"
							onClick={onClose}
						>
							<CloseIcon size={18} />
						</button>
					</header>
					<div className={styles.body}>{children}</div>
				</div>
			)}
		</dialog>
	)
}
