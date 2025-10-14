import React from 'react';
import { FileText, Download, Eye, Calendar, User, X } from 'lucide-react';
import { sampleReports } from '../../../data/financialReportsData';
import type { FinancialReport } from '../../../data/financialReportsData';

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, onClose }) => {
  // Filter reports based on search query
  const filteredReports = sampleReports.filter(report => {
    const query = searchQuery.toLowerCase();
    return (
      report.name.toLowerCase().includes(query) ||
      report.id.toLowerCase().includes(query) ||
      report.category.toLowerCase().includes(query) ||
      report.preparedBy.toLowerCase().includes(query) ||
      report.fileType.toLowerCase().includes(query)
    );
  });

  if (!searchQuery || filteredReports.length === 0) return null;

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF': return '📄';
      case 'Excel': return '📊';
      case 'CSV': return '📈';
      default: return '📁';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'income': '💰',
      'expense': '📊',
      'payroll': '👥',
      'profit-loss': '📈',
      'balance': '⚖️',
      'custom': '📋'
    };
    return icons[category] || '📁';
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-heritage-green/30 shadow-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Search Results</h3>
          <p className="text-sm text-gray-600 mt-1">
            Found <span className="font-bold text-heritage-green">{filteredReports.length}</span> report{filteredReports.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close search results"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="group p-4 bg-gradient-to-r from-heritage-light/20 to-white border-2 border-gray-200 hover:border-heritage-green/50 rounded-xl transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Side - Report Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{getFileIcon(report.fileType)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 truncate group-hover:text-heritage-green transition-colors">
                      {report.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                        {getCategoryIcon(report.category)} {report.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                        report.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        report.fileType === 'PDF' 
                          ? 'bg-red-100 text-red-700'
                          : report.fileType === 'Excel'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {report.fileType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-heritage-green" />
                    <span>{new Date(report.dateGenerated).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-heritage-green" />
                    <span className="truncate">{report.preparedBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-heritage-green" />
                    <span>{report.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">ID:</span>
                    <span className="font-mono">{report.id}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Viewing ${report.name}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Report"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => alert(`Downloading ${report.name}`)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Download Report"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Displaying all results for "<span className="font-semibold text-gray-900">{searchQuery}</span>"
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-heritage-green/10 hover:bg-heritage-green/20 text-heritage-green font-semibold rounded-lg transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
