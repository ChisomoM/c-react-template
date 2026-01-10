"use client"

import React, { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/loginForm";
import { SignupForm } from "@/components/auth/signupForm";
import { Star, ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/useAuth";
import { useRouter } from "next/navigation";

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sora">
      {/* Left side - Form content */}
      <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-center h-full overflow-y-auto bg-white">
        <div className="w-full max-w-sm mx-auto">
          {isLogin ? (
            <LoginForm onSignUpClick={() => setIsLogin(false)} />
          ) : (
            <SignupForm onLoginClick={() => setIsLogin(true)} />
          )}
        </div>
      </div>

      {/* Right side - Brand showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden m-4 rounded-[2.5rem] shadow-2xl">
        {/* Luxury Dark Background */}
        <div className="absolute inset-0 bg-charcoal"></div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/10 via-transparent to-charcoal"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-20 text-white w-full h-full">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Star className="w-4 h-4 text-gold-primary fill-gold-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase">Premium Experience</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                Exquisite Fashion, <span className="text-gold-primary">Redefined.</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                Discover a curated collection of premium essentials designed for the modern connoisseur.
              </p>
            </div>

            <button className="flex items-center gap-2 text-gold-primary font-bold group">
              View Collections 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-6 mt-auto">
            <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default">
              <ShieldCheck className="w-8 h-8 text-gold-primary" />
              <h3 className="font-bold text-lg">Secure Payments</h3>
              <p className="text-sm text-gray-500">Enterprise grade encryption for every transaction.</p>
            </div>
            <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default">
              <Zap className="w-8 h-8 text-gold-primary" />
              <h3 className="font-bold text-lg">Express Delivery</h3>
              <p className="text-sm text-gray-500">Premium shipping to your doorstep, anywhere.</p>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-primary/10 rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
};