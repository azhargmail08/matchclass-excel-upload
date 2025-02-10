
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupForm = ({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

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

      onSignupSuccess();
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
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label className="text-gray-600 font-bold">Full Name</label>
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
        <label className="text-gray-600 font-bold">Email</label>
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
        <label className="text-gray-600 font-bold">Password</label>
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
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};
