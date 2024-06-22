import { db } from '@/utils/firebase';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
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
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();

  //   ============================================= //
  //                       EFFECTS                   //
  //   ============================================= //

  //   GET TASKS
  useEffect(() => {
    const taskRef = collection(db, 'tbl_tasks');

    const userTasksRef = query(taskRef, where('user_id', '==', user?.uid));

    const subscriber = onSnapshot(userTasksRef, {
      next: (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          ...(doc.data() as TaskType),
        }));
        setTasks(tasks as TaskType[]);
      },
    });
    return () => subscriber();
  }, []);

  const addTask = (task: TaskType) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (id: string) => {};

  const updateTask = (id: string, newTask: TaskType) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === id ? { ...task, ...newTask } : task
      )
    );

    // Perform the database update within the transition
    startTransition(() => {
      const taskRef = doc(db, 'tbl_tasks', id);
      updateDoc(taskRef, newTask).catch((error) => {
        console.error('Error updating document: ', error);
        // Optionally, handle error and revert state if necessary
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === id ? { ...task, ...newTask } : task
          )
        );
      });
    });
  };

  // ------------------------------------------------------------------------------ //
  //                                 HELPER FUNCTIONS                               //
  // ------------------------------------------------------------------------------ //
  const getTasksByDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date.toDate() || '');
        return dueDate.toDateString() === date.toDateString();
      });
    },
    [tasks]
  );

  const getTasksByRange = (start: Date, end: Date) => {
    console.log(moment(start), moment(end));
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const dueDate = moment(task.due_date.toDate());
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
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date.toDate() || '');
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
      if (!task.due_date) return '';
      const dueDate = new Date(task.due_date.toDate() || '');
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
      addTask,
      removeTask,
      updateTask,
      daysWithTasks,
      getTasksByDate,
      getTasksByRange,
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
