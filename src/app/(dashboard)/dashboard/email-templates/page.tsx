export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Email Message Templates</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Create New Template
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">This is the email message templates demo page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Welcome Email",
              subject: "Welcome to our platform!",
              type: "Onboarding",
              lastModified: "2 days ago",
              status: "Active"
            },
            {
              name: "Password Reset",
              subject: "Reset your password",
              type: "Security",
              lastModified: "1 week ago",
              status: "Active"
            },
            {
              name: "Course Completion",
              subject: "Congratulations on completing the course!",
              type: "Achievement",
              lastModified: "3 days ago",
              status: "Active"
            },
            {
              name: "Lead Follow-up",
              subject: "Following up on your inquiry",
              type: "Sales",
              lastModified: "5 days ago",
              status: "Draft"
            },
            {
              name: "Newsletter",
              subject: "Monthly Newsletter - {month}",
              type: "Marketing",
              lastModified: "1 day ago",
              status: "Active"
            },
            {
              name: "Payment Confirmation",
              subject: "Payment received - Thank you!",
              type: "Transaction",
              lastModified: "1 week ago",
              status: "Active"
            },
          ].map((template, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {template.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">
                <strong>Subject:</strong> {template.subject}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">{template.type}</span>
                <span>{template.lastModified}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200">
                  Edit
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200">
                  Preview
                </button>
                <button className="bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}