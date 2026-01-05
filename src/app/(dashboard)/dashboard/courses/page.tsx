export default function CourseListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Course List</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Create New Course
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">This is the course list demo page.</p>
        
        <div className="space-y-4">
          {[
            {
              title: "React Fundamentals",
              description: "Learn the basics of React development",
              duration: "8 weeks",
              students: 45,
              status: "Active"
            },
            {
              title: "Advanced JavaScript",
              description: "Deep dive into JavaScript concepts",
              duration: "6 weeks",
              students: 32,
              status: "Active"
            },
            {
              title: "Node.js Backend Development",
              description: "Build scalable backend applications",
              duration: "10 weeks",
              students: 28,
              status: "Draft"
            },
            {
              title: "UI/UX Design Principles",
              description: "Master the art of user experience design",
              duration: "12 weeks",
              students: 67,
              status: "Active"
            },
            {
              title: "Database Design & Management",
              description: "Learn database concepts and SQL",
              duration: "8 weeks",
              students: 23,
              status: "Completed"
            },
          ].map((course, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-gray-600 mt-1">{course.description}</p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>📅 {course.duration}</span>
                    <span>👥 {course.students} students</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Active' ? 'bg-green-100 text-green-800' :
                    course.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}