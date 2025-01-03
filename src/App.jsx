/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import { CalendarMonth, List } from '@mui/icons-material';
import ScheduleMeetingForm from './components/scheduleMeetingForm';
import MeetingDashboard from './components/MeetingDashboard';
import Header from './components/header';
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="p-6 h-full">
    {value === index && children}
  </div>
);

const CustomTab = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex m-[12px]  rounded-2xl border-none items-center space-x-2 px-6 py-3 transition-all duration-200 
      ${isActive 
        ? ' text-white bg-gray-200  shadow-lg rounded-t-lg' 
        : 'text-black shadow-xl bg-white hover:text-blue-300'
      }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  const [meetings, setMeetings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [meetingsRes, slotsRes] = await Promise.all([
          fetch('http://localhost:5000/meetings'),
          fetch('http://localhost:5000/users/1/available-slots')
        ]);

        if (!meetingsRes.ok || !slotsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const meetingsData = await meetingsRes.json();
        const slotsData = await slotsRes.json();

        setMeetings(meetingsData);
        setAvailableSlots(slotsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScheduleMeeting = (meetingDetails) => {
    fetch('http://localhost:5000/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingDetails),
    })
      .then((response) => response.json())
      .then((newMeeting) => setMeetings((prevMeetings) => [...prevMeetings, newMeeting]))
      .catch((error) => {
        console.error('Error scheduling meeting:', error);
        setError('Failed to schedule meeting. Please try again.');
      });
  };

  const handleRescheduleMeeting = (meetingId, updatedDetails) => {
    fetch(`http://localhost:5000/meetings/${meetingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDetails),
    })
      .then((response) => response.json())
      .then((updatedMeeting) => {
        setMeetings((prevMeetings) =>
          prevMeetings.map((meeting) =>
            meeting.id === meetingId ? updatedMeeting : meeting
          )
        );
      })
      .catch((error) => {
        console.error('Error rescheduling meeting:', error);
        setError('Failed to reschedule meeting. Please try again.');
      });
  };

  const handleCancelMeeting = (meetingId) => {
    fetch(`http://localhost:5000/meetings/${meetingId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMeetings((prevMeetings) => 
          prevMeetings.filter((meeting) => meeting.id !== meetingId)
        );
      })
      .catch((error) => {
        console.error('Error canceling meeting:', error);
        setError('Failed to cancel meeting. Please try again.');
      });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg">
          <div className=" bg-gray-50">
            <div className="flex justify-center">
              <CustomTab
                icon={<CalendarMonth className={activeTab === 0 ? "text-blue-600" : "text-gray-600"} />}
                label="Schedule"
                isActive={activeTab === 0}
                onClick={() => setActiveTab(0)}
              />
              <CustomTab
                icon={<List className={activeTab === 1 ? "text-blue-600" : "text-gray-600"} />}
                label="Current "
                isActive={activeTab === 1}
                onClick={() => setActiveTab(1)}
              />
            </div>
          </div>

          <div className="min-h-[calc(100vh-16rem)]">
            <TabPanel value={activeTab} index={0}>
              <ScheduleMeetingForm 
                onSubmit={handleScheduleMeeting} 
                availableSlots={availableSlots} 
              />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <CircularProgress />
                </div>
              ) : error ? (
                <Typography color="error" className="text-center">{error}</Typography>
              ) : (
                <MeetingDashboard
                  meetings={meetings}
                  onReschedule={handleRescheduleMeeting}
                  onCancel={handleCancelMeeting}
                />
              )}
            </TabPanel>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default App;