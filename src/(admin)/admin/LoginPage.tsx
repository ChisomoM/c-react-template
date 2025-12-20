import React from "react";
import { LoginForm } from "../../components/auth/loginForm";
import { seedDefaultAdmin } from "@/lib/firebase/seed";
import { toast } from "sonner";

interface LoginPageProps {
  onSignUpClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSignUpClick }) => {
  const handleSeed = async () => {
    const result = await seedDefaultAdmin();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Background Pattern/Gradient effects */}
        <div className="absolute inset-0 w-full h-full">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5600B]/20 blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D70F0E]/20 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <h1 className="text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Zute
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed font-light">
            Manage your business with confidence.
          </p>
        </div>

        <div className="absolute bottom-12 text-sm text-slate-600">
          © {new Date().getFullYear()} Zute. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
             <h1 className="text-3xl font-bold text-gray-900">Zute Admin</h1>
             <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <LoginForm onSignUpClick={onSignUpClick} />
          
          <div className="text-center mt-6">
             <p className="text-xs text-gray-400">
               By signing in, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
             </p>
             {/* Temporary Seed Button */}
             <button 
               onClick={handleSeed}
               className="mt-4 text-[10px] text-gray-300 hover:text-gray-500 transition-colors"
             >
               (Dev: Seed Admin)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};


