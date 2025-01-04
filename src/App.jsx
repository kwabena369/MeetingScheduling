/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Tab, Tabs, Box, CircularProgress } from '@mui/material';
import { CalendarMonth, List } from '@mui/icons-material';
import ScheduleMeetingForm from './components/scheduleMeetingForm';
import MeetingDashboard from './components/MeetingDashboard';
import Header from './components/header';

// Get environment variables using Vite's import.meta.env
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// TabPanel component for handling tab content
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="p-4">
    {value === index && children}
  </div>
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
          fetch(`${BACKEND_URL}/meetings`),
          fetch(`${BACKEND_URL}/users/1/available-slots`)
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
    fetch(`${BACKEND_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingDetails),
    })
      .then((response) => response.json())
      .then((newMeeting) => setMeetings((prevMeetings) => [...prevMeetings, newMeeting]));
  };

  const handleRescheduleMeeting = (meetingId, updatedDetails) => {
    fetch(`${BACKEND_URL}/meetings/${meetingId}`, {
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
      });
  };

  const handleCancelMeeting = (meetingId) => {
    fetch(`${BACKEND_URL}/meetings/${meetingId}`, {
      method: 'DELETE',
    }).then(() => setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== meetingId)));
  };

  return (
    <Container>
      <Header />
      <Paper>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<CalendarMonth />} label="Schedule Meeting" />
          <Tab icon={<List />} label="Meeting Dashboard" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <ScheduleMeetingForm onSubmit={handleScheduleMeeting} availableSlots={availableSlots} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <MeetingDashboard
              meetings={meetings}
              onReschedule={handleRescheduleMeeting}
              onCancel={handleCancelMeeting}
            />
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default App;