import { Button } from "../Button"
import styles from "./ErrorBanner.module.css"

export type ErrorBannerProps = {
	message: string
	onClose: () => void
	closeLabel?: string
}

export function ErrorBanner({
	message,
	onClose,
	closeLabel = "Скрыть",
}: ErrorBannerProps) {
	return (
		<div className={styles.banner} role="alert">
			<p className={styles.text}>{message}</p>
			<Button
				variant="subtle"
				size="sm"
				className={styles.close}
				onClick={onClose}
			>
				{closeLabel}
			</Button>
		</div>
	)
}
