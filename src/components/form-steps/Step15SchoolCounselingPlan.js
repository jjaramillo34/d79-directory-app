'use client';

import { useState, useEffect } from 'react';
import { Heart, CheckCircle, AlertCircle, FileText, Shield, Users, Clock, UserCheck } from 'lucide-react';
import formQuestionsData from '../../data/formQuestions.json';

export default function Step15SchoolCounselingPlan({ stepData, updateStepData }) {
  const [questions] = useState(() => {
    const step = formQuestionsData.steps.find(s => s.key === 'counselingPlan');
    return step ? step.questions : [];
  });

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (stepData) {
      // stepData is already the actual data object, not wrapped in .data
      setFormData(stepData);
    }
  }, [stepData]);

  const handleInputChange = (questionId, value) => {
    const newFormData = { ...formData, [questionId]: value };
    setFormData(newFormData);
    updateStepData('counselingPlan', newFormData);
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || (question.type === 'checkbox' ? false : '');

    if (question.type === 'checkbox') {
      return (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={question.id}
            checked={value}
            onChange={(e) => handleInputChange(question.id, e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor={question.id} className="text-sm text-gray-700">
            {question.title}
          </label>
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={question.id} className="block text-sm font-medium text-gray-700 mb-2">
          {question.title}
        </label>
        <textarea
          id={question.id}
          value={value}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-50 to-pink-100 border-2 border-fuchsia-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-800">
              Step 15: School Counseling Plan
            </h2>
            <p className="text-fuchsia-600">
              Comprehensive school counseling program and services
            </p>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-fuchsia-600" />
            <span className="font-semibold text-fuchsia-800">NYSED Requirements</span>
          </div>
          <p className="text-fuchsia-700 text-sm">
            NYSED state law requires certified school counselors to design and develop comprehensive school counseling programs in collaboration with school administration and staff.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Program Coordinator</span>
          </div>
          <p className="text-blue-700 text-sm">
            The counseling plan coordinator is responsible for developing the plan, attending OSYD professional development, and revising based on student needs and feedback.
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {question.title}
              </h3>
              {question.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {question.description}
                </p>
              )}
            </div>
            
            {renderQuestion(question)}
            
            {question.required && (
              <p className="text-red-600 text-sm mt-2">
                * This field is required
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Alert */}
      <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-fuchsia-600" />
          <span className="font-semibold text-fuchsia-800">Ready to Proceed?</span>
        </div>
        <p className="text-fuchsia-700 text-sm mt-2">
          Once you've confirmed your school's comprehensive counseling program status, you can proceed to submit your completed School Plan Form for administrative review.
        </p>
      </div>
    </div>
  );
}
