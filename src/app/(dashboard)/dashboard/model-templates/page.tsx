export default function ModelTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">3D Model Templates</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Upload New Model
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Manage 3D models (.glb files) that users can use to decorate their rooms.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Office Chair",
              type: "chair",
              fileName: "table.glb",
              dimensions: "0.6' × 1.2' × 0.6'",
              fileSize: "2.3 MB",
              uploadDate: "2 days ago",
              status: "Active",
              downloads: 45,
              isWallMounted: false
            },
            {
              name: "Dining Table",
              type: "table",
              fileName: "table2.glb",
              dimensions: "1.5' × 0.8' × 0.8'",
              fileSize: "3.1 MB",
              uploadDate: "1 week ago",
              status: "Active",
              downloads: 32,
              isWallMounted: false
            },
            {
              name: "Plant Decoration",
              type: "decoration",
              fileName: "plant.glb",
              dimensions: "0.4' × 1.0' × 0.4'",
              fileSize: "1.8 MB",
              uploadDate: "3 days ago",
              status: "Active",
              downloads: 28,
              isWallMounted: false
            },
            {
              name: "Wall TV",
              type: "tv",
              fileName: "tv.glb",
              dimensions: "1.2' × 0.7' × 0.1'",
              fileSize: "2.7 MB",
              uploadDate: "5 days ago",
              status: "Active",
              downloads: 67,
              isWallMounted: true
            },
            {
              name: "Apartment Interior",
              type: "room",
              fileName: "appt.glb",
              dimensions: "10' × 10' × 3'",
              fileSize: "15.2 MB",
              uploadDate: "1 day ago",
              status: "Draft",
              downloads: 12,
              isWallMounted: false
            },
            {
              name: "House Interior",
              type: "room",
              fileName: "house interiors.glb",
              dimensions: "12' × 15' × 3'",
              fileSize: "18.5 MB",
              uploadDate: "1 week ago",
              status: "Active",
              downloads: 89,
              isWallMounted: false
            },
          ].map((model, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {model.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>📁 {model.fileName}</span>
                  <span className="font-medium">{model.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>📏 {model.dimensions}</span>
                  <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{model.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>📅 {model.uploadDate}</span>
                  <span>⬇️ {model.downloads} downloads</span>
                </div>
                {model.isWallMounted && (
                  <div className="flex items-center gap-1">
                    <span className="text-purple-600">🖼️ Wall Mountable</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200">
                  Preview
                </button>
                <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-200">
                  Edit
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