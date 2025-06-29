import { useLoaderData } from "react-router";
import { useState } from "react";
import CoverageMap from "./CoverageMap";
import { FiSearch } from 'react-icons/fi';

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const [searchInput, setSearchInput] = useState("");
  const [targetCoords, setTargetCoords] = useState(null);

  const handleSearch = () => {
    const match = serviceCenters.find((d) =>
      d.district.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (match) {
      setTargetCoords([match.latitude, match.longitude]);
    } else {
      alert("District not found!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-5xl font-extrabold text-center mb-6 text-[#03373D]">
        We are available in 64 districts
      </h2>

      {/* 🔍 Search Box */}
      <div className="max-w-xl mx-auto my-12">
        <div className="flex gap-2 items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here"
              className="px-8 py-4 w-full pl-10 border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              size={20}
            />
          </div>
          <button
            className="-ml-20 z-10 px-8 py-4 cursor-pointer text-xl font-bold bg-[#CAEB66] rounded-[50px]"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* 🗺️ Map Section */}
      <CoverageMap serviceCenters={serviceCenters} targetCoords={targetCoords} />
    </div>
  );
};

export default Coverage;