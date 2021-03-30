import { NextFunction, request, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError("Token Missing!", 401);

  const [, token] = authHeader.split(" ");

  try {
    const { sub: userID } = verify(
      token,
      "9516a0c2c7af36f59333d00364e24dbd"
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = usersRepository.findByID(userID);
    if (!user) throw new AppError("User doesn't exists!", 401);

    request.user = {
      id: userID,
    };

    next();
  } catch {
    throw new AppError("Invalid Token!", 401);
  }
}
