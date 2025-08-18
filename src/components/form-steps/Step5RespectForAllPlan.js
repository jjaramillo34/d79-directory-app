'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import formQuestionsData from '../../data/formQuestions.json';

const Step5RespectForAllPlan = ({ stepData, updateStepData, isActive }) => {
  const [questions] = useState(() => {
    const step = formQuestionsData.steps.find(s => s.key === 'respectForAll');
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
    updateStepData('respectForAll', newFormData);
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
      <textarea
        id={question.id}
        value={value}
        onChange={(e) => handleInputChange(question.id, e.target.value)}
        placeholder={question.placeholder}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-100 border-2 border-indigo-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-indigo-800">
              Step 5: Respect For All Plan
            </h2>
            <p className="text-indigo-600">
              Comprehensive bias-based harassment prevention and intervention
            </p>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-indigo-800">Inclusive Environment</span>
          </div>
          <p className="text-indigo-700 text-sm">
            This step establishes protocols for preventing and addressing bias-based harassment, ensuring an inclusive and respectful school environment for all students.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Training Requirements</span>
          </div>
          <p className="text-blue-700 text-sm">
            All staff must complete training by October 31st on Chancellor's Regulation A-832 policies and procedures for bias-based harassment prevention and intervention.
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
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-800">Inclusive Learning Environment</span>
        </div>
        <p className="text-indigo-700 text-sm mt-2">
          The Respect For All plan is essential for creating an inclusive and respectful learning environment. Ensure all protocols are clearly documented and staff are properly trained to recognize and respond to bias-based incidents.
        </p>
      </div>
    </div>
  );
};

export default Step5RespectForAllPlan;
