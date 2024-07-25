import { Timestamp } from '@google-cloud/firestore';

export type PriorityMapType = {
  color: string;
  text: string;
  icon: any;
};

export type PriorityValues = 1 | 2 | 3 | 4 | 0;

export type TaskType = {
  bucket?: string;
  title: string;
  description: string;
  status?: 'done' | 'pending' | 'overdue';
  difficulty: number;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  priority: PriorityValues;
  taskId: string;
  userId: string;
};

export type GoogleCalendarEventType = {
  created: string;
  creator: {
    email: string;
    self: boolean;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  etag: string;
  eventType: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: {
    email: string;
    self: boolean;
  };
  reminders: {
    useDefault: boolean;
  };
  sequence: number;
  start: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
  summary: string;
  updated: string;
};
