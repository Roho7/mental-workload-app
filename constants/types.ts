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
