import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Jan', 'New Leads': 400, 'Total Conversions': 240 },
  { name: 'Feb', 'New Leads': 300, 'Total Conversions': 139 },
  { name: 'Mar', 'New Leads': 200, 'Total Conversions': 980 },
  { name: 'Apr', 'New Leads': 278, 'Total Conversions': 390 },
  { name: 'May', 'New Leads': 189, 'Total Conversions': 480 },
  { name: 'Jun', 'New Leads': 239, 'Total Conversions': 380 },
  { name: 'Jul', 'New Leads': 349, 'Total Conversions': 430 },
];

const App = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Leads and Conversions Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lead Generation & Conversion Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                itemStyle={{ color: '#4b5563' }}
              />
              <Legend />
              <Line type="monotone" dataKey="New Leads" stroke="#4f46e5" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="Total Conversions" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                itemStyle={{ color: '#4b5563' }}
              />
              <Legend />
              <Bar dataKey="New Leads" fill="#4f46e5" />
              <Bar dataKey="Total Conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default App;
