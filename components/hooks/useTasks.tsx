import { db } from '@/utils/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
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

import { TaskType } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';

export type MWLObjectType = {
  [key: string]: { mwl: number; feedback: string };
};

type TaskContextType = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  todaysTasks: TaskType[];
  completedTasks: TaskType[];
  addTask: (task: TaskType) => void;
  removeTask: (id: string) => void;
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
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();
  const mwlObject = useRef<MWLObjectType>({});

  //   ============================================= //
  //                       EFFECTS                   //
  //   ============================================= //

  //   GET TASKS
  const fetchTasksAndMwl = useCallback(async () => {
    if (!user) return;

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
      const tasks = taskSnapshot.docs.map((doc) => doc.data());
      // console.log('Fetched tasks:', tasks); // Log fetched tasks

      // Process MWL data
      const mwl = mwlSnapshot.docs.reduce((acc: Record<string, any>, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
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

  const removeTask = (id: string) => {};

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
      const response = await fetch(
        // 'http://127.0.0.1:5001/mental-workload-app/us-central1/generateMentalWorkload',
        'https://us-central1-mental-workload-app.cloudfunctions.net/generateMentalWorkload',
        {
          body: JSON.stringify(insertData),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'is-temporary': isTemporaryFeedback ? 'true' : 'false',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GCLOUD_TOKEN}`,
          },
        }
      );
      console.log('Response:', response);
      return response.json();
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

  const upcomingTasks = useMemo(() => {}, [tasks]);

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
