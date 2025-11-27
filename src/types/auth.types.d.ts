export declare const UserRoles: {
    readonly ADMIN: "admin";
    readonly STAFF: "staff";
    readonly GUEST: "guest";
};
export type UserRole = typeof UserRoles[keyof typeof UserRoles];
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    role: UserRole;
    createdAt: Date;
    lastLogin?: Date;
    isEnabled: boolean;
    emailVerified?: boolean;
}
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface CreateUserCredentials extends LoginCredentials {
    displayName?: string;
    role: UserRole;
}
export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export type AuthErrorCode = 'auth/wrong-password' | 'auth/user-not-found' | 'auth/too-many-requests' | 'auth/user-disabled' | 'auth/invalid-credential' | 'auth/email-already-in-use' | 'auth/invalid-email' | 'auth/operation-not-allowed' | 'auth/weak-password';
export interface AuthError {
    code: AuthErrorCode;
    message: string;
}
export interface AuthContextType extends AuthState {
    userData: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    createUser?: (credentials: CreateUserCredentials) => Promise<void>;
    updateUser?: (uid: string, updates: Partial<User>) => Promise<void>;
    deleteUser?: (uid: string) => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (role: UserRole | UserRole[]) => boolean;
    isAdmin: () => boolean;
    isStaff: () => boolean;
    setResendingVerification?: (isResending: boolean) => void;
}
export interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    redirectPath?: string;
    children: React.ReactNode;
}
