import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

interface ReportsExportProps {
  report: any;
}

export const ReportsExport = ({ report }: ReportsExportProps) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const logExport = async (format: string) => {
    try {
      const exportLog = {
        reportId: report.id,
        reportType: report.type,
        format: format,
        exportedAt: new Date(),
        dateRange: report.dateRange,
      };
      
      await addDoc(collection(db, 'exportLogs'), exportLog);
    } catch (error) {
      console.error('Error logging export:', error);
    }
  };

  const exportToPDF = async () => {
    setExporting('pdf');
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the export
      await logExport('PDF');
      
      // In a real implementation, you would generate and download the PDF here
      console.log('PDF export completed for report:', report.id);
      alert('PDF export completed! (This is a simulation)');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF');
    } finally {
      setExporting(null);
    }
  };

  const exportToCSV = async () => {
    setExporting('csv');
    try {
      // Generate CSV content
      const csvContent = generateCSV();
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `report_${report.type}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Log the export
      await logExport('CSV');
      
      console.log('CSV export completed for report:', report.id);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    } finally {
      setExporting(null);
    }
  };

  const generateCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Amount'];
    const rows = report.tableData.map((item: any) => [
      item.id || '',
      item.date || '',
      item.description || '',
      item.amount || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#82A33D]">Export Report</h3>
          <p className="text-sm text-gray-500">Download report in your preferred format</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export as PDF */}
          <button
            onClick={exportToPDF}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exporting === 'pdf' ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as PDF
              </>
            )}
          </button>

          {/* Export as CSV */}
          <button
            onClick={exportToCSV}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 bg-[#82A33D] text-white font-medium rounded-lg hover:bg-[#6d8a33] focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exporting === 'csv' ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as CSV
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Export Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Export Information:</p>
            <ul className="text-xs space-y-1">
              <li>• PDF exports include charts and formatted layout</li>
              <li>• CSV exports contain raw data for further analysis</li>
              <li>• All exports are logged for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
