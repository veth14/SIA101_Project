import React, { useState } from 'react';
import { Archive, ChevronDown, ChevronUp, Search, Download, Eye } from 'lucide-react';
import { getArchivedReports, reportCategories } from '../../../data/financialReportsData';

const ArchiveSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const archivedReports = getArchivedReports();

  const filteredReports = archivedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return '📄';
      case 'Excel':
        return '📊';
      case 'CSV':
        return '📈';
      default:
        return '📁';
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
            <Archive className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">Archived Reports</h3>
            <p className="text-sm text-gray-500">
              {archivedReports.length} archived {archivedReports.length === 1 ? 'report' : 'reports'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Filters */}
          <div className="p-6 bg-gradient-to-r from-heritage-light/30 to-white border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search archived reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
              >
                <option value="all">All Categories</option>
                {reportCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Archived Reports Grid */}
          <div className="p-6">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Archive className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No archived reports found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredReports.map((report) => {
                  const category = reportCategories.find(c => c.id === report.category);
                  return (
                    <div
                      key={report.id}
                      className="group relative bg-gray-50 border border-gray-300 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      {/* Archived Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          Archived
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">{getFileIcon(report.fileType)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                            {report.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{category?.icon}</span>
                            <span className="truncate">{category?.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-1 mb-3 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">
                            {new Date(report.dateGenerated).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium">{report.fileSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>By:</span>
                          <span className="font-medium truncate">{report.preparedBy}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <button
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          {filteredReports.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredReports.length}</span> of{' '}
                <span className="font-semibold">{archivedReports.length}</span> archived reports
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArchiveSection;
