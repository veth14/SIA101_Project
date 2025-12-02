import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/BalayGinhawa/balaylogopng.png';
import { useAttendance, StaffWithAttendance } from '../../../hooks/useAttendance';

const EmployeeTimeClock = () => {
  const navigate = useNavigate();
  // Removed rfid state, using ref for uncontrolled input
  const [formData, setFormData] = useState({
    name: '',
    rfid: '',
    timeIn: '',
    timeOut: '',
    date: '',
  });
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [lastScanned, setLastScanned] = useState<{ rfid: string; time: Date } | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);
  const accumulatedRFID = useRef('');
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessing = useRef(false);

  const { loading, error, handleRFIDScan } = useAttendance();

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);



  // Core scan logic
  const processRFID = async (cleanValue: string) => {
    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    try {
      const now = new Date();

      // Prevent duplicate scans of the same RFID within 5 seconds
      if (lastScanned && lastScanned.rfid === cleanValue && now.getTime() - lastScanned.time.getTime() < 5000) {
        setShowWarningModal(true);
        return;
      }
      setLastScanned({ rfid: cleanValue, time: now });

      const result = await handleRFIDScan(cleanValue);

      if (result.success && result.staff) {
        if (result.message.includes('in')) {
          // Clock in
          setFormData({
            name: result.staff.fullName,
            rfid: cleanValue,
            timeIn: now.toLocaleTimeString(),
            timeOut: '',
            date: now.toLocaleDateString(),
          });
        } else if (result.message.includes('out')) {
          // Clock out - fetch data from database
          const staffWithAttendance = result.staff as StaffWithAttendance;
          
          // Safely convert timeIn timestamp to date string
          let timeInString = '';
          if (staffWithAttendance.timeIn) {
            try {
              let timeInDate: Date;
              if (typeof staffWithAttendance.timeIn.toDate === 'function') {
                timeInDate = staffWithAttendance.timeIn.toDate();
              } else if (staffWithAttendance.timeIn instanceof Date) {
                timeInDate = staffWithAttendance.timeIn;
              } else if (typeof staffWithAttendance.timeIn === 'object' && (staffWithAttendance.timeIn as any).seconds) {
                timeInDate = new Date((staffWithAttendance.timeIn as any).seconds * 1000);
              } else {
                timeInDate = new Date(staffWithAttendance.timeIn as any);
              }
              timeInString = timeInDate.toLocaleTimeString();
            } catch (e) {
              timeInString = '';
            }
          }
          
          setFormData({
            name: staffWithAttendance.fullName,
            rfid: cleanValue,
            timeIn: timeInString,
            timeOut: now.toLocaleTimeString(),
            date: staffWithAttendance.date || now.toLocaleDateString(),
          });
        }

        // Clear form data after 3 seconds
        clearTimeoutRef.current = setTimeout(() => {
          setFormData({
            name: '',
            rfid: '',
            timeIn: '',
            timeOut: '',
            date: '',
          });
        }, 3000);
      } else {
        // Show inline error instead of alert
        
      }

      setCurrentInput('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      isProcessing.current = false;
    }
  };

  const handleRFIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    

    // Accumulate the input in ref
    accumulatedRFID.current = rawValue.replace(/[\n\r]/g, '').trim();

    // Update the state for controlled input
    setCurrentInput(rawValue);

    // Clear existing timeout
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
    }

    // Set timeout to process after 100ms (adjust as needed for your RFID reader speed)
    scanTimeout.current = setTimeout(() => {
      const cleanValue = accumulatedRFID.current;
      

      if (cleanValue.length >= 10) {
        processRFID(cleanValue);
      } else {
        // Clear input if not long enough
        setCurrentInput('');
        accumulatedRFID.current = '';
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, 100);
  };

  const closeWarningModal = () => {
    setShowWarningModal(false);
    // Delay focus to ensure modal is fully closed
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };


  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="flex">
            {/* Left: Logo */}
            <div className="w-1/2 p-12 flex flex-col items-center justify-center bg-gray-50">
              <img src={logo} alt="Balay Ginhawa Logo" width={250} />
              <h1 className="text-5xl font-bold text-gray-800 mt-6 text-center">
                Staff Login of Work Flow Management
              </h1>
            </div>

            {/* Right: Form */}
            <div className="w-1/2 p-12">
              {/* Hidden RFID input */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleRFIDChange}
                className="opacity-0 absolute"
                style={{ width: '200px', height: '40px', top: '0px', left: '0px' }}
                aria-hidden="true"
              />

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Employee Info */}
              <div className="bg-gray-100 border border-gray-200 p-8 text-xl space-y-6">
                <h3 className="font-bold text-gray-800 mb-6 text-3xl">Employee Information:</h3>
                <div>
                  <label className="block text-gray-600 text-xl mb-3 font-medium">Employee Name</label>
                  <input type="text" value={formData.name} readOnly className="w-full px-5 py-4 border border-gray-300 bg-white text-xl font-medium" />
                </div>
                <div>
                  <label className="block text-gray-600 text-xl mb-3 font-medium">Employee ID (RFID)</label>
                  <input type="text" value={formData.rfid} readOnly className="w-full px-5 py-4 border border-gray-300 bg-white text-xl font-medium" />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 text-xl mb-3 font-medium">Time In</label>
                    <input type="text" value={formData.timeIn} readOnly className="w-full px-5 py-4 border border-gray-300 bg-white text-xl font-medium" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 text-xl mb-3 font-medium">Time Out</label>
                    <input type="text" value={formData.timeOut} readOnly className="w-full px-5 py-4 border border-gray-300 bg-white text-xl font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 text-xl mb-3 font-medium">Date</label>
                  <input type="text" value={formData.date} readOnly className="w-full px-5 py-4 border border-gray-300 bg-white text-xl font-medium" />
                </div>
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
            <p className="text-gray-600 mb-2">RFID scanned too quickly. Please wait 5 seconds before scanning again.</p>
            <button onClick={closeWarningModal} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTimeClock;
