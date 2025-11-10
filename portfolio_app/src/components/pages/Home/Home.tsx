// 'use client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import content from '../../../../public/content.json';

export default function Home() {
  
  const router = useRouter();
  const homeContent = content.home;
  console.log("You are not allowed to check this console, go check your mama's console!!");

  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div
        className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-[40vh] xs:h-[45vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${homeContent.image})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center text-white p-3 xs:p-4 sm:p-6 md:p-8 animate-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            {homeContent.title}
          </h2>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            {homeContent.version}
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-xl xs:max-w-2xl mx-auto">
            {homeContent.description}
          </p>
        </div>
      </div>

      <br />
      <div className="flex flex-col justify-center items-center gap-3 xs:gap-4 sm:gap-5">
        {homeContent.cta?.map((button: any, index: number) => (
          <button
            key={index}
            onClick={() => router.push(button.path)}
            className="w-full min-w-[100px] sm:min-w-[120px] px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95 text-sm sm:text-base font-medium text-center shadow-sm"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
