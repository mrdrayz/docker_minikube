import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { CreateProjectProvider, ProjectsProvider } from "@/features/projects"
import { BoardPage, NotFoundPage, ProjectsPage } from "@/pages"
import { routes } from "@/shared/config"
import { AppLayout } from "./layout"

export function App() {
	return (
		<BrowserRouter>
			<ProjectsProvider>
				<CreateProjectProvider>
					<Routes>
						<Route element={<AppLayout />}>
							<Route
								index
								element={
									<Navigate to={routes.projects} replace />
								}
							/>
							<Route
								path={routes.projects}
								element={<ProjectsPage />}
							/>
							<Route
								path={routes.projectPattern}
								element={<BoardPage />}
							/>
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Routes>
				</CreateProjectProvider>
			</ProjectsProvider>
		</BrowserRouter>
	)
}
