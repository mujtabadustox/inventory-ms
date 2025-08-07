import React from "react";

export function Reports() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Generate insights and analyze your business performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Sales Report",
              icon: "📈",
              description: "Monthly sales performance",
              status: "Available",
            },
            {
              name: "Inventory Report",
              icon: "📦",
              description: "Stock levels and turnover",
              status: "Available",
            },
            {
              name: "Customer Report",
              icon: "👥",
              description: "Customer behavior analysis",
              status: "Available",
            },
            {
              name: "Financial Report",
              icon: "💰",
              description: "Revenue and profit analysis",
              status: "Available",
            },
          ].map((report, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{report.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {report.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-lg text-sm font-medium">
                Generate Report
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Reports
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  name: "Sales Report - January 2024",
                  type: "PDF",
                  size: "2.3 MB",
                  date: "2024-01-15",
                },
                {
                  name: "Inventory Report - December 2023",
                  type: "Excel",
                  size: "1.8 MB",
                  date: "2024-01-01",
                },
                {
                  name: "Customer Analysis - Q4 2023",
                  type: "PDF",
                  size: "3.1 MB",
                  date: "2023-12-31",
                },
                {
                  name: "Financial Summary - 2023",
                  type: "PDF",
                  size: "4.2 MB",
                  date: "2023-12-30",
                },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {report.type}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {report.size} • {report.date}
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
