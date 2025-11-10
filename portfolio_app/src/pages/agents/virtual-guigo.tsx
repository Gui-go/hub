'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface GenSearchWidgetProps extends React.HTMLAttributes<HTMLElement> {
  configId?: string;
  triggerId?: string;
}

const GenSearchWidget: React.FC<GenSearchWidgetProps> = (props) => {
  return React.createElement('gen-search-widget', props);
};

interface Agent {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  textH1: string;
  textP1: string;
  textSearchbar: string;
  textH2: string;
  textQ1: string;
  textQ2: string;
  textQ3: string;
  textQ4: string;
  textBack: string;
}

interface Content {
  aiagents: Agent[];
}

const AgVirtualGuigo = () => {
  const router = useRouter();
  const [pageData, setPageData] = useState<Agent | null>(null);

  const virtualguigo_configId = process.env.NEXT_PUBLIC_VIRTUALGUIGO_CONFIG_ID;


useEffect(() => {
  fetch('/content.json')
    .then(res => res.json())
    .then((data) => {
      const agentList = data.aiagents?.agents;
      const agent = agentList?.find((a: Agent) => a.id === 'virtual-guigo');
      setPageData(agent || null);
    })
    .catch(err => {
      console.error("Failed to load content.json:", err);
    });
}, []);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cloud.google.com/ai/gen-app-builder/client?hl=en_US";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const setSearchValue = (value: string) => {
    const input = document.getElementById('searchWidgetTrigger') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  };

  if (!pageData) return <p className="text-center p-4">Loading...</p>;

  return (
        <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                    <img
                        src={pageData?.image}
                        // alt={${pageData?.title} banner}
                        className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <h2 className="absolute bottom-4 left-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        {pageData?.title}
                    </h2>
                </div>
                <div className="p-4 xs:p-5 sm:p-6 md:p-8">
                    <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                        {pageData?.excerpt}
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                            {pageData?.textH1}
                        </h3>
                        <p className="text-gray-600 text-xs xs:text-sm sm:text-base mb-4">
                            {pageData?.textP1}
                        </p>
                        
                        <div className="space-y-4">
                            <GenSearchWidget
                                configId={virtualguigo_configId}
                                triggerId="searchWidgetTrigger"
                            />
                            <input
                                id="searchWidgetTrigger"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={pageData?.textSearchbar}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                            {pageData?.textH2}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                                onClick={() => setSearchValue(pageData?.textQ1)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                {pageData?.textQ1}
                            </button>
                            <button 
                                onClick={() => setSearchValue(pageData?.textQ2)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                {pageData?.textQ2}
                            </button>
                            <button 
                                onClick={() => setSearchValue(pageData?.textQ3)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                {pageData?.textQ3}
                            </button>
                            <button 
                                onClick={() => setSearchValue(pageData?.textQ4)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                {pageData?.textQ4}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/agents')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm xs:text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {pageData?.textBack}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AgVirtualGuigo;
