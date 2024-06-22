import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
type MentalWorkloadType = {
  tasks: string;
  userId: string;
  mwl: number;
  date: Timestamp;
  status: Record<string, any>;
  response: string;
};

initializeApp();
const db = getFirestore();
export const createMentalWorkload = functions.firestore
  .document('tbl_ai_response/{id}')
  .onUpdate(async (handler) => {
    const data = handler.after.data() as MentalWorkloadType;
    const parsedData = JSON.parse(data.response);
    const { userId, date, mwl, feedback } = parsedData;

    if (!userId || !date || mwl === undefined || !feedback) {
      console.error('Missing required fields in parsedData:', parsedData);
      return;
    }

    const userMwlRef = db.doc(`tbl_users/${userId}/mwl/${date}`);

    try {
      await userMwlRef.set(
        {
          mwl,
          feedback,
        },
        { merge: true }
      );
      console.log(`Successfully updated tbl_users/${userId}/mwl/${date}`);
    } catch (error) {
      console.error(`Failed to update tbl_users/${userId}/mwl/${date}:`, error);
    }
  });
