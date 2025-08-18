'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';

export default function NewFormPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [schoolName, setSchoolName] = useState('');

  // Set default school name from session
  useEffect(() => {
    if (session?.user?.schoolName) {
      setSchoolName(session.user.schoolName);
    }
  }, [session]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle authentication
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user has permission (Level 3 or 4)
    if (session.user.level < 3) {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!schoolName.trim()) {
      setError('School name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create new form submission in MongoDB
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principalEmail: session.user.email,
          schoolName: schoolName.trim(),
          formData: {
            // Initialize with empty data for all 15 steps
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {},
            step6: {},
            step7: {},
            step8: {},
            step9: {},
            step10: {},
            step11: {},
            step12: {},
            step13: {},
            step14: {},
            step15: {},
          },
          currentStep: 1,
          status: 'draft'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Form created:', data);
      
      // Redirect to the new form
      router.push(`/form/${data.formId}`);
    } catch (error) {
      console.error('Error creating form:', error);
      setError('Failed to create form. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Don't render until session is loaded
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has permission to create forms (Level 3+)
  if (session.user.level < 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need Level 3 (Principal) access or higher to create forms.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create New School Plan
              </h1>
              <p className="text-gray-600">
                Start a new comprehensive school plan submission
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              School Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide basic information about your school to begin the plan submission process.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                Principal Email
              </label>
              <input
                type="email"
                value={session.user.email}
                disabled
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                This is your authenticated email address and cannot be changed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2 text-gray-500" />
                Principal Name
              </label>
              <input
                type="text"
                value={session.user.name}
                disabled
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2 text-gray-500" />
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter the full name of your school"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Please enter the official name of your school as it appears in DOE records.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                What happens next?
              </h3>
              <ul className="text-xs text-blue-700 space-y-1 pl-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  You'll complete a 15-step comprehensive school plan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  Your progress will be automatically saved
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  You can return to edit your plan at any time before submission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  Once submitted, the plan will be reviewed by district administrators
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !schoolName.trim()}
                className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
                  isSubmitting || !schoolName.trim()
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Start School Plan
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}