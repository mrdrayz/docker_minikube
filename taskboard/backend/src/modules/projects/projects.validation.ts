import { asRecord, optionalString, requiredString } from "../../lib/validation"
import { PROJECT_DESCRIPTION_MAX, PROJECT_NAME_MAX } from "./projects.constants"
import type { ProjectInput } from "./projects.types"

export function parseProjectInput(body: unknown): ProjectInput {
	const data = asRecord(body)
	
  return {
		name: requiredString(data.name, {
			max: PROJECT_NAME_MAX,
			message: `Название проекта должно быть от 1 до ${PROJECT_NAME_MAX} символов`,
		}),
		description: optionalString(data.description, {
			max: PROJECT_DESCRIPTION_MAX,
			message: `Описание проекта не должно быть длиннее ${PROJECT_DESCRIPTION_MAX} символов`,
		}),
	}
}
