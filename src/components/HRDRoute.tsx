import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuthentication } from "../lib/authentication";

interface HRDRouteProps {
  children: React.ReactNode;
}

const HRDRoute: React.FC<HRDRouteProps> = ({ children }) => {
  const [isHRD, setIsHRD] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyHRD = async () => {
      const result = await checkAuthentication();

      if (result.authenticated && result.user) {
        setIsHRD(result.user.is_hrd);
      } else {
        setIsHRD(false);
      }

      setIsChecking(false);
    };

    verifyHRD();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memeriksa akses...</div>
      </div>
    );
  }

  if (!isHRD) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default HRDRoute;
