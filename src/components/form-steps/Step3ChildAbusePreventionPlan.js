'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import formQuestionsData from '../../data/formQuestions.json';

const Step3ChildAbusePreventionPlan = ({ stepData, updateStepData, isActive }) => {
  const [questions] = useState(() => {
    const step = formQuestionsData.steps.find(s => s.key === 'childAbuseIntervention');
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
    updateStepData('childAbuseIntervention', newFormData);
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || (question.type === 'checkbox' ? false : '');
    // In your component
    // Or use CSS: white-space: pre-line
    // <label htmlFor={question.id} className="text-sm text-gray-700 whitespace-pre-line">
    //   {formattedTitle}
    // </label>
    const formattedTitle = question.title.replace(/\n/g, '<br />');

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
            {formattedTitle}
          </label>
        </div>
      );
    }

    if (question.type === 'text') {
      return (
        <input
          type="text"
          id={question.id}
          value={value}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
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
      <div className="bg-gradient-to-r from-red-50 to-rose-100 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-800">
              Step 3: Child Abuse and Neglect Intervention
            </h2>
            <p className="text-red-600">
              Comprehensive prevention and intervention protocols for child safety
            </p>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Critical Safety Protocols</span>
          </div>
          <p className="text-red-700 text-sm">
            This step establishes essential protocols for preventing and responding to child abuse and neglect, ensuring student safety and compliance with regulations.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Training Requirements</span>
          </div>
          <p className="text-blue-700 text-sm">
            All staff must receive training by October 31st on signs of abuse, reporting procedures, and legal aspects including confidentiality.
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-800">Student Safety Priority</span>
        </div>
        <p className="text-red-700 text-sm mt-2">
          Child abuse prevention and intervention is a critical component of school safety. Ensure all protocols are clearly documented and staff are properly trained to recognize and respond to potential abuse situations.
        </p>
      </div>
    </div>
  );
};

export default Step3ChildAbusePreventionPlan;