import { classToClass } from "class-transformer";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";

class UserMap {
  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    getAvatarUrl,
  }: User): IUserResponseDTO {
    const user = classToClass({
      email,
      name,
      id,
      avatar,
      driver_license,
      getAvatarUrl,
    });
    return user;
  }
}

export { UserMap };
