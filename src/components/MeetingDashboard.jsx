/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const MeetingDashboard = ({ meetings, onReschedule, onCancel }) => {
  return (
    <div>
      {meetings.map((meeting) => (
        <Card key={meeting.id} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">{meeting.title}</Typography>
            <Typography>{meeting.description}</Typography>
            <Typography>{new Date(meeting.date).toLocaleString()}</Typography>
            <Typography>Duration: {meeting.duration} minutes</Typography>
            <Typography>Participants: {meeting.participants}</Typography>
            <Button onClick={() => onReschedule(meeting.id)} variant="contained" color="secondary">
              Reschedule
            </Button>
            <Button onClick={() => onCancel(meeting.id)} variant="contained" color="error">
              Cancel
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MeetingDashboard;