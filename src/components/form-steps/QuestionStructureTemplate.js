// 📋 Question Structure Template
// This file shows the enhanced JSON structure for form questions
// Copy this structure to all form step components for consistency

export const questionStructureTemplate = {
  // Basic question properties
  id: 'uniqueFieldId',           // Unique identifier for the field
  number: 1,                     // Question number for display
  title: 'Question title here',  // Main question text
  type: 'text',                  // Input type: 'text', 'textarea', 'checkbox', 'select'
  placeholder: 'Placeholder text', // Helper text for input fields
  
  // NEW: Required field indicator
  required: true,                 // true = mandatory, false = optional
  
  // Enhanced descriptions and context
  description: 'Detailed explanation of what this field is for and why it\'s required/optional',
  subtitle: 'Additional sub-question or clarification', // Optional
  
  // Advanced features (for future implementation)
  conditional: {                  // Conditional requirements
    field: 'otherFieldName',      // Field to check
    value: ['value1', 'value2'],  // Values that make this required
    message: 'Conditional requirement message'
  },
  
  validation: {                   // Custom validation rules
    minLength: 10,                // Minimum characters
    maxLength: 500,               // Maximum characters
    pattern: 'regex-pattern',     // Regex validation
    custom: 'customValidationFunction'
  },
  
  help: {                         // Help text and resources
    text: 'Additional help information',
    link: 'https://example.com/help',
    examples: ['Example 1', 'Example 2']
  }
};

// 📊 Example Question Objects

export const exampleQuestions = [
  {
    id: 'requiredField',
    number: 1,
    title: 'This is a required field for compliance',
    type: 'text',
    placeholder: 'Enter required information',
    required: true,
    description: 'This field is mandatory for regulatory compliance'
  },
  
  {
    id: 'optionalField',
    number: 2,
    title: 'This is an optional field for best practices',
    type: 'textarea',
    placeholder: 'Optional information (can be skipped)',
    required: false,
    description: 'Recommended for comprehensive planning but not required'
  },
  
  {
    id: 'conditionalField',
    number: 3,
    title: 'This field is conditionally required',
    type: 'text',
    placeholder: 'Enter if applicable',
    required: false,
    description: 'Required only for certain school types',
    conditional: {
      field: 'schoolType',
      value: ['K-8', 'elementary', 'middle'],
      message: 'This field is required for K-8 schools only'
    }
  },
  
  {
    id: 'complexField',
    number: 4,
    title: 'Complex field with multiple properties',
    type: 'textarea',
    placeholder: 'Enter detailed information',
    required: true,
    description: 'Mandatory field with specific requirements',
    subtitle: 'Please provide specific examples and dates',
    validation: {
      minLength: 50,
      maxLength: 1000
    },
    help: {
      text: 'For guidance, see the official documentation',
      link: 'https://schools.nyc.gov/guidance',
      examples: [
        'Example: "Our school conducts monthly training sessions..."',
        'Example: "We have established partnerships with local agencies..."'
      ]
    }
  }
];

// 🎯 Implementation Guidelines

export const implementationGuidelines = {
  // 1. Required vs Optional Fields
  requiredFields: {
    description: 'Fields that must be completed for form submission',
    indicators: ['Red asterisk (*)', 'Red border', 'Required label'],
    validation: 'Block form submission if incomplete',
    examples: ['School name', 'Principal contact', 'Compliance dates']
  },
  
  optionalFields: {
    description: 'Fields that can be skipped without blocking submission',
    indicators: ['Green (Optional) label', 'Blue border', 'Optional icon'],
    validation: 'Allow form submission even if incomplete',
    examples: ['Best practices', 'Additional information', 'Future plans']
  },
  
  // 2. Visual Design
  visualDesign: {
    required: {
      borderColor: '#fecaca',
      backgroundColor: '#fef2f2',
      textColor: '#991b1b',
      icon: '🔴'
    },
    optional: {
      borderColor: '#bae6fd',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      icon: '🔵'
    }
  },
  
  // 3. Progress Calculation
  progressCalculation: {
    method: 'Only count required fields for completion percentage',
    formula: '(completed required fields / total required fields) * 100',
    display: 'Show both required progress and total questions'
  },
  
  // 4. Validation Rules
  validation: {
    clientSide: 'Show real-time feedback on required fields',
    serverSide: 'Validate required fields before saving to database',
    userExperience: 'Clear messaging about what\'s missing'
  }
};

// 🔧 Helper Functions Template

export const helperFunctionsTemplate = {
  // Calculate progress based on required fields
  calculateProgress: (questions, stepData) => {
    const requiredQuestions = questions.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => 
      stepData[q.id] && stepData[q.id].trim() !== ''
    );
    
    return {
      required: requiredQuestions.length,
      answered: answeredRequired.length,
      percentage: Math.round((answeredRequired.length / requiredQuestions.length) * 100),
      isComplete: answeredRequired.length === requiredQuestions.length
    };
  },
  
  // Check if a specific field is complete
  isFieldComplete: (question, value) => {
    if (!question.required) return true; // Optional fields are always "complete"
    return value && value.trim() !== '';
  },
  
  // Get field status for display
  getFieldStatus: (question, value) => {
    const isComplete = question.required ? (value && value.trim() !== '') : true;
    
    if (question.required) {
      return isComplete ? '✅ Required field completed' : '❌ Required field - Please complete';
    } else {
      return isComplete ? '✅ Optional field completed' : '⚪ Optional field - Can be skipped';
    }
  },
  
  // Validate step before submission
  validateStep: (questions, stepData) => {
    const requiredQuestions = questions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q => 
      !stepData[q.id] || stepData[q.id].trim() === ''
    );
    
    return {
      isValid: missingRequired.length === 0,
      missingFields: missingRequired.map(q => q.title),
      message: missingRequired.length === 0 
        ? 'All required fields completed' 
        : `${missingRequired.length} required field(s) remaining`
    };
  }
};

// 📝 Usage Example

export const usageExample = `
// In your form step component:

import { helperFunctionsTemplate } from './QuestionStructureTemplate';

export default function YourFormStep({ stepData, updateStepData }) {
  const questions = [
    // Your questions with required: true/false
  ];
  
  const progress = helperFunctionsTemplate.calculateProgress(questions, stepData);
  const validation = helperFunctionsTemplate.validateStep(questions, stepData);
  
  // Use progress and validation in your component
  // Show progress bars, validation messages, etc.
}
`;

export default {
  questionStructureTemplate,
  exampleQuestions,
  implementationGuidelines,
  helperFunctionsTemplate,
  usageExample
};
