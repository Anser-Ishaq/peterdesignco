export default function TeamListingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Team Listing</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add Team Member
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">This is the team listing demo page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "John Doe", role: "Frontend Developer", email: "john@example.com" },
            { name: "Jane Smith", role: "Backend Developer", email: "jane@example.com" },
            { name: "Mike Johnson", role: "UI/UX Designer", email: "mike@example.com" },
            { name: "Sarah Wilson", role: "Project Manager", email: "sarah@example.com" },
            { name: "David Brown", role: "DevOps Engineer", email: "david@example.com" },
            { name: "Lisa Davis", role: "QA Engineer", email: "lisa@example.com" },
          ].map((member, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-center">{member.name}</h3>
              <p className="text-blue-600 text-sm text-center">{member.role}</p>
              <p className="text-gray-600 text-sm text-center mt-2">{member.email}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-700 py-1 px-3 rounded text-sm hover:bg-blue-200">
                  Edit
                </button>
                <button className="flex-1 bg-red-100 text-red-700 py-1 px-3 rounded text-sm hover:bg-red-200">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}