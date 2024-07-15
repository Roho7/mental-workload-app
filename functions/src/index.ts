import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { AIMwlReturnType, getAIMwlRating } from './ai';

export type MentalWorkloadRequestType = {
  tasks: string;
  userId: string;
  date: string; // DD-MM-YYYY
  preferences: Record<string, any>;
  isTemporaryFeedback?: boolean;
};

initializeApp();
const db = getFirestore();

export const generateMentalWorkload = functions.https.onRequest(
  async (req, res) => {
    try {
      const { tasks, userId, date, preferences } = JSON.parse(
        req.body
      ) as MentalWorkloadRequestType;

      const { isTemporaryFeedback } = req.headers;

      if (!tasks) {
        res.status(400).send('Missing required fields in request body');
        functions.logger.error(
          'Missing required fields in request body:',
          req.body
        );
        return;
      }

      const aiResponse: AIMwlReturnType | null | undefined =
        await getAIMwlRating({
          raw_data: { tasks, userId, date, preferences },
          isTemporaryFeedback: isTemporaryFeedback ? true : false,
        });

      if (!aiResponse) {
        res.status(500).send('AI response not received');
        functions.logger.error('No AI response received');
        return;
      }

      try {
        db.collection(`tbl_users/${userId}/mwl`).doc(aiResponse?.date).set({
          mwl: aiResponse?.mwl,
          feedback: aiResponse?.feedback,
        });
      } catch (error) {
        functions.logger.error('Error updating document: ', error);
      }

      res.status(200).send(aiResponse);
    } catch (error) {
      functions.logger.error('Error generating mental workload:', error);
      res.status(500).send('Internal server error');
    }
  }
);

// SENDS THE DATA TO THE USER'S MWL COLLECTION WHEN THE AI RESPONSE IS RECEIVED
// export const inputMentalWorkload = functions.firestore
//   .document('tbl_ai_response/{id}')
//   .onUpdate(async (handler) => {
//     const data = handler.after.data() as MentalWorkloadPayloadType;
//     const parsedData = JSON.parse(data.response);
//     const { userId, date, mwl, feedback } = parsedData;

//     if (!userId || !date || mwl === undefined || !feedback) {
//       console.error('Missing required fields in parsedData:', parsedData);
//       return;
//     }

//     const userMwlRef = db.doc(`tbl_users/${userId}/mwl/${date}`);

//     try {
//       await userMwlRef.set(
//         {
//           mwl,
//           feedback,
//         },
//         { merge: true }
//       );
//       functions.logger.info(
//         `Successfully updated tbl_users/${userId}/mwl/${date}`
//       );
//     } catch (error) {
//       functions.logger.error(
//         `Failed to update tbl_users/${userId}/mwl/${date}:`,
//         error
//       );
//     }
//   });
