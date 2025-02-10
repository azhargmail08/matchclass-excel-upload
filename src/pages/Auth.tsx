
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email not confirmed",
            description: "Please check your email for a confirmation link.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        }
        return;
      }
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          },
        },
      });

      if (error) throw error;

      setSignupSuccess(true);
      toast({
        title: "Registration successful",
        description: "Please check your email for a confirmation link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-8 bg-white shadow-sm border-0">
        <div className="flex justify-center">
          <img 
            src="https://admin.studentqr.com/images/logo-my.png" 
            alt="StudentQR Logo" 
            className="h-12 object-contain"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {showSignup ? "Create Your Account" : "Sign In Your Account"}
          </h2>

          {!showSignup ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-600">Email</label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-600">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-blue-600 hover:underline text-sm">
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign Me In"}
              </Button>

              <p className="text-center text-gray-600">
                Don't Have An Account?{" "}
                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            signupSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Registration successful! Please check your email for a confirmation link.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSignupSuccess(false);
                    setShowSignup(false);
                  }}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-600">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-600">Email</label>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-600">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="w-full px-4 py-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>

                <p className="text-center text-gray-600">
                  Already Have An Account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-center text-lg font-medium text-gray-800 mb-4">Teacher App</h3>
          <div className="flex items-center justify-center space-x-4">
            <img src="https://admin.studentqr.com/images/logo-my.png" alt="QR Logo" className="w-12 h-12" />
            <a href="#" className="transform hover:scale-105 transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on App Store"
                className="h-10"
              />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
