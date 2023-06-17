import { RoleEnum } from "@prisma/client";

export class TokenPayload {
    userId: string;
    email: string;
    role: RoleEnum;
  }
  