import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Token Missing!");

  const [, token] = authHeader.split(" ");

  try {
    const { sub: userID } = verify(
      token,
      "9516a0c2c7af36f59333d00364e24dbd"
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = usersRepository.findByID(userID);
    if (!user) throw new Error("User doesn't exists!");

    next();
  } catch {
    throw new Error("Invalid Token!");
  }
}
