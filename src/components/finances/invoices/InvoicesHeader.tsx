import React from 'react';

const InvoicesHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden border shadow-2xl bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl border-green-500/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent animate-pulse"></div>
      <div className="absolute w-40 h-40 rounded-full top-1/3 right-1/3 bg-green-500/5 animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
      <div className="absolute w-24 h-24 rounded-full bottom-1/4 left-1/4 bg-green-500/10 animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
      
      {/* Header Content */}
      <div className="relative p-10">
        <div className="flex items-center justify-between">
          {/* Left Side - Title and Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {/* Icon with Glow Effect */}
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>
              
              {/* Title and Description */}
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                  Invoices & Billing
                </h1>
                <p className="text-xl font-medium tracking-wide text-gray-700">
                  Generate and manage guest invoices with itemized charges
                </p>
                
                {/* Status Indicators */}
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-emerald-50 backdrop-blur-sm border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-700">Invoice system online</span>
                  </div>
                  <div className="flex items-center px-4 py-2 space-x-2 border border-blue-200 rounded-full bg-blue-50 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Real-time Clock */}
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
  );
};

export { InvoicesHeader };
export default InvoicesHeader;