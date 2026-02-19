import type { UserWithRelation } from "~/zod/user.zod";

export type loginResponse = {
	user: UserWithRelation;
	token: string;
};
