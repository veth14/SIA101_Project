import React, { useState } from 'react';
import { Archive, ChevronDown, Download, Eye } from 'lucide-react';
import { getArchivedReports, reportCategories } from '../../../data/financialReportsData';

const ArchiveSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const archivedReports = getArchivedReports();

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
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-3xl border-2 border-slate-200/50 shadow-xl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gray-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative z-10 w-full flex items-center justify-between p-8 hover:bg-white/50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-5">
          {/* Premium Archive Icon */}
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Archive className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Archived Reports
              </h3>
              <div className="px-3 py-1 bg-slate-600/10 backdrop-blur-sm border border-slate-600/20 rounded-full">
                <span className="text-xs font-bold text-slate-700">{archivedReports.length} Reports</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Historical reports stored for compliance and reference
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {!isExpanded && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xs font-semibold text-blue-700">Click to expand</span>
            </div>
          )}
          <div className={`p-3 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="relative z-10 border-t-2 border-slate-200/50">
          {/* Archived Reports Grid */}
          <div className="p-8">
            {archivedReports.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative mx-auto mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
                    <Archive className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-slate-400 to-slate-500 rounded-3xl blur opacity-20"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Archived Reports</h3>
                <p className="text-slate-500">Reports will appear here after archiving</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {archivedReports.map((report) => {
                  const category = reportCategories.find(c => c.id === report.category);
                  return (
                    <div
                      key={report.id}
                      className="group relative bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 overflow-hidden"
                    >
                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-100/50 to-transparent rounded-bl-3xl"></div>
                      
                      {/* Premium Archived Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md">
                          📦 Archived
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">{getFileIcon(report.fileType)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate mb-1.5 group-hover:text-heritage-green transition-colors">
                            {report.name}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                              {category?.icon} {category?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Premium Meta Info */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 font-medium">📅 Date:</span>
                          <span className="font-bold text-slate-700">
                            {new Date(report.dateGenerated).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 font-medium">📦 Size:</span>
                          <span className="font-bold text-slate-700">{report.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 font-medium">👤 By:</span>
                          <span className="font-bold text-slate-700 truncate">{report.preparedBy}</span>
                        </div>
                      </div>

                      {/* Premium Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t-2 border-slate-200">
                        <button
                          onClick={() => alert(`Viewing ${report.name}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => alert(`Downloading ${report.name}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 hover:scale-105"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Premium Summary Footer */}
          {archivedReports.length > 0 && (
            <div className="px-8 py-5 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-t-2 border-slate-200/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Showing <span className="font-black text-heritage-green text-base">{archivedReports.length}</span> archived {archivedReports.length === 1 ? 'report' : 'reports'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-600">Storage: 24.8 MB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Bottom Accent Line */}
      {isExpanded && (
        <div className="h-1.5 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400"></div>
      )}
    </div>
  );
};

export default ArchiveSection;
