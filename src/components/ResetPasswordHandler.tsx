import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ResetPassword } from "./ResetPassword";

export function ResetPasswordHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have reset tokens in the hash
    const hash = location.hash;
    if (
      hash &&
      hash.includes("access_token") &&
      hash.includes("refresh_token")
    ) {
      // We have reset tokens, stay on this page to show the reset form
      return;
    }

    // No reset tokens, redirect to home
    navigate("/");
  }, [location.hash, navigate]);

  // If we have reset tokens, show the reset form
  if (
    location.hash &&
    location.hash.includes("access_token") &&
    location.hash.includes("refresh_token")
  ) {
    return <ResetPassword />;
  }

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
