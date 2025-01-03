# Scheduling Platform

This repository contains the implementation of a **Scheduling Feature** for a job-matching platform. It is part of a challenge to develop, debug, and optimize features for a system that connects freelancers with clients, providing tools for job postings, profile management, and scheduling meetings.

## Features

### New Features
1. **Scheduling Meetings**  
   - Users can schedule meetings with freelancers or clients directly within the app.
   - Meetings include date, time, duration, and participant details.
   - Notifications are sent to both parties upon scheduling.

2. **Manage Meetings**  
   - Users can reschedule or cancel meetings.
   - Participants are notified of updates or cancellations.

3. **Check Availability**  
   - Users can view available time slots for scheduling.
   - Time zones and schedule conflicts are automatically handled.

### Bug Fixes
- Fixed a critical bug where completed jobs were not appearing in freelancer profiles.

### Enhancements
- Improved the dashboard to include a "Recommended Projects" feature based on user activity.

---

## Technical Overview

### Front-End
- **Framework:** React
- **Styling:** Tailwind CSS, Material UI
- **Libraries Used:**
  - `@mui/icons-material`, `@mui/material`, `react-calendar`, `date-fns`

### Back-End
- **Framework:** Node.js with Express.js
- **Database:** Simulated using in-memory objects (for demonstration purposes)
- **Endpoints:**
  - `POST /meetings`: Schedule a meeting
  - `GET /users/:userId/available-slots`: Fetch available time slots
  - `PUT /meetings/:meetingId`: Update a meeting
  - `DELETE /meetings/:meetingId`: Cancel a meeting

---

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A modern web browser

