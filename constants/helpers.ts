import { db } from '@/utils/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

export const getAndReplaceTaskDates = async (userId: string) => {
  // Reference to the user's tasks collection

  // Reference to the user's tasks collection
  const taskRef = collection(db, `tbl_users/${userId}/tasks`);

  try {
    // Fetch all tasks
    const taskSnapshot = await getDocs(taskRef);

    // Iterate through tasks and remove dueDate field
    const updatePromises = taskSnapshot.docs.map(async (taskDoc) => {
      const taskData = taskDoc.data();

      // Create a copy of taskData without dueDate field
      const { dueDate, ...updatedTask } = taskData;

      // Update the task in Firestore
      const taskDocRef = doc(db, `tbl_users/${userId}/tasks`, taskDoc.id);
      await updateDoc(taskDocRef, updatedTask);
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log('dueDate field removed from all tasks successfully');
  } catch (error) {
    console.error('Error removing dueDate field from tasks: ', error);
  }
};

// Usage example
const userId = 'your-user-id';
getAndReplaceTaskDates(userId);
