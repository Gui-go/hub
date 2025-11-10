// 'use client';
import content from '../../../../public/content.json';

export default function About() {
  
  const aboutContent = content.about;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl animate-fade-in">
        <div className="relative py-8 flex justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutContent.backgroundImage})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-10"></div>
          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={aboutContent.profileImage}
              alt="Profile picture"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'top center' }}
            />
          </div>
        </div>
        <div className="p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            {aboutContent.title}
          </h1>
          <p className="text-center text-blue-600 font-medium text-lg sm:text-xl mb-8">
            {aboutContent.tagline}
          </p>
          <div className="mb-10 bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
              {aboutContent.description}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {aboutContent.stats?.map((stat: any, index: number) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          {aboutContent.skills && (
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Technical Toolkit
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {aboutContent.skills.map((skill: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    {skill.icon && (
                      <span className="text-blue-500 mr-2 text-lg">{skill.icon}</span>
                    )}
                    <span className="text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {aboutContent.sections?.map((section: any, index: number) => (
            <div key={index} className="mb-10 last:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-6 h-1 bg-blue-500 rounded-full mr-3"></span>
                {section.title}
              </h3>
              {section.type === 'timeline' ? (
                <div className="space-y-6 pl-8 border-l-2 border-blue-100">
                  {section.items.map((item: any, idx: number) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute left-0 -ml-3.5 top-1 w-6 h-6 bg-blue-100 border-4 border-white rounded-full"></div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        {item.date && (
                          <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                        )}
                        {item.desc1 && <p className="text-gray-700">{item.desc1}</p>}
                        {item.desc2 && <p className="text-gray-700">{item.desc2}</p>}
                        {item.desc3 && <p className="text-gray-700">{item.desc3}</p>}
                        {item.desc4 && <p className="text-gray-700">{item.desc4}</p>}
                        {item.tech && (
                          <p className="text-gray-700 font-mono mt-2">{item.tech}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : section.items ? (
                <ul className="space-y-4 pl-5">
                  {section.items.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="relative pl-6 text-gray-700 text-base sm:text-lg"
                    >
                      <span className="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">{section.content}</p>
                </div>
              )}
            </div>
          ))}

          {/* Contact Links */}
          {aboutContent.links && aboutContent.links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Let's Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {aboutContent.links.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center shadow hover:shadow-md"
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
