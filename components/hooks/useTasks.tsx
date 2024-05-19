import { db } from '@/utils/firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { TaskType } from '../ui/TaskCard';

type TaskContextType = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  todaysTasks: TaskType[];
  completedTasks: TaskType[];
  addTask: (task: TaskType) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, task: TaskType) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();

  //   ============================================= //
  //                       EFFECTS                   //
  //   ============================================= //

  //   GET CHATS
  useEffect(() => {
    const taskRef = collection(db, 'tbl_tasks');

    const subscriber = onSnapshot(taskRef, {
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
  //   ============================================= //
  //                        MEMOS                    //
  //   ============================================= //

  const todaysTasks = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return tasks
      .filter((task) => {
        const dueDate = new Date(task.due_date.toDate());
        return dueDate >= startOfDay && dueDate <= endOfDay;
      })
      .sort((a, b) => (a.status !== 'done' ? -1 : 1));
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return todaysTasks.filter((task) => task.status === 'done');
  }, [tasks, todaysTasks]);

  const values = useMemo(
    () => ({
      tasks,
      setTasks,
      todaysTasks,
      completedTasks,
      addTask,
      removeTask,
      updateTask,
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
