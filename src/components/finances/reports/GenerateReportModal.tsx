import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [reportExists, setReportExists] = useState(false);

  const categories = [
    { value: 'income', label: 'Income Report', icon: '💰' },
    { value: 'expense', label: 'Expense Report', icon: '📊' },
    { value: 'payroll', label: 'Payroll Summary', icon: '👥' },
    { value: 'profit-loss', label: 'Profit & Loss Statement', icon: '📈' },
    { value: 'balance', label: 'Balance Sheet', icon: '⚖️' },
    { value: 'custom', label: 'Custom Report', icon: '📋' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2025', '2024', '2023', '2022', '2021'];

  const handleGenerate = () => {
    if (!selectedCategory || !selectedMonth || !selectedYear) {
      alert('Please select all fields');
      return;
    }

    // Check if report already exists (simulate check)
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const existingReports = [
      { category: 'income', month: 10, year: 2025 },
      { category: 'expense', month: 10, year: 2025 },
      { category: 'payroll', month: 10, year: 2025 }
    ];

    const exists = existingReports.some(
      r => r.category === selectedCategory && r.month === monthIndex && r.year === parseInt(selectedYear)
    );

    if (exists) {
      setReportExists(true);
      return;
    }

    // Simulate report generation
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedMonth('');
    setSelectedYear('2025');
    setIsGenerating(false);
    setIsGenerated(false);
    setReportExists(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-heritage-neutral/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-heritage-green/10 rounded-xl">
              <FileText className="w-6 h-6 text-heritage-green" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Financial Report</h2>
              <p className="text-sm text-gray-600">Create a new financial report for analysis</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {reportExists ? (
            // Report Already Exists Warning
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Report Already Exists</h3>
                  <p className="text-amber-800 mb-4">
                    A <strong>{categories.find(c => c.value === selectedCategory)?.label}</strong> report for{' '}
                    <strong>{selectedMonth} {selectedYear}</strong> has already been generated.
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-amber-200">
                    <button
                      onClick={() => alert('Downloading existing report...')}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Existing
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-amber-800 font-semibold border border-amber-300 rounded-lg transition-colors"
                    >
                      Generate New Period
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : isGenerated ? (
            // Success State
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 bg-emerald-100 rounded-full mb-4 animate-bounce">
                  <CheckCircle className="w-16 h-16 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Generated Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Your {categories.find(c => c.value === selectedCategory)?.label} for {selectedMonth} {selectedYear} is ready.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => alert('Downloading report...')}
                    className="flex items-center gap-2 px-6 py-3 bg-heritage-green hover:bg-heritage-green/90 text-white font-semibold rounded-xl transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Report
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Form
            <div className="space-y-6">
              {/* Report Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FileText className="w-4 h-4 text-heritage-green" />
                  Report Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="">Select report type...</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Calendar className="w-4 h-4 text-heritage-green" />
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all"
                  >
                    <option value="">Select month...</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Calendar className="w-4 h-4 text-heritage-green" />
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Report Generation</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Reports are automatically named: Category-YYYY-MM-Type-v1</li>
                      <li>• Generation typically takes 5-10 seconds</li>
                      <li>• You'll be notified if a report already exists</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isGenerated && !reportExists && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-semibold border border-gray-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default GenerateReportModal;
