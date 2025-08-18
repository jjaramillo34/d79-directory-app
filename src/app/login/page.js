'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        setError('Sign in failed. Please ensure you are using a @schools.nyc.gov email address and that your account is authorized.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            District 79 Consolidation Plan
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            School Consolidation Plan
          </p>
          <p className="text-gray-400 text-xs">
            Only principals and school administrators with @schools.nyc.gov email addresses are authorized to access this system.
          </p>
        </div>
        
        <div className="mt-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white border-none rounded-md text-sm font-medium cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              By signing in, you agree to use this system responsibly for official school business only.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Only authorized @schools.nyc.gov accounts can access this system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}