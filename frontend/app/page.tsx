import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
          Water Tank Management System
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          This system helps monitor and manage water tanks efficiently. 
          It provides tools to track water levels, usage, and ensures 
          proper distribution and maintenance.
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Water Level Monitoring</h3>
            <p className="text-sm text-gray-600">
              Track real-time water levels in tanks.
            </p>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Usage Tracking</h3>
            <p className="text-sm text-gray-600">
              Monitor daily water consumption.
            </p>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Alerts & Notifications</h3>
            <p className="text-sm text-gray-600">
              Get alerts when water levels are low or high.
            </p>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">System Reports</h3>
            <p className="text-sm text-gray-600">
              Generate reports for better management.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Developed by Zahra & Aqsa
          </h2>
          <p className="text-gray-500 text-sm">
            Water Tank Management System Project
          </p>
        </div>

      </div>
    </div>
  );
};

export default Page;