import { db } from '@/utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TaskType } from '../ui/TaskCard';

type TaskContextType = {
  tasks: TaskType[];
  addTask: (task: TaskType) => void;
  removeTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  //   ============================================= //
  //                     EFFECTS                     //
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
  //   ============================================= //
  //                        MEMOS                    //
  //   ============================================= //

  const values = useMemo(
    () => ({ tasks, setTasks, addTask, removeTask }),
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
