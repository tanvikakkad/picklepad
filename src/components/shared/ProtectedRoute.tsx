import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Implement auth + role-based guard logic.
  return <>{children}</>;
}
