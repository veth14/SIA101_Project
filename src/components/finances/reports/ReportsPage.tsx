import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { ReportsHeader } from './ReportsHeader';
import { ReportsFilters } from './ReportsFilters';
import { ReportsSummary } from './ReportsSummary';
import { ReportsCharts } from './ReportsCharts';
import { ReportsTable } from './ReportsTable';
import { ReportsExport } from './ReportsExport';

interface Report {
  id: string;
  type: 'income' | 'reservations' | 'occupancy' | 'inventory' | 'staff';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  createdAt: Date;
  summary: {
    totalIncome?: number;
    totalReservations?: number;
    occupancyRate?: number;
    avgDailyIncome?: number;
  };
  chartData: any[];
  tableData: any[];
}

export const ReportsPage = () => {
  const [, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Report[];
      
      setReports(reportsData);
      if (reportsData.length > 0) {
        setCurrentReport(reportsData[0]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (filters: any) => {
    try {
      setLoading(true);
      
      // Generate mock data based on filters
      const reportData = generateMockReportData(filters);
      
      // Save to Firestore
      const reportsRef = collection(db, 'reports');
      const docRef = await addDoc(reportsRef, {
        ...reportData,
        createdAt: new Date(),
      });
      
      const newReport = {
        id: docRef.id,
        ...reportData,
        createdAt: new Date(),
      } as Report;
      
      setCurrentReport(newReport);
      setReports(prev => [newReport, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReportData = (filters: any) => {
    // Mock data generation based on filters
    const mockData = {
      type: filters.type,
      dateRange: filters.dateRange,
      summary: {
        totalIncome: 450000,
        totalReservations: 125,
        occupancyRate: 78.5,
        avgDailyIncome: 15000,
      },
      chartData: [
        { month: 'Jan', value: 165000 },
        { month: 'Feb', value: 180000 },
        { month: 'Mar', value: 175000 },
        { month: 'Apr', value: 190000 },
        { month: 'May', value: 185000 },
        { month: 'Jun', value: 200000 },
      ],
      tableData: [
        { id: 1, date: '2024-09-20', description: 'Room Revenue', amount: 15000 },
        { id: 2, date: '2024-09-19', description: 'Event Revenue', amount: 25000 },
        { id: 3, date: '2024-09-18', description: 'Restaurant Revenue', amount: 8500 },
      ],
    };
    
    return mockData;
  };

  return (
    <div className="min-h-screen bg-[#FBF0E4] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <ReportsHeader />

        {/* Filters */}
        <ReportsFilters onGenerateReport={generateReport} loading={loading} />

        {currentReport && (
          <>
            {/* Summary */}
            <ReportsSummary summary={currentReport.summary} />

            {/* Charts */}
            <ReportsCharts chartData={currentReport.chartData} />

            {/* Table */}
            <ReportsTable tableData={currentReport.tableData} />

            {/* Export */}
            <ReportsExport report={currentReport} />
          </>
        )}

        {!currentReport && !loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-gray-100 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
            <p className="text-gray-500">Generate your first report using the filters above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
