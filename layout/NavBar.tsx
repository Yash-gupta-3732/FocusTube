"use client";

import { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function Navbar({ onSearch, initialQuery = "" }: NavbarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="text-white font-semibold text-lg shrink-0">
          FocusTube
        </div>

        {/* Search */}
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search YouTube videos..."
            className="flex-1 rounded-md bg-neutral-900 border border-neutral-700 px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}
