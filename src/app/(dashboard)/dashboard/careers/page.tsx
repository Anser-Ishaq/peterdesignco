export default function CareersListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Career
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Careers Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Job Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Department
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Experience
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Salary Range
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Apply By
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title: "Interior Designer",
                  department: "Design",
                  location: "Lahore, Pakistan",
                  type: "Full Time",
                  experience: "Mid Level",
                  salaryRange: "80K - 120K PKR",
                  status: "Active",
                  applyBy: "Jan 15, 2026",
                  workMode: "Onsite",
                },
                {
                  title: "Senior Interior Designer",
                  department: "Design",
                  location: "Lahore, Pakistan",
                  type: "Full Time",
                  experience: "Senior Level",
                  salaryRange: "150K - 220K PKR",
                  status: "Active",
                  applyBy: "Jan 20, 2026",
                  workMode: "Hybrid",
                },
                {
                  title: "Project Manager",
                  department: "Operations",
                  location: "Lahore, Pakistan",
                  type: "Full Time",
                  experience: "Senior Level",
                  salaryRange: "120K - 180K PKR",
                  status: "Draft",
                  applyBy: "Feb 01, 2026",
                  workMode: "Onsite",
                },
                {
                  title: "Junior Architect",
                  department: "Architecture",
                  location: "Lahore, Pakistan",
                  type: "Full Time",
                  experience: "Entry Level",
                  salaryRange: "60K - 90K PKR",
                  status: "Active",
                  applyBy: "Jan 30, 2026",
                  workMode: "Onsite",
                },
                {
                  title: "Marketing Specialist",
                  department: "Marketing",
                  location: "Lahore, Pakistan",
                  type: "Part Time",
                  experience: "Mid Level",
                  salaryRange: "50K - 80K PKR",
                  status: "Expired",
                  applyBy: "Dec 31, 2025",
                  workMode: "Remote",
                },
              ].map((career, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{career.title}</div>
                      <div className="text-sm text-gray-500">
                        {career.workMode}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{career.department}</td>
                  <td className="py-3 px-4 text-sm">{career.location}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {career.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{career.experience}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {career.salaryRange}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        career.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : career.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {career.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{career.applyBy}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Delete
                      </button>
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
