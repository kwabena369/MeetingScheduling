/* eslint-disable react/prop-types */
import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const ScheduleMeetingForm = ({ onSubmit, availableSlots }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    description: '',
    date: new Date(),
    duration: '',
    participants: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(meetingDetails);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Schedule a Meeting</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={meetingDetails.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={meetingDetails.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date & Time"
              value={meetingDetails.date}
              onChange={handleDateChange}
              renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <TextField
            label="Duration (minutes)"
            name="duration"
            value={meetingDetails.duration}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Participants"
            name="participants"
            value={meetingDetails.participants}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Available Slots"
            value={meetingDetails.date}
            onChange={handleDateChange}
            fullWidth
            margin="normal"
          >
            {availableSlots.map((slot, index) => (
              <MenuItem key={index} value={new Date(`${slot.date}T${slot.time}:00`)}>
                {`${slot.date} ${slot.time} (${slot.duration} mins)`}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Schedule Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleMeetingForm;