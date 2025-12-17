import React from 'react';

export default function Pagination({ links }) {
  if (!links || !Array.isArray(links)) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center">
      <ul className="inline-flex -space-x-px">
        {links.map((link, idx) => {
          const label = link.label?.replace(/&laquo;|&raquo;/g, (m) => (m === '&laquo;' ? '«' : '»')) || '';
          if (!link.url) {
            return (
              <li key={idx}>
                <span className={`px-3 py-1 block ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-500'}`} dangerouslySetInnerHTML={{ __html: label }} />
              </li>
            );
          }

          return (
            <li key={idx}>
              <a
                href={link.url}
                className={`px-3 py-1 block hover:bg-indigo-50 border border-transparent ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
