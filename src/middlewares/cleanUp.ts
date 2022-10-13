import { NextFunction, Request, Response } from "express";

export const cleanUp = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Cleanup Middleware");
  next();
};
