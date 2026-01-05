export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Lead
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Manage your leads and send email templates.</p>

        
        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Project Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Smith", email: "john@company.com", company: "Tech Corp", projectType: "Interior Design", status: "New", source: "Website" },
                { name: "Sarah Johnson", email: "sarah@startup.io", company: "Startup Inc", projectType: "Office Design", status: "Qualified", source: "LinkedIn" },
                { name: "Mike Davis", email: "mike@business.com", company: "Business LLC", projectType: "Home Renovation", status: "In Progress", source: "Referral" },
                { name: "Lisa Wilson", email: "lisa@enterprise.com", company: "Enterprise Co", projectType: "Architecture", status: "Proposal Sent", source: "Google Ads" },
                { name: "David Brown", email: "david@agency.com", company: "Creative Agency", projectType: "Consultation", status: "New", source: "Social Media" },
              ].map((lead, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-blue-600">{lead.email}</td>
                  <td className="py-3 px-4">{lead.company}</td>
                  <td className="py-3 px-4">{lead.projectType}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Proposal Sent' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{lead.source}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                      <div className="relative group">
                        <button className="text-purple-600 hover:text-purple-800 text-sm">Email</button>
                        {/* Email Template Dropdown */}
                        <div className="absolute right-0 top-6 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                          <div className="p-2">
                            <div className="text-xs text-gray-500 mb-2">Select Email Template:</div>
                            {[
                              "Welcome Email",
                              "Follow-up Email",
                              "Quote Request",
                              "Thank You Email",
                              "Project Update"
                            ].map((template, idx) => (
                              <button
                                key={idx}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                // onClick={() => console.log(`Send ${template} to ${lead.email}`)}
                              >
                                {template}
                              </button>
                            ))}
                            <hr className="my-2" />
                            <button className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                              + Create New Template
                            </button>
                          </div>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}