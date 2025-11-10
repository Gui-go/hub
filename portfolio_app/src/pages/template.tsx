const GeoMapTemplate: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Template Title</h1>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Section Heading 1</h3>
            <p className="text-gray-600 mb-6">
              This is a sample paragraph that gives a general overview or context. You can replace this with dynamic content or markdown-rendered text.
            </p>

            <div className="w-full flex justify-center mb-8 relative">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm w-full overflow-auto">
                <svg className="w-full h-auto">
                  {/* D3 or other custom rendering will go here */}
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Section Heading 2</h3>
            <p className="text-gray-600 mb-6">
              Use this area to explain insights or include follow-up visuals. Supports rich formatting and dynamic insertion.
            </p>

            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Section Heading 3</h3>
            <p className="text-gray-600 mb-6">
              You can break content into sections and consistently apply styling. Great for storytelling or data breakdowns.
            </p>

            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Section Heading 4</h3>
            <p className="text-gray-600 mb-6">
              Add more context here, whether it's a conclusion, related info, or just more structured narrative.
            </p>

            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Final Notes</h3>
            <p className="text-gray-600">
              Closing paragraph or footnotes. You can embed components or interactive widgets here if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoMapTemplate;
