import { useAuth } from '../context/AuthContext';

function RoleProtected({ children, allowedRoles, fallback = null }) {
  const { user, userRole } = useAuth();

  if (!user) {
    return fallback || null;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="access-denied" role="alert">
        <p>⛔ Access Denied</p>
        <p>Your role ({userRole}) does not have access to this feature.</p>
      </div>
    );
  }

  return children;
}

export default RoleProtected;
