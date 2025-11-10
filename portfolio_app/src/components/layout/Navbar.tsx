'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  // { id: 'home', label: 'Home', path: '/' },
  { id: 'tools', label: 'Tools', path: '/tools' },
  { id: 'agents', label: 'Agents', path: '/agents' },
  { id: 'publications', label: 'Publications', path: '/publications' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'geolayers', label: 'GeoLayers', path: '/geolayers' },
  { id: 'stories', label: 'Stories', path: '/stories' },
  { id: 'blogs', label: 'Blogs', path: '/blogs' },
  { id: 'about', label: 'About', path: '/about' }
];

export default function Navbar({ title = "Guigo.dev.br" }: { title?: string }) {

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !document.querySelector('nav')?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/">{title}</Link>
        </h1>

        <button
          className="xl:hidden hamburger flex flex-col justify-center items-center w-8 h-8 space-y-1.5 p-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        <ul
          className={`${isOpen ? 'flex' : 'hidden'
            } xl:flex flex-col xl:flex-row xl:space-x-4 fixed xl:static top-14 xs:top-16 left-0 w-full xl:w-auto h-[calc(100vh-56px)] xs:h-[calc(100vh-64px)] xl:h-auto bg-blue-800 xl:bg-transparent px-4 py-4 xs:py-6 xl:py-0 transition-all duration-300 ease-in-out z-40 transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            } xl:transform-none xl:opacity-100 overflow-y-auto xl:overflow-visible`}
        >
          {menuItems.map((item) => (
            <li key={item.id} className="mb-3 xs:mb-4 xl:mb-0">
              <Link
                href={item.path}
                className={`block px-2 py-1 text-2xl xs:text-2xl md:text-xl font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.path
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

