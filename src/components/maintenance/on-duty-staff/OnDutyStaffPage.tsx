import React, { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";


interface StaffSchedule {
  id: string;
  classification: string;
  createdAt: unknown; 
  day: string;
  email: string;
  phoneNumber: string;
  shift: string;
  shiftTime: string;
  staffId: string;
  staffName: string;
  staffRef: unknown; 
  status: string;
  week: number;
  year: number;
}

const OnDutyStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffSchedule[]>([]);
  const [onDutyCount, setOnDutyCount] = useState(0);
  const [onBreakCount, setOnBreakCount] = useState(0);
  const [offDutyCount, setOffDutyCount] = useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const today = new Date();
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

        
        const schedulesRef = collection(db, "staff_schedules");
        const q = query(
          schedulesRef,
          where("day", "==", dayName)
        );

        const querySnapshot = await getDocs(q);
        const staffList: StaffSchedule[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          staffList.push({ 
            id: docSnap.id,
            classification: data.classification || "",
            createdAt: data.createdAt || "",
            day: data.day || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            shift: data.shift || "",
            shiftTime: data.shiftTime || "",
            staffId: data.staffId || "",
            staffName: data.staffName || "",
            staffRef: data.staffRef || null,
            status: data.status || "off",
            week: data.week || 0,
            year: data.year || 0
          });
        });

        setStaff(staffList);

        
        setOnDutyCount(staffList.filter((s) => s.status === "scheduled" || s.status === "present").length);
        setOnBreakCount(staffList.filter((s) => s.status === "break").length);
        setOffDutyCount(staffList.filter((s) => s.status === "absent" || s.status === "off").length);

      } catch (error) {
        console.error("Error fetching staff schedules:", error);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currently On Duty</p>
                <p className="text-2xl font-bold text-gray-900">{onDutyCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Break</p>
                <p className="text-2xl font-bold text-gray-900">{onBreakCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Off Duty</p>
                <p className="text-2xl font-bold text-gray-900">{offDutyCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Active Staff Members</h2>
          </div>

          <div className="p-6 space-y-4">
            {staff.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                
                {/* Avatar + name */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {s.staffName ? s.staffName.split(" ").map((w: string) => w[0]).join("") : "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.staffName}</p>
                    <p className="text-sm text-gray-500">{s.classification}</p>
                    <p className="text-xs text-gray-400">{s.shiftTime}</p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    s.status === "present" || s.status === "scheduled"
                      ? "bg-green-100 text-green-800"
                      : s.status === "break"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {s.status === "scheduled" ? "on duty" : s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OnDutyStaffPage;
