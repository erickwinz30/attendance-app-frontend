import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuthentication } from "../lib/authentication";

interface ScannerRouteProps {
  children: React.ReactNode;
}

const ScannerRoute: React.FC<ScannerRouteProps> = ({ children }) => {
  const [isScanner, setIsScanner] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyScanner = async () => {
      const result = await checkAuthentication();

      if (result.authenticated && result.user?.role === "Admin") {
        setIsScanner(true);
      } else {
        setIsScanner(false);
      }

      setIsChecking(false);
    };

    verifyScanner();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memeriksa akses...</div>
      </div>
    );
  }

  if (!isScanner) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ScannerRoute;
