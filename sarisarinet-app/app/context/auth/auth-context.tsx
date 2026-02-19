import { createContext } from "react";
import type { UserWithRelation } from "~/zod/user.zod";

export interface AuthContextType {
	user: UserWithRelation | null;
	isLoading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<UserWithRelation>;
	logout: () => Promise<void>;
	getCurrentUser: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
