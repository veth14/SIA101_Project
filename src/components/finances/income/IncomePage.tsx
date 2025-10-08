import React from 'react';import React from 'react';import React from 'react';import { IncomeStats } from './IncomeStats';



export const IncomePage: React.FC = () => {

  return (

    <div className="p-6">// Income page implementation - can be expanded with income-specific featuresimport { IncomeChart } from './IncomeChart';

      <h1 className="text-2xl font-bold mb-4">Income Management</h1>

      <p className="text-gray-600">Income tracking features</p>export const IncomePage: React.FC = () => {

    </div>

  );  return (// Income page implementation - can be expanded with income-specific featuresimport IncomeBreakdown from './IncomeBreakdown';

};

    <div className="p-6 space-y-6">

export default IncomePage;
      <div className="bg-white rounded-lg shadow p-6">export const IncomePage: React.FC = () => {import { IncomeTransactions } from './IncomeTransactions';

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Income Management</h1>

        <p className="text-gray-600">  return (

          Income tracking and management features will be implemented here.

        </p>    <div className="p-6 space-y-6">export const IncomePage = () => {

        

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">      <div className="bg-white rounded-lg shadow p-6">  return (

          <div className="bg-green-50 p-4 rounded-lg">

            <h3 className="font-medium text-green-900">Total Income</h3>        <h1 className="text-2xl font-bold text-gray-900 mb-4">Income Management</h1>    <div className="min-h-screen bg-heritage-light">

            <p className="text-2xl font-bold text-green-600">$245,800</p>

          </div>        <p className="text-gray-600">      {/* Light Floating Background Elements */}

          <div className="bg-blue-50 p-4 rounded-lg">

            <h3 className="font-medium text-blue-900">Monthly Income</h3>          Income tracking and management features will be implemented here.      <div className="fixed inset-0 pointer-events-none">

            <p className="text-2xl font-bold text-blue-600">$45,200</p>

          </div>        </p>        {/* Subtle Light Orbs */}

          <div className="bg-purple-50 p-4 rounded-lg">

            <h3 className="font-medium text-purple-900">Today's Income</h3>                <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>

            <p className="text-2xl font-bold text-purple-600">$1,890</p>

          </div>        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>

        </div>

      </div>          <div className="bg-green-50 p-4 rounded-lg">        <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20"></div>

    </div>

  );            <h3 className="font-medium text-green-900">Total Income</h3>        

};

            <p className="text-2xl font-bold text-green-600">$245,800</p>        {/* Light Grid Pattern */}

export default IncomePage;
          </div>        <div className="absolute inset-0 opacity-5">

          <div className="bg-blue-50 p-4 rounded-lg">          <div className="absolute inset-0" style={{

            <h3 className="font-medium text-blue-900">Monthly Income</h3>            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',

            <p className="text-2xl font-bold text-blue-600">$45,200</p>            backgroundSize: '50px 50px'

          </div>          }}></div>

          <div className="bg-purple-50 p-4 rounded-lg">        </div>

            <h3 className="font-medium text-purple-900">Today's Income</h3>      </div>

            <p className="text-2xl font-bold text-purple-600">$1,890</p>

          </div>      {/* Main Content Container */}

        </div>      <div className="relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6">

      </div>        {/* Header */}

    </div>        <div className="relative overflow-hidden border shadow-2xl bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl border-green-500/10">

  );          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>

};          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent animate-pulse"></div>

          <div className="absolute bottom-0 left-0 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent animate-pulse"></div>

export default IncomePage;          <div className="absolute w-40 h-40 rounded-full top-1/3 right-1/3 bg-green-500/5 animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute w-24 h-24 rounded-full bottom-1/4 left-1/4 bg-green-500/10 animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                      Income Management
                    </h1>
                    <p className="text-xl font-medium tracking-wide text-gray-700">
                      Monitor and analyze hotel revenue streams
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-emerald-50 backdrop-blur-sm border-emerald-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                      </div>
                      <div className="flex items-center px-4 py-2 space-x-2 border border-blue-200 rounded-full bg-blue-50 backdrop-blur-sm">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700">
                          Tuesday, Sep 23
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="relative group">
                  <div className="p-8 transition-all duration-500 border shadow-xl bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl border-green-500/20 group-hover:scale-105">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative">
                      <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="mt-2 font-semibold tracking-wide text-gray-700">Current Time</p>
                      <div className="flex items-center justify-center mt-3 space-x-2">
                        <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                        <div className="w-1 h-1 delay-75 bg-green-600 rounded-full animate-ping"></div>
                        <div className="w-1 h-1 delay-150 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Income Stats - Summary Cards - Moved to Top */}
        <IncomeStats />

        {/* Main Charts Section - 2/3 Left, 1/3 Right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Income Chart - 2 columns */}
          <div className="lg:col-span-2">
            <IncomeChart />
          </div>
          
          {/* Income Breakdown - 1 column */}
          <div className="lg:col-span-1">
            <IncomeBreakdown />
          </div>
        </div>

        {/* Recent Transactions Table - Full Width */}
        <IncomeTransactions />
      </div>
    </div>
  );
};
