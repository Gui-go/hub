import { useRouter } from 'next/router';
import Image from 'next/image';
import content from '../../../../public/content.json';


  
export default function GeoLayersPage() {

    const router = useRouter();
    const geolayersContent = content.geolayers;
    
  return (
    <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <Image
            src={geolayersContent?.image}
            alt={`${geolayersContent?.title} banner`}
            width={1920}
            height={400}
            className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <h2 className="absolute bottom-4 left-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {geolayersContent?.title}
          </h2>
        </div>
        <div className="p-6 xs:p-8 sm:p-10 md:p-12">
          <p className="text-gray-600 text-base xs:text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 xs:mb-8 sm:mb-10">
            {geolayersContent?.description}
          </p>
          <h3 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">Recent layers</h3>
          {geolayersContent?.layers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {geolayersContent?.layers.map((layer) => (
                <div
                  key={layer.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
                  onClick={() => router.push(layer.path)}
                >
                  <Image
                    src={layer.image}
                    alt={`${layer.title} thumbnail`}
                    width={500}
                    height={300}
                    className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-700 mb-2">{layer.title}</h4>
                  {/* Uncomment if you want to show a date */}
                  {/* <p className="text-gray-500 text-sm xs:text-base sm:text-lg mb-2">{layer.date}</p> */}
                  <p className="text-gray-600 text-sm xs:text-base sm:text-lg mb-4">
                    {layer.excerpt.length > 100 ? `${layer.excerpt.slice(0, 100)}...` : layer.excerpt}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-base xs:text-lg sm:text-xl">No blog layers available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
