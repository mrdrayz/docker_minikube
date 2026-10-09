export interface CrudRepository<TEntity, TInput> {
	findById(id: number): Promise<TEntity | null>
	create(input: TInput): Promise<TEntity>
	update(id: number, input: TInput): Promise<TEntity | null>
	remove(id: number): Promise<boolean>
}
