import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '/BalayGinhawa/HotelLogoJpg.jpg'; // Use hotel logo as background
import logo from '/BalayGinhawa/balaylogopng.png';
import { useAttendance } from '../../../hooks/useAttendance';
import type { Staff } from '../manage-staff/types';

const EmployeeTimeClock = () => {
  const navigate = useNavigate();
  const [rfid, setRfid] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    rfid: '',
    timeIn: '',
    timeOut: '',
    date: '',
  });
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [recentClockInTime, setRecentClockInTime] = useState<Date | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { loading, error, handleRFIDScan } = useAttendance();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleRFIDChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    console.log('Input changed, raw value:', JSON.stringify(rawValue));
    setRfid(rawValue);

    // Process RFID immediately when we have a complete value (10+ characters or contains newline/carriage return)
    const cleanValue = rawValue.replace(/[\n\r]/g, '').trim();
    console.log('Clean RFID value:', JSON.stringify(cleanValue));

    if (cleanValue && (cleanValue.length >= 10 || rawValue.includes('\n') || rawValue.includes('\r'))) {
      console.log('Processing RFID scan for:', JSON.stringify(cleanValue));

      const now = new Date();

      // Check if scanned within 5 seconds of any previous scan (not just clock in)
      if (lastScanTime && (now.getTime() - lastScanTime.getTime()) < 5000) {
        console.log('Duplicate scan detected within 5 seconds, showing warning modal');
        setShowWarningModal(true);
        // Update last scan time even for duplicates to maintain the 5-second window
        setLastScanTime(now);
        setRfid('');
        inputRef.current?.focus();
        return;
      }

      // Update last scan time for successful scans
      setLastScanTime(now);

      const result = await handleRFIDScan(cleanValue);
      console.log('RFID scan result:', result);

      if (result.success && result.staff) {
        if (result.message.includes('in')) {
          const newFormData = {
            name: result.staff.fullName,
            rfid: cleanValue,
            timeIn: now.toLocaleTimeString(),
            timeOut: '',
            date: now.toLocaleDateString(),
          };
          console.log('Setting form data for clock in:', newFormData);
          setFormData(newFormData);
          setRecentClockInTime(now);
          setTimeout(() => {
            setRecentClockInTime(null);
          }, 5000);
        } else if (result.message.includes('out')) {
          setFormData(prev => {
            const updated = {
              ...prev,
              timeOut: now.toLocaleTimeString(),
            };
            console.log('Updating form data for clock out:', updated);
            return updated;
          });
        }
      } else {
        console.log('RFID scan failed:', result.message);
        alert(result.message || 'RFID not found. Please register first.');
      }

      // Clear input after processing
      setRfid('');
      inputRef.current?.focus();
    }
  };

  const handleScan = async () => {
    if (recentClockInTime && (Date.now() - recentClockInTime.getTime()) < 5000) {
      setShowWarningModal(true);
      return;
    }
    if (rfid.trim()) {
      await handleRFIDChange({ target: { value: rfid } } as any);
    }
  };

  const closeWarningModal = () => {
    setShowWarningModal(false);
  };



  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-black/40"></div>


      {/* Main Content Area - Centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        {/* Time Clock Card */}
        <div className="w-full max-w-md mx-auto overflow-hidden shadow-2xl bg-[#FBF0E4] rounded-lg">
          {/* Header */}
          <div className="bg-[#889D65] text-white text-center py-6 rounded-t-lg">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Balay Ginhawa Logo"
                width={120}
              />
            </div>
            <h1 className="admin-login-title text-2xl font-bold tracking-wide uppercase">EMPLOYEE LOGIN</h1>
          </div>

          {/* Form Container */}
          <div className="px-6 pt-4 pb-6 space-y-4">

            {/* Hidden RFID Input for Reader */}
            <input
              ref={inputRef}
              type="text"
              value={rfid}
              onChange={handleRFIDChange}
              className="absolute opacity-0 pointer-events-none"
              style={{ top: '-9999px', left: '-9999px' }}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-none text-xs">
                {error}
              </div>
            )}

            {/* Employee Info Form */}
            <div className="bg-gray-50 border border-gray-200 rounded-none p-6 text-base space-y-4">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Employee Information:</h3>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium">Employee Name</label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-gray-800 text-base font-medium"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium">Employee ID (RFID)</label>
                <input
                  type="text"
                  value={formData.rfid}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-gray-800 text-base font-medium"
                />
              </div>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-gray-600 text-sm mb-2 font-medium">Time In</label>
                  <input
                    type="text"
                    value={formData.timeIn}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-gray-800 text-base font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 text-sm mb-2 font-medium">Time Out</label>
                  <input
                    type="text"
                    value={formData.timeOut}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-gray-800 text-base font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-gray-800 text-base font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Duplicate Scan Detected</h2>
            <p className="text-gray-600 mb-2">RFID scanned too quickly. All input data has been cleared.</p>
            <p className="text-gray-600 mb-4">You need to wait 5 seconds before scanning again.</p>
            <button
              onClick={() => {
                closeWarningModal();
                // Clear all form data to make it look new
                setFormData({
                  name: '',
                  rfid: '',
                  timeIn: '',
                  timeOut: '',
                  date: '',
                });
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-base shadow-md transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}



      {/* Footer */}
      <div className="relative z-10 w-full bg-[#889D65] text-white text-center py-4">
        <p className="text-base font-bold">© 2025 Balay Ginhawa. All rights reserved.</p>
      </div>
    </div>
  );
};

export default EmployeeTimeClock;
