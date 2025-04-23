"use client";

import React, { useState } from "react";
import Link from "next/link";
import FormInput from "@/app/components/auth/FormInput";
import AuthButton from "@/app/components/auth/AuthButton";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to request password reset
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request error:", error);
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Password reset link sent! Please check your email.
          </div>
          <p className="mb-4">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Note: The email may take a few minutes to arrive. Don&apos;t forget to check your spam folder.
          </p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4">
            Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={handleChange}
              error=""
            />
            
            <div className="mt-6">
              <AuthButton 
                label="Send Reset Link" 
                isLoading={isLoading} 
              />
            </div>
          </form>
          
          <p className="mt-4 text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}