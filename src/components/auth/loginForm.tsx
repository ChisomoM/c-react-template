import { useAuth } from "@/lib/context/useAuth";
import { Label } from "../ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSignUpClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSignUpClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      // Logic for redirect is also in AuthContext, but reinforcing it here
      // for immediate feedback if needed.
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-6 border border-gray-100">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold tracking-tighter font-sora text-charcoal">
              LUXURY<span className="text-gold-primary">.</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal font-sora">Welcome Back</h1>
          <p className="text-sm text-gray-500 font-sora">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
                Password
              </Label>
              <button 
                type="button" 
                className="text-xs font-semibold text-gold-primary hover:text-gold-dark font-sora transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gold-primary hover:bg-gold-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-gold-primary/20 mt-2 font-sora border-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4 font-sora">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-gold-primary font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};