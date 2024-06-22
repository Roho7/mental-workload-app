import { db } from '@/utils/firebase';
import { router } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
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
  useTransition,
} from 'react';
import { TaskType } from '../ui/TaskCard';
import { useAuth } from './useAuth';

type MWLObjectType = {
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
  daysWithTasks: { date: string; tasks: number }[];
  getTasksByDate: (date: Date) => TaskType[];
  getTasksByRange: (start: Date, end: Date) => TaskType[];
  generateMentalWorkload: (date: string | undefined) => void;
  mwlObject: MWLObjectType;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();
  const [mwlObject, setMwlObject] = useState<MWLObjectType>({});

  //   ============================================= //
  //                       EFFECTS                   //
  //   ============================================= //

  //   GET TASKS
  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    const taskRef = collection(db, `tbl_users/${user.uid}/tasks`);
    const mwlRef = collection(db, `tbl_users/${user.uid}/mwl`);

    const taskSubscriber = onSnapshot(taskRef, {
      next: (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          ...(doc.data() as TaskType),
        }));
        setTasks(tasks as TaskType[]);
      },
    });
    const mwlSubscriber = onSnapshot(mwlRef, {
      next: (snapshot) => {
        const mwl = snapshot.docs.reduce((acc, doc) => {
          return { ...acc, [doc.id]: doc.data() };
        }, {});
        setMwlObject({ ...mwl } as MWLObjectType);
      },
    });
    alert('Tasks fetched');
    return () => {
      taskSubscriber();
      mwlSubscriber();
    };
  }, []);

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

  const generateMentalWorkload = async (date: string | undefined) => {
    if (!date) return;
    const tasks: TaskType[] = getTasksByDate(new Date(date));

    const formatedTasks = tasks.map((task) => {
      return {
        ...task,
        dueDate: moment(task.dueDate?.toDate()).format('DD-MM-YYYY-HH:mm'),
      };
    });

    const insertData = { tasks: JSON.stringify(formatedTasks) };
    try {
      await addDoc(collection(db, 'tbl_ai_response'), insertData);
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
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate.toDate() || '');
        return dueDate.toDateString() === date.toDateString();
      });
    },
    [tasks]
  );

  const getTasksByRange = (start: Date, end: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = moment(task.dueDate.toDate());
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
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate.toDate() || '');
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
      if (!task.dueDate) return '';
      const dueDate = new Date(task.dueDate.toDate() || '');
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
