import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'; 

const ActivitiesPage = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_URL}/activities/all');
        const data = await response.json();
        setActivitiesData(data);
        setFilteredActivities(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching activities!");
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const filtered = activitiesData.filter(
      (activity) =>
        (activity.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedType === 'All' || activity.type === selectedType)
    );
    setFilteredActivities(filtered);
  }, [searchTerm, selectedType, activitiesData]);

  const activityTypes = ['All', ...new Set(activitiesData.map((a) => a.type))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-blue-800"
      >
        Discover Amazing Activities
      </motion.h1>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {activityTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                onClick={() => setSelectedType(type)}
                className="px-4 py-2 text-sm"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredActivities.map((activity, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">{activity.type}</h2>
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" /> {activity.address}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredActivities.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 mt-8"
        >
          No activities found. Try adjusting your search or filters.
        </motion.p>
      )}
    </div>
  );
};

export default ActivitiesPage;
