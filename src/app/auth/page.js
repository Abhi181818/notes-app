"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LogIn,
  UserPlus,
  Loader2,
  KeyRound,
  FileQuestion,
} from "lucide-react";
import { auth, provider } from "@/../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/");
    } else {
      router.push("/auth");
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in: ", result.user);
      login(result.user);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 bg-gray-50">
      <div className="border rounded-lg w-full max-w-md p-8 bg-white shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            {isLogin ? (
              <LogIn size={32} className="text-blue-600" />
            ) : (
              <UserPlus size={32} className="text-blue-600" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input placeholder="Email" type="email" className="pl-10" />
          </div>

          <div className="relative">
            <KeyRound
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button disabled={isLoading} className="w-full mt-6 font-medium">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : isLogin ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </>
          )}
        </Button>

        <div className="mt-6 relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center border-gray-300"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>

        <div className="flex justify-between mt-6 text-sm">
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            type="button"
          >
            {isLogin ? (
              <>
                <UserPlus className="mr-1 h-4 w-4" />
                Create an account
              </>
            ) : (
              <>
                <LogIn className="mr-1 h-4 w-4" />
                Sign in instead
              </>
            )}
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            type="button"
          >
            <FileQuestion className="mr-1 h-4 w-4" />
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
