
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { MobileAppSection } from "@/components/auth/MobileAppSection";
import { usePoppinsFont } from "@/hooks/usePoppinsFont";

export default function Auth() {
  const [showSignup, setShowSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  usePoppinsFont();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Card className="w-full md:w-8/12 lg:w-2/3 max-w-3xl p-6 space-y-8 bg-white shadow-sm border-0">
        <div className="flex justify-center">
          <img 
            src="https://admin.studentqr.com/images/logo-my.png" 
            alt="StudentQR Logo" 
            className="h-[200px] w-[200px] object-contain"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {showSignup ? "Create Your Account" : "Sign In Your Account"}
          </h2>

          {!showSignup ? (
            <LoginForm onSwitchToSignup={() => setShowSignup(true)} />
          ) : (
            signupSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Registration successful! Please check your email for a confirmation link.
                </p>
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    setSignupSuccess(false);
                    setShowSignup(false);
                  }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <SignupForm 
                onSwitchToLogin={() => setShowSignup(false)}
                onSignupSuccess={() => setSignupSuccess(true)}
              />
            )
          )}
        </div>

        <MobileAppSection />
      </Card>
    </div>
  );
}
