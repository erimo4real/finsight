import { BaseDTO } from "./base.dto";

export interface IUserDTO {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: "user" | "admin";
   profileImage?: string; // CHANGED: optional url
}

export class UserDTO extends BaseDTO<IUserDTO> implements IUserDTO {
  id?: string;
  name!: string;
  email!: string;
  password?: string;
  role?: "user" | "admin";
  profileImage?: string;

  constructor(data: IUserDTO) {
    super(data);
  }

  static fromEntity(entity: any): UserDTO {
    return new UserDTO({
      id: entity?._id?.toString ? entity._id.toString() : entity?.id ?? undefined,
      name: entity?.name ?? "",
      email: entity?.email ?? "",
      role: entity?.role ?? "user",
      profileImage: entity?.profileImage ?? undefined, // CHANGED
    });
  }
}
