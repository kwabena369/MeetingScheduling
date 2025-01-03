/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Calendar, Clock, Users, Edit2, XCircle } from 'lucide-react';

const MeetingDashboard = ({ meetings, onReschedule, onCancel }) => {
  const [open, setOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newDetails, setNewDetails] = useState({
    title: '',
    description: '',
    date: new Date(),
    duration: '',
  });

  const handleOpen = (meeting) => {
    setSelectedMeeting(meeting);
    setNewDetails({
      title: meeting.title,
      description: meeting.description,
      date: new Date(`${meeting.date}T${meeting.time}`),
      duration: meeting.duration,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      date,
    }));
  };

  const handleSubmit = () => {
    const updatedDetails = {
      ...newDetails,
      date: newDetails.date.toISOString().split('T')[0],
      time: newDetails.date.toTimeString().split(' ')[0],
    };
    onReschedule(selectedMeeting.id, updatedDetails);
    handleClose();
  };

  if (!meetings || meetings.length === 0) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="max-w-sm mx-auto">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
          <h2 className="text-xl text-gray-600 font-medium">No meetings scheduled yet</h2>
          <p className="mt-2 text-gray-500">Your calendar is clear for now!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-100"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                {meeting.title}
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {meeting.duration} min
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{meeting.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>{new Date(`${meeting.date}T${meeting.time}`).toLocaleDateString()}</span>
                <Clock className="w-4 h-4 text-purple-500 ml-2" />
                <span>{new Date(`${meeting.date}T${meeting.time}`).toLocaleTimeString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-purple-500" />
                <span>{meeting.participants.map(p => p.name).join(', ')}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleOpen(meeting)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Reschedule
              </button>
              <button
                onClick={() => onCancel(meeting.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      ))}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl transform transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Reschedule Meeting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newDetails.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter meeting title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newDetails.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200 min-h-[100px]"
                  placeholder="Enter meeting description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={newDetails.date.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={newDetails.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter duration in minutes"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingDashboard;