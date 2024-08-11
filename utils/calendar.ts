// import { google } from 'googleapis';

import { GoogleCalendarEventType, TaskType } from '@/constants/types';
import { Timestamp } from 'firebase/firestore';

// const authClient = new google.auth.OAuth2({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   redirectUri: process.env.GOOGLE_REDIRECT_URI,
// });

export const convertGoogleEventToTask = (
  event: GoogleCalendarEventType,
  userId: string
): TaskType => {
  const priority = 0; // default priority
  const description = event.summary; // Using event summary as description
  const difficulty = 1; // Default difficulty
  const bucket = event.organizer.email; // Default bucket

  return {
    bucket: bucket,
    title: event.summary,
    description: description || 'No description available',
    status: 'pending', // default status
    difficulty: difficulty,
    startDate: event.start.dateTime
      ? Timestamp.fromDate(new Date(event.start.dateTime))
      : null,
    endDate: event.end.dateTime
      ? Timestamp.fromDate(new Date(event.end.dateTime))
      : null,
    priority: priority,
    taskId: event.id,
    userId: userId,
  };
};
