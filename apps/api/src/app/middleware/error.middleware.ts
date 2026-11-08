import { Request, Response, NextFunction } from 'express';
import { createApiResponse } from '../data/store';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    createApiResponse(
      null,
      `Route ${req.method} ${req.originalUrl} not found`,
      false
    )
  );
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error('[Error]', err);
  const status = (err as any).status || 500;
  res.status(status).json(
    createApiResponse(
      null,
      err.message || 'Internal Server Error',
      false
    )
  );
}

