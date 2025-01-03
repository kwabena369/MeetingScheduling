/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  MenuItem, 
  Stack,
  Box,
  Container,
  ThemeProvider,
  createTheme,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { CalendarMonth, Schedule, AccessTime, Group } from '@mui/icons-material';

// Create a custom theme with softer colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#7986cb', // Soft indigo
    },
    background: {
      default: '#f5f7ff', // Very light blue-gray
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }
        }
      }
    }
  }
});

const ScheduleMeetingForm = ({ onSubmit, availableSlots }) => {
  const [showToast, setShowToast] = useState(false);
  const initialState = {
    title: '',
    description: '',
    date: null,
    time: null,
    duration: 30,
    participants: [
      { id: 1, name: "Freelancer A", role: "freelancer", key: "participant-1" },
      { id: 2, name: "Client B", role: "client", key: "participant-2" }
    ]
  };

  const [meetingDetails, setMeetingDetails] = useState(initialState);
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSlotSelect = (e) => {
    const slot = availableSlots[e.target.value];
    setSelectedSlot(e.target.value);
    
    setMeetingDetails(prev => ({
      ...prev,
      date: slot.date,
      time: slot.time,
      duration: slot.duration
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      title: meetingDetails.title,
      description: meetingDetails.description,
      date: meetingDetails.date,
      time: meetingDetails.time,
      duration: parseInt(meetingDetails.duration),
      participants: meetingDetails.participants.map(({ key, ...participant }) => participant)
    };
    onSubmit(formattedData);
    
    // Show toast and reset form
    setShowToast(true);
    setMeetingDetails(initialState);
    setSelectedSlot('');
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Snackbar
            open={showToast}
            autoHideDuration={3000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
              Meeting scheduled successfully!
            </Alert>
          </Snackbar>

          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'white',
              position: 'relative'
            }}
          >
            {/* Decorative top bar */}
            <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
            
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <CalendarMonth 
                  sx={{ 
                    fontSize: 40, 
                    color: 'primary.main',
                    mb: 2
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  Schedule a Meeting
                </Typography>
              </Box>
              
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    required
                    label="Meeting Title"
                    name="title"
                    value={meetingDetails.title}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Schedule 
                          sx={{ 
                            color: 'primary.light', 
                            mr: 1 
                          }} 
                        />
                      )
                    }}
                  />

                  <TextField
                    label="Description"
                    name="description"
                    value={meetingDetails.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                  />

                  <TextField
                    select
                    required
                    label="Available Time Slots"
                    value={selectedSlot}
                    onChange={handleSlotSelect}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <AccessTime 
                          sx={{ 
                            color: 'primary.light', 
                            mr: 1 
                          }} 
                        />
                      )
                    }}
                  >
                    {availableSlots.map((slot, index) => (
                      <MenuItem key={`slot-${index}`} value={index}>
                        {`${slot.date} at ${slot.time} (${slot.duration} minutes)`}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      disabled
                      label="Duration"
                      name="duration"
                      value={`${meetingDetails.duration} min`}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'grey.50'
                        }
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={!meetingDetails.date || !meetingDetails.title}
                    sx={{ 
                      mt: 2, 
                      py: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Schedule Meeting
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ScheduleMeetingForm;