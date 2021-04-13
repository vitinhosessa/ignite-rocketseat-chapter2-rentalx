import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refreshToken: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refreshToken: string): Promise<ITokenResponse> {
    const { sub: user_id, email } = verify(
      refreshToken,
      auth.secretRefreshToken
    ) as IPayload;

    const userToken = await this.usersTokensRepository.findByRefreshTokenAndUserID(
      user_id,
      refreshToken
    );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!");
    }

    await this.usersTokensRepository.deleteByID(userToken.id);

    const newRefreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: user_id,
      expiresIn: auth.expiresInRefreshToken,
    });

    const expiresDate = this.dateProvider.addDays(auth.expiresRefreshTokenDays);

    await this.usersTokensRepository.create({
      user_id,
      expires_date: expiresDate,
      refresh_token: newRefreshToken,
    });

    const newToken = sign({}, auth.secretToken, {
      subject: user_id,
      expiresIn: auth.expiresInToken,
    });

    return {
      refreshToken: newRefreshToken,
      token: newToken,
    };
  }
}

export { RefreshTokenUseCase };
