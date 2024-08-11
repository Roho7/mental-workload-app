import { multipliersMap } from '@/constants/TaskParameters';
import { MWLValues, TaskType } from '@/constants/types';
import { db } from '@/utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gAuth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import uuid from 'react-native-uuid';

export type MWLObjectType = {
  [key: string]: { mwl: number; feedback: string };
};

export type UserDataType = {
  userId: string;
  preferences: Record<string, any>;
  tasks: TaskType[];
  mwlRecord: MWLObjectType;
};

type TaskContextType = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  todaysTasks: TaskType[];
  completedTasks: TaskType[];
  addTask: (task: TaskType) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (id: string, newTask: Partial<TaskType>) => Promise<void>;
  bulkAddTasks: (tasks: Array<TaskType>) => Promise<void>;
  daysWithTasks: { date: Date; tasks: number; mwl: number | undefined }[];
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
  fetchTasksAndMwl: () => Promise<void>;
  mwlObject: MWLObjectType | null;
  todaysApproximateMWL: { values: number[]; avg: MWLValues };
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const user = gAuth().currentUser;
  const toast = useToastController();

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [mwlObject, setMwlObject] = useState<MWLObjectType | null>(null);

  const fetchTasksAndMwl = useCallback(async () => {
    if (!user) {
      console.log('No user');
      return;
    }

    try {
      const userUid = user.uid;
      const taskRef = collection(db, `tbl_users/${userUid}/tasks`);
      const mwlRef = collection(db, `tbl_users/${userUid}/mwl`);

      const [taskSnapshot, mwlSnapshot] = await Promise.all([
        getDocs(taskRef),
        getDocs(mwlRef),
      ]);

      const fetchedTasks = taskSnapshot.docs.map(
        (doc) => doc.data() as TaskType
      );
      const fetchedMwl = mwlSnapshot.docs.reduce<MWLObjectType>((acc, doc) => {
        acc[doc.id] = doc.data() as { mwl: number; feedback: string };
        return acc;
      }, {});

      setTasks(fetchedTasks);
      setMwlObject(fetchedMwl);

      console.log('Tasks and MWL data set in state');
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTasksAndMwl();
  }, [fetchTasksAndMwl]);

  const addTask = useCallback(
    async (task: TaskType) => {
      if (!user) throw new Error('User is not authenticated');
      const newTask = {
        ...task,
        userId: user.uid,
        taskId: uuid.v4().toString(),
      };
      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, newTask.taskId);
      await setDoc(taskRef, newTask);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [user]
  );

  const removeTask = useCallback(
    async (id: string) => {
      if (!user) throw new Error('User is not authenticated');
      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, id);
      await deleteDoc(taskRef);
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== id));
    },
    [user]
  );

  const updateTask = useCallback(
    async (id: string, newTask: Partial<TaskType>) => {
      if (!user) throw new Error('User is not authenticated');
      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, id);
      await updateDoc(taskRef, newTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === id ? { ...task, ...newTask } : task
        )
      );
    },
    [user]
  );

  const getTasksByDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => {
        if (!task.startDate) return false;
        const taskDate = task.startDate.toDate();
        return taskDate.toDateString() === date.toDateString();
      });
    },
    [tasks]
  );

  const generateMentalWorkload = useCallback(
    async ({
      dayFeedback,
      isTemporaryFeedback = false,
      date,
    }: {
      dayFeedback?: Record<string, number>;
      isTemporaryFeedback?: boolean;
      date: moment.Moment | null;
    }) => {
      if (!date || !user) {
        throw new Error('No date provided or user not authenticated');
      }
      const tasks = getTasksByDate(new Date(date.toString()));

      const formattedTasks = tasks.map((task) => ({
        ...task,
        startDate: moment(task.startDate?.toDate()).format('DD-MM-YYYY-HH:mm'),
        endDate: moment(task.endDate?.toDate()).format('DD-MM-YYYY-HH:mm'),
      }));

      const userPreferences = await AsyncStorage.getItem('userPreferences');

      const insertData = {
        dayFeedback,
        preferences: userPreferences ?? '',
        tasks: formattedTasks,
        userId: user.uid,
        date: date.format('DD-MM-YYYY'),
      };

      try {
        const { idToken } = await GoogleSignin.getTokens();
        if (!idToken) {
          throw new Error('No id token found');
        }
        const response = await fetch(
          'https://us-central1-mental-workload-app.cloudfunctions.net/generateMentalWorkload',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'is-temporary': isTemporaryFeedback ? 'true' : 'false',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(insertData),
          }
        );
        return await response.json();
      } catch (error) {
        console.error('Error generating mental workload: ', error);
        throw error;
      }
    },
    [user, getTasksByDate]
  );

  const getTasksByRange = useCallback(
    (start: Date, end: Date) => {
      const startMoment = moment(start);
      const endMoment = moment(end);
      return tasks.filter((task) => {
        if (!task.startDate) return false;
        const taskDate = moment(task.startDate.toDate());
        return taskDate.isBetween(startMoment, endMoment, 'day', '[]');
      });
    },
    [tasks]
  );

  const todaysTasks = useMemo(() => {
    const today = new Date();
    return getTasksByDate(today).sort((a, b) => (a.status !== 'done' ? -1 : 1));
  }, [getTasksByDate]);

  const completedTasks = useMemo(() => {
    return todaysTasks.filter((task) => task.status === 'done');
  }, [todaysTasks]);

  const daysWithTasks = useMemo(() => {
    const dateCount: Record<string, { tasks: number; mwl?: number }> = {};
    tasks.forEach((task) => {
      if (!task.startDate) return;
      const formattedDate = moment(task.startDate.toDate()).format(
        'DD-MM-YYYY'
      );
      if (!dateCount[formattedDate]) {
        dateCount[formattedDate] = {
          tasks: 0,
          mwl: mwlObject?.[formattedDate]?.mwl,
        };
      }
      dateCount[formattedDate].tasks += 1;
    });

    return Object.entries(dateCount).map(([date, { tasks, mwl }]) => ({
      date: moment(date, 'DD-MM-YYYY').toDate(),
      tasks,
      mwl,
    }));
  }, [tasks, mwlObject]);

  const bulkAddTasks = useCallback(
    async (newTasks: Array<TaskType>) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }

      const tasksToAdd = newTasks.map((task) => ({
        ...task,
        userId: user.uid,
        taskId: uuid.v4().toString(),
      }));

      await Promise.all(
        tasksToAdd.map((task) =>
          setDoc(doc(db, `tbl_users/${user.uid}/tasks`, task.taskId), task)
        )
      );

      setTasks((prevTasks) => [...prevTasks, ...tasksToAdd]);

      toast.show('Tasks added!', {
        native: true,
      });
      router.back();
    },
    [user, toast]
  );

  const todaysApproximateMWL = useMemo(() => {
    const halfHourlyData = new Array(48).fill(0);

    todaysTasks.forEach((task, index) => {
      const taskStartTime = new Date(task.startDate?.toMillis() || 0);
      const previousTaskEndTime = new Date(
        todaysTasks[index > 0 ? index - 1 : 0]?.endDate?.toMillis() || 0
      );
      const taskEndTime = new Date(task.endDate?.toMillis() || 0);

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

      const startIndex =
        taskStartTime.getHours() * 2 +
        Math.floor(taskStartTime.getMinutes() / 30);
      const endIndex =
        taskEndTime.getHours() * 2 + Math.ceil(taskEndTime.getMinutes() / 30);

      for (let i = startIndex; i < endIndex; i++) {
        halfHourlyData[i] +=
          1 * difficultyMultiplier * priorityMultiplier * gapMultiplier;
      }
    });

    halfHourlyData.forEach((value, index) => {
      if (
        value > 0 &&
        index + 4 < halfHourlyData.length &&
        halfHourlyData[index + 4] > 0
      ) {
        if (index + 2 < halfHourlyData.length) halfHourlyData[index + 2] += 2;
        if (index + 3 < halfHourlyData.length) halfHourlyData[index + 3] += 1;
      }
      halfHourlyData[index] = Math.min(value, 4);
    });

    const nonZeroValues = halfHourlyData.filter((value) => value > 0);
    const average =
      nonZeroValues.length > 0
        ? halfHourlyData.reduce((acc, val) => acc + val, 0) /
          nonZeroValues.length
        : 0;

    return { values: halfHourlyData, avg: Math.round(average) as MWLValues };
  }, [todaysTasks]);

  const contextValue = useMemo(
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
      bulkAddTasks,
      daysWithTasks,
      getTasksByDate,
      getTasksByRange,
      mwlObject,
      todaysApproximateMWL,
    }),
    [
      tasks,
      todaysTasks,
      completedTasks,
      generateMentalWorkload,
      fetchTasksAndMwl,
      addTask,
      removeTask,
      updateTask,
      bulkAddTasks,
      daysWithTasks,
      getTasksByDate,
      getTasksByRange,
      mwlObject,
      todaysApproximateMWL,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTasks = () => {
  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return taskContext;
};
