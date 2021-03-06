interface IUserResponseDTO {
  email: string;
  name: string;
  id: string;
  avatar: string;
  driver_license: string;
  getAvatarUrl(): string;
}

export { IUserResponseDTO };
