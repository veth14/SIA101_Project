// User roles
export const UserRoles = {
  ADMIN: 'admin',
  STAFF: 'staff',
  GUEST: 'guest'
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

// Authentication state interfaces
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Authentication credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Create user credentials
export interface CreateUserCredentials extends LoginCredentials {
  displayName?: string;
  role: UserRole;
}

// Registration credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Auth error types
export type AuthErrorCode = 
  | 'auth/wrong-password'
  | 'auth/user-not-found'
  | 'auth/too-many-requests'
  | 'auth/user-disabled'
  | 'auth/invalid-credential'
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

// Auth context interface
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
}

// Protected route props
export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectPath?: string;
  children: React.ReactNode;
}
