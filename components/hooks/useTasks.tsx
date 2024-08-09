import { multipliersMap } from '@/constants/TaskParameters';
import { MWLValues, TaskType } from '@/constants/types';
import { db } from '@/utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gAuth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

export type MWLObjectType = {
  [key: string]: { mwl: number; feedback: string };
};

type TaskContextType = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  todaysTasks: TaskType[];
  completedTasks: TaskType[];
  addTask: (task: TaskType) => void;
  removeTask: (id: string, task: TaskType) => void;
  updateTask: (id: string, task: TaskType) => void;
  daysWithTasks: { date: string; tasks: number; mwl: number }[];
  getTasksByDate: (date: Date) => TaskType[];
  getTasksByRange: (start: Date, end: Date) => TaskType[];
  generateMentalWorkload: ({
    dayFeedback,
    isTemporaryFeedback,
    date,
  }: {
    dayFeedback?: Record<string, number>;
    isTemporaryFeedback?: boolean;
    date: moment.Moment | null;
  }) => Promise<any>;
  fetchTasksAndMwl: () => void;
  mwlObject: React.MutableRefObject<MWLObjectType>;
  todaysApproximateMWL: { values: number[]; avg: MWLValues };
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const user = gAuth().currentUser;

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();
  const mwlObject = useRef<MWLObjectType>({});

  //   ============================================= //
  //                       EFFECTS                   //
  //   ============================================= //

  //   GET TASKS
  const fetchTasksAndMwl = useCallback(async () => {
    if (!user) {
      console.log('No user');
      return;
    }

    try {
      const userUid = user.uid;

      // References to the tasks and mwl collections under the specific user
      const taskRef = collection(db, `tbl_users/${userUid}/tasks`);
      const mwlRef = collection(db, `tbl_users/${userUid}/mwl`);

      // Fetch tasks and MWL data concurrently
      const [taskSnapshot, mwlSnapshot] = await Promise.all([
        getDocs(taskRef),
        getDocs(mwlRef),
      ]);

      // Process tasks
      const tasks = taskSnapshot.docs.map((doc: any) => doc.data());
      // console.log('Fetched tasks:', tasks); // Log fetched tasks

      // Process MWL data
      const mwl = mwlSnapshot.docs.reduce(
        (acc: Record<string, any>, doc: any) => {
          acc[doc.id] = doc.data();
          return acc;
        },
        {}
      );
      // console.log('Fetched MWL:', mwl); // Log fetched MWL

      // Update state for both tasks and MWL
      setTasks(tasks as TaskType[]);
      mwlObject.current = mwl as MWLObjectType;

      console.log('Tasks and MWL data set in state');
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTasksAndMwl();
  }, [fetchTasksAndMwl, user]);

  const addTask = (task: TaskType) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (id: string, newTask: TaskType) => {
    if (!user) throw new Error('User is not authenticated');

    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== id));
    startTransition(() => {
      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, id);
      deleteDoc(taskRef).catch((error) => {
        console.error('Error deleting document: ', error);
        // Optionally, handle error and revert state if necessary
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === id ? { ...task, ...newTask } : task
          )
        );
      });
    });
  };

  const updateTask = (id: string, newTask: TaskType) => {
    if (!user) throw new Error('User is not authenticated');
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === id ? { ...task, ...newTask } : task
      )
    );

    // Perform the database update within the transition
    startTransition(() => {
      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, id);
      updateDoc(taskRef, newTask).catch((error) => {
        console.error('Error updating document: ', error);
        // Optionally, handle error and revert state if necessary
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === id ? { ...task, ...newTask } : task
          )
        );
      });
    });
  };

  // ------------------------------------------------------------------------------ //
  //                                 MENTAL WORKLOAD                                //
  // ------------------------------------------------------------------------------ //

  const generateMentalWorkload = async ({
    dayFeedback,
    isTemporaryFeedback = false,
    date,
  }: {
    dayFeedback?: Record<string, number>;
    isTemporaryFeedback?: boolean;
    date: moment.Moment | null;
  }) => {
    if (!date) {
      throw new Error('No date provided');
    }
    const tasks: TaskType[] = getTasksByDate(new Date(date.toString()));

    const formatedTasks = tasks.map((task) => {
      return {
        ...task,
        startDate: moment(task.startDate?.toDate()).format('DD-MM-YYYY-HH:mm'),
        endDate: moment(task.endDate?.toDate()).format('DD-MM-YYYY-HH:mm'),
      };
    });

    const userPreferences = await AsyncStorage.getItem('userPreferences');

    const insertData = {
      dayFeedback: dayFeedback,
      preferences: userPreferences ?? '',
      tasks: formatedTasks,
      userId: user?.uid,
      date: date.format('DD-MM-YYYY'),
    };

    try {
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error('No id token found');
      }
      const response = await fetch(
        // 'http://127.0.0.1:5001/mental-workload-app/us-central1/generateMentalWorkload',
        'https://us-central1-mental-workload-app.cloudfunctions.net/generateMentalWorkload',
        {
          body: JSON.stringify(insertData),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',

            'is-temporary': isTemporaryFeedback ? 'true' : 'false',
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  // ------------------------------------------------------------------------------ //
  //                                 HELPER FUNCTIONS                               //
  // ------------------------------------------------------------------------------ //
  const getTasksByDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => {
        if (!task.startDate) return false;
        const dueDate = new Date(task.startDate.toDate() || '');
        return dueDate.toDateString() === date.toDateString();
      });
    },
    [tasks]
  );

  const getTasksByRange = (start: Date, end: Date) => {
    return tasks.filter((task) => {
      if (!task.startDate) return false;
      const dueDate = moment(task.startDate.toDate());
      return dueDate.isBetween(moment(start), moment(end), 'days', '[]');
    });
  };
  // ------------------------------------------------------------------------------ //
  //                                     MEMOS                                      //
  // ------------------------------------------------------------------------------ //
  const todaysTasks = useMemo(() => {
    if (!tasks) return [];
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return tasks
      .filter((task) => {
        if (!task.startDate) return false;
        const dueDate = new Date(task.startDate.toDate() || '');
        return dueDate >= startOfDay && dueDate <= endOfDay;
      })
      .sort((a, b) => (a.status !== 'done' ? -1 : 1));
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return todaysTasks.filter((task) => task.status === 'done');
  }, [tasks, todaysTasks]);

  const daysWithTasks = useMemo(() => {
    const dateCount: Record<string, number> = {};
    const days = tasks.map((task) => {
      if (!task.startDate) return '';
      const dueDate = new Date(task.startDate.toDate() || '');
      const formattedDate = dueDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      if (!dateCount[formattedDate]) {
        dateCount[formattedDate] = 0;
      }
      dateCount[formattedDate] += 1;
    });
    return Object.keys(dateCount).map((date) => ({
      date,
      tasks: dateCount[date],
      mwl: mwlObject.current[date]?.mwl || 0,
    }));
  }, [tasks]);

  const todaysApproximateMWL = useMemo(() => {
    // Initialize an array with 48 half-hour slots, all set to 0
    const halfHourlyData = new Array(48).fill(0);

    // Iterate through each task to populate the half-hourly data
    todaysTasks.forEach((task, index) => {
      // Convert start and end times to Date objects
      const taskStartTime = new Date(task.startDate?.toMillis() || 0);
      const previousTaskEndTime = new Date(
        todaysTasks[index > 0 ? index - 1 : 0]?.endDate?.toMillis() || 0
      );
      const taskEndTime = new Date(task.endDate?.toMillis() || 0);

      // Retrieve multipliers for difficulty, priority, and gaps
      const difficultyMultiplier =
        multipliersMap.difficulty[task.difficulty] || 1;
      const priorityMultiplier = multipliersMap.priority[task.priority] || 1;
      const gapMultiplier =
        multipliersMap.gap[
          Math.abs(
            Math.floor(
              previousTaskEndTime.getHours() - taskStartTime.getHours()
            )
          )
        ] || 1;

      // Determine the start and end indices for half-hour slots
      const startIndex =
        taskStartTime.getHours() * 2 +
        Math.floor(taskStartTime.getMinutes() / 30);
      const endIndex =
        taskEndTime.getHours() * 2 + Math.ceil(taskEndTime.getMinutes() / 30);

      // Update the half-hourly data array based on task duration and multipliers
      for (let i = startIndex; i < endIndex; i++) {
        halfHourlyData[i] +=
          1 * difficultyMultiplier * priorityMultiplier * gapMultiplier;
      }
    });

    // Apply additional adjustments for nearby tasks
    halfHourlyData.forEach((value, index) => {
      if (
        value > 0 &&
        index + 4 < halfHourlyData.length &&
        halfHourlyData[index + 4] > 0
      ) {
        if (index + 2 < halfHourlyData.length) halfHourlyData[index + 2] += 2;
        if (index + 3 < halfHourlyData.length) halfHourlyData[index + 3] += 1;
      }
      if (value > 4) {
        halfHourlyData[index] = 4;
      }
    });

    // Calculate the average value of non-zero entries
    const nonZeroValues = halfHourlyData.filter((value) => value > 0);
    const average =
      nonZeroValues.length > 0
        ? halfHourlyData.reduce((acc, val) => acc + val, 0) /
          nonZeroValues.length
        : 0;

    console.log('halfHourlyData:', halfHourlyData);

    // Return the computed values and average
    return { values: halfHourlyData, avg: Math.round(average) as MWLValues };
  }, [todaysTasks]);

  const values = useMemo(
    () => ({
      tasks,
      setTasks,
      todaysTasks,
      completedTasks,
      generateMentalWorkload,
      fetchTasksAndMwl,
      addTask,
      removeTask,
      updateTask,
      daysWithTasks,
      getTasksByDate,
      getTasksByRange,
      mwlObject,
      todaysApproximateMWL,
    }),
    [tasks]
  );
  return <TaskContext.Provider value={values}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return taskContext;
};
