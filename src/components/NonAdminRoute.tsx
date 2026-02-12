import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuthentication } from "../lib/authentication";

interface NonAdminRouteProps {
  children: React.ReactNode;
}

const NonAdminRoute: React.FC<NonAdminRouteProps> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyRole = async () => {
      const result = await checkAuthentication();

      if (result.authenticated && result.user?.role !== "Admin") {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }

      setIsChecking(false);
    };

    verifyRole();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memeriksa akses...</div>
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default NonAdminRoute;
