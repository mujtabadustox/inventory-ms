import React, { useState } from "react";
import { useSignup } from "../hooks/useAuth";
import { useAppStore } from "../stores/appStore";
import { Link } from "react-router-dom";

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const signupMutation = useSignup();
  const { addNotification } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signupMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Account Created",
            message: "Welcome! Your account has been created successfully.",
          });
        },
        onError: (error: any) => {
          addNotification({
            type: "error",
            title: "Signup Failed",
            message: error.message || "Failed to create account",
          });
        },
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (showLogin) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Same as dashboard */}
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                🛒
              </div>
              <span className="text-xl font-bold">Inventory</span>
            </div>
          </div>
          {/* Welcome Message */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-gray-300">
              Sign in to access your inventory management dashboard.
            </p>
          </div>
          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Need help? Contact administrator
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header - Same as dashboard */}
          <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Sign In</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5v-12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Sign In
                  </h2>
                  <p className="text-gray-600">
                    Access your inventory dashboard
                  </p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setShowLogin(false)}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Contact administrator
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Same as dashboard */}
      <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              🛒
            </div>
            <span className="text-xl font-bold">Inventory</span>
          </div>
        </div>
        {/* Welcome Message */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Join Us!</h2>
          <p className="text-gray-300">
            Create your account to start managing your inventory efficiently.
          </p>
        </div>
        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Need help? Contact administrator
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Same as dashboard */}
        <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Create Account
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5-5-5h5v-12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join our inventory management platform
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {signupMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Contact administrator
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
