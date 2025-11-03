import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole } from '../types';

export const useRoleAccess = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const hasAccess = (allowedRoles: UserRole[]) => {
    return user && allowedRoles.includes(user.role);
  };

  const isResident = user?.role === 'resident';
  const isDispatcher = user?.role === 'dispatcher';
  const isTechnicalDirector = user?.role === 'technical_director';
  const isSecurityGuard = user?.role === 'security_guard';
  const isMainDirector = user?.role === 'main_director';

  return {
    hasAccess,
    isResident,
    isDispatcher,
    isTechnicalDirector,
    isSecurityGuard,
    isMainDirector,
    userRole: user?.role,
  };
};