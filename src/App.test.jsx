/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import MeetingDashboard from './components/MeetingDashboard';

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
// rtrter
  it('loads and displays meetings', async () => {
    const mockMeetings = [
      { id: 1, title: 'Test Meeting', description: 'Test Description', date: '2025-01-03T09:00:00Z', duration: 30, participants: 'Client B' }
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMeetings),
      })
    );

    const onCancel = jest.fn();

    render(
      <MeetingDashboard
        meetings={mockMeetings}
        onReschedule={() => {}}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledWith(1);
  });
});