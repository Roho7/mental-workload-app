import { useTasks } from '@/components/hooks/useTasks';
import DateTimePicker from '@/components/ui/DateTimePicker';
import DifficultyBadge, {
  DifficultyMap,
} from '@/components/ui/DifficultyBadge';
import Dropdown from '@/components/ui/Dropdown';

import PriorityBadge from '@/components/ui/PriorityBadge';
import { PriorityMap } from '@/constants/TaskParameters';
import {
  GoogleCalendarEventType,
  PriorityValues,
  TaskType,
} from '@/constants/types';
import { db } from '@/utils/firebase';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Vibration } from 'react-native';

import { useAuth } from '@/components/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import gAuth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import {
  Button,
  H2,
  Input,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'tamagui';

const AddTask = ({}) => {
  const user = gAuth().currentUser;
  const { getCalendarEvents } = useAuth();
  const { fetchTasksAndMwl } = useTasks();
  const toast = useToastController();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityValues>(0);
  const [mwl, setMwl] = useState(1);
  const [startDate, setStartDate] = useState<Timestamp | null>(Timestamp.now());
  const [endDate, setEndDate] = useState<Timestamp | null>(
    Timestamp.fromDate(moment(Timestamp.now().toDate()).add(1, 'hour').toDate())
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!user) {
      return;
    }

    const insertData: TaskType = {
      userId: user.uid,
      title: title,
      description: description,
      priority: priority,
      difficulty: mwl,
      startDate: startDate,
      endDate: endDate,
      taskId: uuid.v4().toString(),
    };

    await setDoc(doc(db, `tbl_users/${user.uid}/tasks`, insertData.taskId), {
      ...insertData,
      userId: user.uid,
    });

    Vibration.vibrate(10);
    toast.show('Task added!', {
      native: true,
    });
    setLoading(false);
    reset();
    fetchTasksAndMwl();
    router.back();
  };

  const bulkAddTasks = async (tasks: Array<TaskType>) => {
    if (!user) {
      return;
    }

    tasks.forEach(async (task) => {
      const insertData: TaskType = {
        ...task,
        userId: user.uid,
        taskId: uuid.v4().toString(),
      };

      const taskRef = doc(db, `tbl_users/${user.uid}/tasks`, insertData.taskId);
      await setDoc(taskRef, insertData);
    });

    toast.show('Tasks added!', {
      native: true,
    });
    router.back();
  };

  const convertGoogleEventToTask = (
    event: GoogleCalendarEventType,
    userId: string
  ): TaskType => {
    const priority = 0; // default priority
    const description = event.summary; // Using event summary as description
    const difficulty = 1; // Default difficulty
    const bucket = event.organizer.email; // Default bucket

    return {
      bucket: bucket,
      title: event.summary,
      description: description || 'No description available',
      status: 'pending', // default status
      difficulty: difficulty,
      startDate: event.start.dateTime
        ? Timestamp.fromDate(new Date(event.start.dateTime))
        : null,
      endDate: event.end.dateTime
        ? Timestamp.fromDate(new Date(event.end.dateTime))
        : null,
      priority: priority,
      taskId: event.id,
      userId: userId,
    };
  };

  useEffect(() => {
    setEndDate(
      Timestamp.fromDate(moment(startDate?.toDate()).add(1, 'hour').toDate())
    );
  }, [startDate]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority(0);
    setMwl(1);
    setStartDate(null);
    setEndDate(null);
  };

  if (loading) {
    return (
      <YStack
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner size='large' color='$color10' />
      </YStack>
    );
  }
  return (
    <YStack gap='$4' paddingInline='$2'>
      <XStack alignItems='center' gap='$4'>
        <H2>Add Task</H2>
      </XStack>
      <Input
        placeholder='New Task'
        fontSize='$8'
        onChange={(e) => setTitle(e.nativeEvent.text)}
        value={title}
      />
      <TextArea
        placeholder='Description'
        numberOfLines={4}
        multiline={true}
        fontSize='$4'
        height={100}
        verticalAlign={'top'}
        onChange={(e) => setDescription(e.nativeEvent.text)}
        value={description}
      />
      <Dropdown
        action={() => setPriority}
        elements={[0, 1, 2, 3, 4].map((item) => {
          return (
            <Button
              size='$5'
              onPress={() => {
                setPriority(item as PriorityValues);
              }}
            >
              <XStack gap='$3'>
                <PriorityBadge priority={item} />
                <Text>{PriorityMap[item].text}</Text>
              </XStack>
            </Button>
          );
        })}
      >
        <Button>
          <PriorityBadge priority={priority} />
          <Text>{PriorityMap[priority].text}</Text>
        </Button>
      </Dropdown>
      {/* ============================================ */}
      {/*               DIFFICULTY DROPDOWN            */}
      {/* ============================================ */}
      <Dropdown
        action={() => setMwl}
        elements={[1, 2, 3, 4, 5].map((item) => {
          return (
            <Button
              size='$5'
              onPress={() => {
                setMwl(item);
              }}
            >
              <XStack gap='$3'>
                <DifficultyBadge load={item} />
                <Text>{DifficultyMap[item].text}</Text>
              </XStack>
            </Button>
          );
        })}
      >
        <Button>
          <DifficultyBadge load={mwl} />
          <Text>{DifficultyMap[mwl].text}</Text>
        </Button>
      </Dropdown>
      {/* ============================================ */}
      {/*                   DATE PICKERS               */}
      {/* ============================================ */}
      <DateTimePicker date={startDate} setDate={setStartDate} label='From:' />
      <DateTimePicker date={endDate} setDate={setEndDate} label='Till:' />

      <YStack paddingVertical='$2' gap='$2'>
        <Button
          theme='green'
          borderWidth='$0.25'
          borderColor='green'
          height={50}
          onPress={() => handleSubmit()}
        >
          Save
        </Button>
        <Button
          theme='light_blue'
          borderWidth='$0.25'
          borderColor='light_blue'
          height={50}
          onPress={async () => {
            const calendarTasks = await getCalendarEvents();
            if (!calendarTasks) return;
            bulkAddTasks(
              calendarTasks?.map((event) =>
                convertGoogleEventToTask(event, user?.uid || '')
              )
            );
          }}
        >
          <FontAwesome name='google' color='white' />
          Sync with Google Calendar
        </Button>
      </YStack>
    </YStack>
  );
};

export default AddTask;
