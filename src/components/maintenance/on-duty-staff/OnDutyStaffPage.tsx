import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  limit,
} from "firebase/firestore";

interface AttendanceRecord {
  id: string;
  TimeIn: Timestamp;
  TimeOut: Timestamp | null;
  classification: string;
  date: Timestamp;
  fullName: string;
  rfid: string;
  staffId: string;
  working: boolean;
}

let attendanceCache: AttendanceRecord[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const OnDutyStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<AttendanceRecord[]>([]);
  const [onDutyCount, setOnDutyCount] = useState(0);
  const [offDutyCount, setOffDutyCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchStaff = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        const now = Date.now();

        // Use cached data
        if (attendanceCache && now - cacheTimestamp < CACHE_DURATION) {
          processStaffData(attendanceCache);
          isFetching.current = false;
          return;
        }

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        const attendanceRef = collection(db, "attendance");
        const q = query(
          attendanceRef,
          where("date", ">=", new Date(todayString)),
          where("working", "==", true),
          limit(100)
        );

        const querySnapshot = await getDocs(q);
        const staffList: AttendanceRecord[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          staffList.push({
            id: docSnap.id,
            TimeIn: data.TimeIn || Timestamp.now(),
            TimeOut: data.TimeOut || null,
            classification: data.classification || "",
            date: data.date || Timestamp.now(),
            fullName: data.fullName || "",
            rfid: data.rfid || "",
            staffId: data.staffId || "",
            working: data.working || false,
          });
        });

        attendanceCache = staffList;
        cacheTimestamp = now;

        processStaffData(staffList);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching attendance:", error);
        if (attendanceCache) processStaffData(attendanceCache);
      } finally {
        isFetching.current = false;
      }
    };

    const processStaffData = (staffList: AttendanceRecord[]) => {
      setStaff(staffList);

      const currentTime = new Date();
      const onDuty = staffList.filter((s) => {
        const timeIn = s.TimeIn.toDate();
        const timeOut = s.TimeOut ? s.TimeOut.toDate() : null;

        if (!timeOut) return true;
        return currentTime >= timeIn && currentTime <= timeOut;
      }).length;

      setOnDutyCount(onDuty);
      setOffDutyCount(staffList.length - onDuty);
    };

    fetchStaff();

    const interval = setInterval(fetchStaff, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStaffStatus = (staff: AttendanceRecord): string => {
    const currentTime = new Date();
    const timeIn = staff.TimeIn.toDate();
    const timeOut = staff.TimeOut ? staff.TimeOut.toDate() : null;

    if (!timeOut) return "present";
    return currentTime >= timeIn && currentTime <= timeOut ? "present" : "off";
  };

  const getShiftTime = (staff: AttendanceRecord): string => {
    const timeIn = staff.TimeIn.toDate();
    const timeOut = staff.TimeOut ? staff.TimeOut.toDate() : null;

    const formatTime = (date: Date) =>
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    return timeOut
      ? `${formatTime(timeIn)} - ${formatTime(timeOut)}`
      : `${formatTime(timeIn)} - Present`;
  };

  return (
  <div className="min-h-screen bg-[#F9F6EE] px-4 py-6">
    
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Currently On Duty</p>
          <p className="text-3xl font-semibold text-gray-900">{onDutyCount}</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Off Duty</p>
          <p className="text-3xl font-semibold text-gray-900">{offDutyCount}</p>
        </div>
        <div className="p-3 bg-red-100 rounded-lg">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        </div>
      </div>
    </div>

    {/* Staff Table */}
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Staff Members</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b">
        <div>Staff</div>
        <div>Classification</div>
        <div>Shift</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      {/* No Staff */}
      {staff.length === 0 && (
        <div className="py-10 text-center text-gray-500">No active staff</div>
      )}

      {/* Staff Rows */}
      {staff.map((s) => {
        const status = getStaffStatus(s);
        const shiftTime = getShiftTime(s);

        return (
          <div
            key={s.id}
            className="grid grid-cols-5 items-center px-6 py-4 border-b hover:bg-gray-50 transition"
          >
            {/* Staff Column */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {s.fullName
                    ? s.fullName
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                    : "?"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{s.fullName}</span>
            </div>

            {/* Classification */}
            <div className="text-sm text-gray-700">{s.classification}</div>

            {/* Shift */}
            <div className="text-sm text-gray-600">{shiftTime}</div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  status === "present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status === "present" ? "On Duty" : "Off"}
              </span>
            </div>

            {/* Actions placeholder (like screenshot) */}
            <div className="text-right text-gray-400 text-sm">•••</div>
          </div>
        );
      })}
    </div>
  </div>
);

};

export default OnDutyStaffPage;
