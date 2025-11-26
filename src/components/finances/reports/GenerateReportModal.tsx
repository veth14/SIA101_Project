import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { createReport, checkReportExists, ReportCreateData } from '@/backend/reports/reportsService';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated?: (reportId: string) => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, onReportCreated }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [reportExists, setReportExists] = useState(false);

  const categories = [
    { value: 'income', label: 'Income Report', icon: '💰' },
    { value: 'expense', label: 'Expense Report', icon: '📊' },
    { value: 'profit-loss', label: 'Profit & Loss Statement', icon: '📈' },
    { value: 'balance', label: 'Balance Sheet', icon: '⚖️' },
    { value: 'custom', label: 'Custom Report', icon: '📋' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2025', '2024', '2023', '2022', '2021'];

  const handleGenerate = async () => {
    if (!selectedCategory || !selectedMonth || !selectedYear) {
      alert('Please select all fields');
      return;
    }

    try {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const yearNum = parseInt(selectedYear, 10);

      // Real existence check against Firestore
      const exists = await checkReportExists(selectedCategory, monthIndex, yearNum);
      if (exists) {
        setReportExists(true);
        return;
      }

      setIsGenerating(true);

      const categoryLabel = categories.find(c => c.value === selectedCategory)?.label || 'Report';
      const safeCategoryPrefix = categoryLabel.split(' ')[0] || 'Report';
      const paddedMonth = String(monthIndex).padStart(2, '0');
      const name = `${safeCategoryPrefix.replace(/[^A-Za-z]/g, '')}Report-${yearNum}-${paddedMonth}-v1.pdf`;

      const today = new Date();
      const dateGenerated = today.toISOString().split('T')[0];

      const payload: ReportCreateData = {
        name,
        category: selectedCategory,
        month: monthIndex,
        year: yearNum,
        dateGenerated,
        preparedBy: 'Finance Team',
        fileType: 'PDF',
        fileSize: '1.0 MB',
        status: 'active',
        version: 1,
      };

      const id = await createReport(payload);

      setIsGenerating(false);
      setIsGenerated(true);
      if (id && typeof onReportCreated === 'function') {
        onReportCreated(id);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      alert('Failed to generate report. Please try again.');
    }
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={handleClose}
        aria-label="Close overlay"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[80vh] mx-6 my-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 pb-2 flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Generate Financial Report</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new financial report for your selected category and period.
                </p>
              </div>
            </div>
            <div aria-hidden />
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pb-10 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
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
              <div className="flex flex-col items-center justify-center py-8 text-center bg-emerald-50/70 border border-emerald-100 rounded-2xl shadow-sm">
                <div className="p-4 mb-4 bg-white border border-emerald-100 rounded-full shadow-sm">
                  <CheckCircle className="w-16 h-16 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">Report Generated Successfully!</h3>
                <p className="mb-6 text-sm text-slate-700">
                  Your {categories.find(c => c.value === selectedCategory)?.label} for {selectedMonth} {selectedYear} is ready.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => alert('Downloading report...')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-700/20 hover:shadow-lg hover:-translate-y-0.5 transition"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                isGenerating
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-700/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
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
