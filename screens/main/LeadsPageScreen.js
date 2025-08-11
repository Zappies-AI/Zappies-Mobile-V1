import React, { useState } from 'react';
import { SearchIcon, EyeIcon, Trash2Icon } from 'lucide-react';

const leadsData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'New', source: 'Website Chat', date: '2023-10-27' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Contacted', source: 'Social Media', date: '2023-10-26' },
  { id: 3, name: 'Peter Jones', email: 'peter.j@example.com', status: 'Qualified', source: 'Referral', date: '2023-10-25' },
  { id: 4, name: 'Mary Williams', email: 'mary.w@example.com', status: 'New', source: 'Website Chat', date: '2023-10-25' },
  { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', status: 'Contacted', source: 'Website Chat', date: '2023-10-24' },
];

const LeadsPageScreen = () => {
  const [leads, setLeads] = useState(leadsData);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (leadId) => {
    // Logic to view a specific lead
    alert(`Viewing lead with ID: ${leadId}`);
  };

  const handleDelete = (leadId) => {
    // Logic to delete a specific lead
    if (confirm(`Are you sure you want to delete lead with ID: ${leadId}?`)) {
      setLeads(leads.filter(lead => lead.id !== leadId));
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lead.status === 'New' ? 'bg-indigo-100 text-indigo-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleView(lead.id)}
                      className="text-indigo-600 hover:text-indigo-900 mx-2"
                    >
                      <EyeIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-600 hover:text-red-900 mx-2"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPageScreen;
