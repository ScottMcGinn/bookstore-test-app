import { useAuth } from '../context/AuthContext';

function RoleProtected({ children, allowedRoles, fallback = undefined }) {
  const { user, userRole } = useAuth();

  if (!user) {
    return fallback !== undefined ? fallback : null;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (fallback !== undefined) {
      return fallback;
    }
    return (
      <div className="access-denied" role="alert">
        <p>⛔ Access Denied</p>
        <p>Your role ({userRole}) does not have access to this feature.</p>
      </div>
    );
  }

  return children;
}

export default RoleProtected;
