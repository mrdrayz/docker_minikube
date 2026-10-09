import { routes } from "@/shared/config"
import { useDocumentTitle } from "@/shared/hooks"
import { EmptyState, LinkButton } from "@/shared/ui"

export type NotFoundPageProps = {
	title?: string
	description?: string
}

export function NotFoundPage({
	title = "Страница не найдена",
	description = "Возможно, адрес набран с ошибкой или страница была удалена.",
}: NotFoundPageProps) {
	useDocumentTitle(title)

	return (
		<EmptyState
			headingLevel={1}
			title={title}
			description={description}
			action={
				<LinkButton to={routes.projects} variant="primary">
					К списку проектов
				</LinkButton>
			}
		/>
	)
}
