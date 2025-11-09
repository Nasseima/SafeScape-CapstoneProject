import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Search, Filter, SortAsc, SortDesc, Loader, Coffee, Wifi, Car, Dumbbell } from 'lucide-react';
import { ToastContainer, toast,  Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_URL}/hotels/all");
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        toast.error("Error displaying hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const filtered = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredHotels(sorted);
  }, [searchTerm, sortBy, sortOrder, hotels]);

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
       <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" 
        transition={Bounce} 
      />
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Discover Your Perfect Stay</h1>
      
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Name</option>
            <option value="ratings">Rating</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-full bg-white shadow-md hover:bg-indigo-100 transition-colors duration-200"
          >
            {sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
          </button>
        </div>
      </div>

  
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-indigo-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.name}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`${hotel.image}`}
                alt={hotel.name}
                className="w-full h-49 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <div className="flex items-center mb-2">
                  <MapPin className="text-gray-500 mr-1" size={16} />
                  <p className="text-gray-600 text-sm">{hotel.address}</p>
                </div>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <p className="text-gray-700">{hotel.ratings.toFixed(1)}/5</p>
                </div>
                <a
                  href={hotel.url} target="_blank"
                  className="inline-block bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredHotels.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-8">No hotels found matching your criteria.</p>
      )}
    </div>
  );
};

export default HotelsPage;
