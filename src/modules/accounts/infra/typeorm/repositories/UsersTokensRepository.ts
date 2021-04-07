import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { UserTokens } from "../entities/UserTokens";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByRefreshTokenAndUserID(
    user_id: string,
    refreshToken: string
  ): Promise<UserTokens> {
    const userToken = await this.repository
      .createQueryBuilder()
      .where("user_id = :user_id", { user_id })
      .andWhere("refresh_token = :refresh_token", {
        refresh_token: refreshToken,
      })
      .getOne();

    return userToken;
  }

  async deleteByID(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { UsersTokensRepository };
