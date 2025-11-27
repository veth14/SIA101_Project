import { type ReactNode } from 'react';
import type { AuthContextType } from '../types/auth.types';
export declare const AuthContext: import("react").Context<AuthContextType | undefined>;
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export { useAuth } from '../hooks/useAuth';
