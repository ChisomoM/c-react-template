'use client'

import { useAuth } from "@/lib/context/useAuth";
import { Label } from "../ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  onLoginClick: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onLoginClick }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
    } catch (err) {
      // Error handled by AuthContext
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
          <h1 className="text-2xl font-bold tracking-tight text-charcoal font-sora">Create an account</h1>
          <p className="text-sm text-gray-500 font-sora">Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+260..."
              value={formData.phone}
              onChange={handleChange}
              className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-gray-600 font-sora">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="font-sora h-11 border-gray-200 focus:border-gold-primary focus:ring-gold-primary/20 transition-all rounded-xl"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gold-primary hover:bg-gold-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-gold-primary/20 mt-2 font-sora"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4 font-sora">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-gold-primary font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
