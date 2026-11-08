export class ServiceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidServiceInputError extends ServiceError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class EntityNotFoundError extends ServiceError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} was not found`, 404);
  }
}
