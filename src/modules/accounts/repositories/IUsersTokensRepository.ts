import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens>;
  findByRefreshTokenAndUserID(
    user_id: string,
    refreshToken: string
  ): Promise<UserTokens>;
  deleteByID(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<UserTokens>;
}

export { IUsersTokensRepository };
