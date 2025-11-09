import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader, MapPin, Star } from 'lucide-react'
import { ToastContainer, toast,  Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
function HotelDetails() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hotelsId } = useParams();

    useEffect(() => {
        fetchHotels();
    }, [hotelsId]); 

    const fetchHotels = async () => {
        try {
          console.log(hotelsId)
            const response = await fetch(`${API_URL}/hotels/${hotelsId}/hotel`);
            if (!response.ok) {
                throw new Error('Failed to fetch hotels');
            }
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      toast.error("Error fetching hotels");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Hotels in this Location</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img 
                src={hotel.image || `,${hotel.name}`} 
                alt={hotel.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{hotel.name}</h2>
                <div className="flex items-center mb-2 text-gray-600">
                  <MapPin className="mr-2" size={18} />
                  <p>{hotel.address}</p>
                </div>
                <div className="flex items-center mb-4 text-yellow-500">
                  <Star className="mr-2" size={18} />
                  <p>{hotel.ratings} / 5</p>
                </div>
                <p href={hotel.url} className="text-gray-600 mb-4"></p> 
                <a 
                  href={hotel.url} target="_blank"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelDetails
