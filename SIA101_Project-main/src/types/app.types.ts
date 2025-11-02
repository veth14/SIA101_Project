// This file contains the application types and interfaces
import type { FC, ReactNode } from 'react';
import type { UserRole } from './auth.types';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export interface LoadingSpinnerProps {
  className?: string;
}

export type AppComponent = FC;
