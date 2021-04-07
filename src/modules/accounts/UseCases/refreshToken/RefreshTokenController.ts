import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.body.token || req.headers["x-access-token"] || req.query.token;

    const refreshTokenUsecase = container.resolve(RefreshTokenUseCase);

    const newRefreshToken = await refreshTokenUsecase.execute(refreshToken);

    return res.json(newRefreshToken);
  }
}

export { RefreshTokenController };
