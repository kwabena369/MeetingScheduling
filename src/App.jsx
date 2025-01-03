/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import ScheduleMeetingForm from './components/scheduleMeetingForm';
import MeetingDashboard from './components/MeetingDashboard';
import './App.css';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Fetch initial meetings from the server
    fetch('http://localhost:5000/meetings')
      .then((response) => response.json())
      .then((data) => setMeetings(data));

    // Fetch available slots for a specific user (e.g., userId = 1)
    fetch('http://localhost:5000/users/1/available-slots')
      .then((response) => response.json())
      .then((data) => setAvailableSlots(data));
  }, []);

  const handleScheduleMeeting = (meetingDetails) => {
    fetch('http://localhost:5000/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingDetails),
    })
      .then((response) => response.json())
      .then((newMeeting) => setMeetings((prevMeetings) => [...prevMeetings, newMeeting]));
  };

  const handleRescheduleMeeting = (meetingId) => {
    // Implement reschedule logic here
  };

  const handleCancelMeeting = (meetingId) => {
    fetch(`http://localhost:5000/meetings/${meetingId}`, {
      method: 'DELETE',
    }).then(() => setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== meetingId)));
  };

  return (
    <div className="App">
      <ScheduleMeetingForm onSubmit={handleScheduleMeeting} availableSlots={availableSlots} />
      <MeetingDashboard
        meetings={meetings}
        onReschedule={handleRescheduleMeeting}
        onCancel={handleCancelMeeting}
      />
    </div>
  );
}

export default App;