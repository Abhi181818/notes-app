"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { auth, provider } from "@/../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in: ", result.user);
      login(result.user);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <div className="container flex items-center justify-center h-screen bg-gray-100">
      <div className="border rounded-md w-96 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>
        <Input placeholder="Email" type="email" className="mt-4" />
        <div className="relative mt-4">
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </span>
        </div>
        <Button className="w-full mt-6">
          {isLogin ? "Login" : "Register"}
        </Button>
        <div className="flex justify-between mt-4">
          <span
            onClick={toggleForm}
            className="text-sm text-blue-500 cursor-pointer"
          >
            {isLogin ? "Create an account" : "Login"}
          </span>
          <span className="text-sm text-blue-500 cursor-pointer">
            Forgot password?
          </span>
        </div>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 flex items-center justify-center"
        >
          <Mail className="mr-2" /> Login with Google
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
