export default function ProductListingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Listing</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Product
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">This is the product listing demo page.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-32 rounded mb-3"></div>
              <h3 className="font-semibold">Product {item}</h3>
              <p className="text-gray-600 text-sm">Sample product description</p>
              <p className="text-blue-600 font-bold mt-2">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}