
import React, { useState, useEffect, useCallback } from "react"
import { Link } from 'react-router-dom';
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { MapPin, Search, X, Filter, Sparkles, Image, Info, Hotel, Activity, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { ToastContainer, toast,  Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export default function PlacesPage() {
  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    city: [],
    country: []
  })
  const [favorites, setFavorites] = useState([])
  const [userId, setUserId] = useState(null)
  const storedUserId = localStorage.getItem('user_id')
  useEffect(() => {
    fetchPlaces()
    if (storedUserId) {
      setUserId(storedUserId)
      loadFavorites(storedUserId)
    }
  }, [])

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_URL}/places/all')
      if (!response.ok) {
        throw new Error('Failed to fetch places')
      }
      const data = await response.json()
      setPlaces(data)
      setFilteredPlaces(data)
    } catch (error) {
      console.error('Error fetching places:', error)
      toast.error('Failed to fetch places')
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavorites = (userId) => {
    const storedFavorites = localStorage.getItem(`favorites_${userId}`)
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }

  const toggleFavorite = (place) => {
    if (!userId) {
      toast.error('Please log in to manage favorites')
      return
    }
    let updatedFavorites
    if (favorites.some(fav => fav.id === place.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== place.id)
      toast.success(`Removed ${place.city} from favorites`)
    } else {
      updatedFavorites = [...favorites, place]
      toast.success(`Added ${place.city} to favorites`)
    }
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
  }

  const handleSearch = useCallback(() => {
    const filtered = places.filter((place) => {
      const matchesSearch = 
        place.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.country.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilters = 
        (selectedFilters.city.length === 0 || selectedFilters.city.includes(place.city)) &&
        (selectedFilters.country.length === 0 || selectedFilters.country.includes(place.country))

      return matchesSearch && matchesFilters
    })
    setFilteredPlaces(filtered)
  }, [places, searchTerm, selectedFilters])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const toggleFilter = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev }
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter(item => item !== value)
      } else {
        newFilters[type] = [...newFilters[type], value]
      }
      return newFilters
    })
  }

  const clearFilters = () => {
    setSelectedFilters({ city: [], country: [] })
    setSearchTerm("")
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  const uniqueCities = [...new Set(places.map(place => place.city))]
  const uniqueCountries = [...new Set(places.map(place => place.country))]

  return (
    <div className="container mx-auto px-4 py-8 relative">
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/20 to-transparent -z-10"
      />
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl font-bold mb-8 text-center relative"
      >
        Discover Amazing Places
        <Sparkles className="absolute -top-6 -right-6 text-primary w-12 h-12" />
      </motion.h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="Search by city or country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Cities</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCities.map(city => (
                      <Button
                        key={city}
                        size="sm"
                        variant={selectedFilters.city.includes(city) ? "default" : "outline"}
                        onClick={() => toggleFilter('city', city)}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCountries.map(country => (
                      <Button
                        key={country}
                        size="sm"
                        variant={selectedFilters.country.includes(country) ? "default" : "outline"}
                        onClick={() => toggleFilter('country', country)}
                      >
                        {country}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {(selectedFilters.city.length > 0 || selectedFilters.country.length > 0 || searchTerm) && (
          <Button onClick={clearFilters} variant="outline" className="self-start">
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {filteredPlaces.length === 0 ? (
        <p className="text-center text-lg">No places found. Please try different search criteria.</p>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <Tabs defaultValue="image" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-t-lg">
                    <TabsTrigger 
                      value="image"
                      className="data-[state=active]:bg-background rounded-md transition-all duration-200 flex items-center justify-center py-2"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger 
                      value="info"
                      className="data-[state=active]:bg-background rounded-md transition-all duration-200 flex items-center justify-center py-2"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Info
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="image" className="m-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={place.url}
                        alt={`${place.city}, ${place.country}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <p className="absolute bottom-2 left-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {place.city}, {place.country}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="info" className="m-0 bg-background">
                    <CardContent className="p-4">
                      <h2 className="text-2xl font-bold mb-2">{place.city}</h2>
                      <p className="text-muted-foreground mb-4">{place.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="mr-1 h-4 w-4" />
                        {place.city}, {place.country}
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/hotels/${place.id}/hotels`}>
                          <Button variant="outline" className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200">
                            <Hotel className="mr-2 h-4 w-4" />
                            Hotels
                          </Button>
                        </Link>
                        <Link to={`/activities/${place.id}/activities`}>
                          <Button variant="outline" className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200">
                            <Activity className="mr-2 h-4 w-4" />
                            Activities
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className={`flex-1 ${
                            favorites.some(item => item.id === place.id)
                              ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                          onClick={() => toggleFavorite(place)}
                        >
                          <Heart className={`mr-2 h-4 w-4 ${favorites.some(item => item.id === place.id) ? 'fill-current' : ''}`} />
                          {favorites.some(item => item.id === place.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
