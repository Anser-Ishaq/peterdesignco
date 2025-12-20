'use client';
import CustomButton from "@/app/components/ui/customButton/customButton";
import CustomInput from "@/app/components/ui/customInput/customInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sending OTP to:', email);
      
      // Redirect to OTP verification page with email parameter
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Send OTP failed:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email and we'll send you a verification code.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <CustomInput
                placeholder="Enter your email"
                type="email"
                layout="w-full"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <CustomButton 
                text={isLoading ? "Sending Code..." : "Send Verification Code"}
                layout="w-full"
                height="h-12"
                // disabled={isLoading}
              />
            </div>
          </form>

          {/* Info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  We'll send a 6-digit verification code to your email. The code will expire in 5 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Back to login link */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary hover:text-primary/80 transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}