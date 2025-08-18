'use client';

import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Building2, 
  Calendar,
  Clock,
  Award,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import formQuestionsData from '../data/formQuestions.json';

const FormViewer = ({ form }) => {
  // Format checkbox values to show "Confirmed" instead of "true"
  const formatValue = (value, type) => {
    if (type === 'checkbox') {
      if (value === true) return 'Confirmed';
      if (value === false) return 'Not Confirmed';
      return value || 'Not Confirmed';
    }
    return value || 'No response provided';
  };

  // Check if a step has data
  const hasStepData = (stepKey) => {
    const stepData = form.formData?.[stepKey];
    return stepData?.data && Object.keys(stepData.data).length > 0;
  };

  // Get step completion status
  const isStepCompleted = (stepKey) => {
    return form.formData?.[stepKey]?.completed === true;
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('form-viewer-content');
      if (!element) return;

      // Create a temporary container for better PDF formatting
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px'; // Fixed width for consistent PDF
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      
      // Clone the content
      const clonedContent = element.cloneNode(true);
      
      // Clean up the cloned content for PDF
      const cleanForPDF = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Remove print-specific classes
          node.className = node.className.replace(/print:/g, '');
          
          // Ensure text colors are readable
          if (node.style.color) {
            node.style.color = '#000000';
          }
          
          // Ensure background colors are white
          if (node.style.backgroundColor && node.style.backgroundColor !== 'white') {
            node.style.backgroundColor = 'white';
          }
          
          // Process children
          Array.from(node.children).forEach(cleanForPDF);
        }
      };
      
      cleanForPDF(clonedContent);
      tempContainer.appendChild(clonedContent);
      document.body.appendChild(tempContainer);

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.scrollHeight
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10; // Top margin

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20); // Account for margins

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      // Save PDF
      const fileName = `School-Plan-Form-${form.schoolName?.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Enhanced print function
  const handlePrint = () => {
    // Add print-specific styles temporarily
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #form-viewer-content, #form-viewer-content * { visibility: visible; }
        #form-viewer-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100%; 
          height: auto;
          background: white !important;
          color: black !important;
        }
        .print-break { page-break-before: always; }
        .print-no-break { page-break-inside: avoid; }
        .print-break-after { page-break-after: always; }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    // Remove temporary styles after printing
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  return (
    <div id="form-viewer-content" className="space-y-8 print-space-y-4">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-100 border-2 border-blue-200 rounded-xl p-6 print-break-inside-avoid print-no-break">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 print-hidden">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            School Plan Form - Approved
          </h1>
          <p className="text-blue-600 text-lg">
            Official Approved Submission
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">School:</span>
              <span className="text-blue-700">{form.schoolName || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Principal:</span>
              <span className="text-blue-700">{form.principalName || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Status:</span>
              <span className="text-green-600 font-semibold">✓ APPROVED</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Created:</span>
              <span className="text-blue-700">
                {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Submitted:</span>
              <span className="text-blue-700">
                {form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Progress:</span>
              <span className="text-blue-700">
                {form.completedSteps?.length || 0}/15 steps completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Steps */}
      {formQuestionsData.steps.map((step, index) => {
        const stepKey = step.key;
        const stepData = form.formData?.[stepKey];
        const questions = step.questions || [];
        
        if (!hasStepData(stepKey)) {
          return null; // Skip steps with no data
        }

        return (
          <div key={stepKey} className={`border-2 border-gray-200 rounded-xl p-6 print-break-inside-avoid print-no-break ${index > 0 ? 'print-break' : ''}`}>
            {/* Step Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isStepCompleted(stepKey) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-400 text-white'
              }`}>
                {isStepCompleted(stepKey) ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Step {step.id}: {step.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isStepCompleted(stepKey)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isStepCompleted(stepKey) ? '✓ Completed' : '⚠ Incomplete'}
                  </span>
                  {stepData?.lastUpdated && (
                    <span className="text-sm text-gray-600">
                      Last updated: {new Date(stepData.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step Questions and Answers */}
            <div className="space-y-6">
              {questions.map((question) => {
                const answer = stepData.data?.[question.id];
                const hasAnswer = answer !== undefined && answer !== null && answer !== '';
                
                if (!hasAnswer) return null; // Skip questions with no answer

                return (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 print-no-break">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      {question.title}
                    </h3>
                    <div className="bg-white rounded p-3 border border-gray-300">
                      <span className="text-gray-700">
                        {formatValue(answer, question.type)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Print Footer */}
      <div className="text-center text-gray-500 text-sm print-break-inside-avoid print-break">
        <p>This form was approved on {form.reviewedAt ? new Date(form.reviewedAt).toLocaleDateString() : 'recently'}</p>
        <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Action Buttons - Hidden during print */}
      <div className="flex justify-center gap-4 pt-6 print-hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Print Form
        </button>
        <button
          onClick={exportToPDF}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default FormViewer;
