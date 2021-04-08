import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = [];

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByRefreshTokenAndUserID(
    user_id: string,
    refreshToken: string
  ): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (userTokens) =>
        userTokens.user_id === user_id &&
        userTokens.refresh_token === refreshToken
    );

    return userToken;
  }

  async deleteByID(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(
      (userTokens) => userTokens.id === id
    );

    this.usersTokens.splice(userTokenIndex, 1);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserTokens> {
    const userTokens = this.usersTokens.find(
      (userToken) => userToken.refresh_token === refreshToken
    );

    return userTokens;
  }
}

export { UsersTokensRepositoryInMemory };
