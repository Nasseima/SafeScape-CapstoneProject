import React, { useState, useRef, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { ScrollArea } from "../ui/Scroll-area";
import { ToastContainer, toast,  Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({ title: '', start: '', end: '', description: '', color: '#3788d8' });
  const calendarRef = useRef(null);

  // Get the user ID from localStorage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      loadEvents();
    } else {
      toast.error("User ID not found. Please log in.");
    }
  }, [userId]);

  const loadEvents = () => {
    const storedEvents = JSON.parse(localStorage.getItem(`events_${userId}`) || '[]');
    setEvents(storedEvents);
  };

  const saveEvents = (updatedEvents) => {
    localStorage.setItem(`events_${userId}`, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleDateSelect = (selectInfo) => {
    setEventDetails({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      description: '',
      color: '#3788d8'
    });
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setEventDetails({
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      description: clickInfo.event.extendedProps.description || '',
      color: clickInfo.event.backgroundColor
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = useCallback(() => {
    if (!userId) {
      toast.error("User ID not found. Please log in to save events.");
      return;
    }

    const newEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: eventDetails.title,
      start: eventDetails.start,
      end: eventDetails.end,
      description: eventDetails.description,
      backgroundColor: eventDetails.color,
      borderColor: eventDetails.color
    };

    let updatedEvents;
    if (selectedEvent) {
      updatedEvents = events.map(event => event.id === newEvent.id ? newEvent : event);
    } else {
      updatedEvents = [...events, newEvent];
    }

    saveEvents(updatedEvents);
    setShowEventModal(false);
    setSelectedEvent(null);
    toast.success(selectedEvent ? 'Event updated successfully' : 'Event added successfully');
  }, [events, selectedEvent, eventDetails, userId]);

  const handleDeleteEvent = useCallback(() => {
    if (!userId) {
      toast.error("User ID not found. Please log in to delete events.");
      return;
    }

    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      saveEvents(updatedEvents);
      setShowEventModal(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully');
    }
  }, [events, selectedEvent, userId]);

  const upcomingEvents = events
    .filter(event => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Logged In</h1>
          <p>Please log in to view and manage your events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
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
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white p-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Event Planner</h2>
        <Button onClick={() => setShowEventModal(true)} className="w-full mb-4">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Upcoming Events</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <AnimatePresence>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-4 p-3 bg-gray-50 rounded-lg shadow"
              >
                <h4 className="font-semibold text-gray-800">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  <Calendar className="inline mr-1 h-4 w-4" />
                  {new Date(event.start).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <Clock className="inline mr-1 h-4 w-4" />
                  {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-2 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEventClick({ event })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedEvent(event);
                    handleDeleteEvent();
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-4"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          selectable={true}
          editable={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
        />
      </motion.div>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Make changes to your event here.' : 'Fill in the details for your new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={eventDetails.title}
                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Start
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={eventDetails.start.slice(0, 16)}
                onChange={(e) => setEventDetails({ ...eventDetails, start: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                End
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={eventDetails.end.slice(0, 16)}
                onChange={(e) => setEventDetails({ ...eventDetails, end: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={eventDetails.description}
                onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                type="color"
                value={eventDetails.color}
                onChange={(e) => setEventDetails({ ...eventDetails, color: e.target.value })}
                className="col-span-3 h-10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>Save</Button>
            {selectedEvent && (
              <Button variant="destructive" onClick={handleDeleteEvent}>
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
