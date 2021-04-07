import { NextFunction, request, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";

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

  const usersTokensRepository = new UsersTokensRepository();

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secretRefreshToken) as IPayload;

    const user = await usersTokensRepository.findByRefreshTokenAndUserID(
      user_id,
      token
    );

    if (!user) {
      throw new AppError("User doesn't exists!", 401);
    }

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError("Invalid Token!", 401);
  }
}
