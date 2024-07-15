import { useAuth } from '@/components/hooks/useAuth';
import DateTimePicker from '@/components/ui/DateTimePicker';
import DifficultyBadge, {
  DifficultyMap,
} from '@/components/ui/DifficultyBadge';
import Dropdown from '@/components/ui/Dropdown';

import PriorityBadge from '@/components/ui/PriorityBadge';
import { PriorityMap } from '@/constants/TaskParameters';
import { PriorityValues, TaskType } from '@/constants/types';
import { db } from '@/utils/firebase';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import { Vibration } from 'react-native';

import uuid from 'react-native-uuid';
import { Button, H2, Input, Text, TextArea, XStack, YStack } from 'tamagui';

const AddTask = ({}) => {
  const { user } = useAuth();
  const toast = useToastController();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityValues>(0);
  const [mwl, setMwl] = useState(1);

  const [startDate, setStartDate] = useState<Timestamp | null>(Timestamp.now());
  const [endDate, setEndDate] = useState<Timestamp | null>(
    Timestamp.fromDate(moment(Timestamp.now().toDate()).add(1, 'hour').toDate())
  );

  const handleSubmit = async () => {
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

    const taskRef = collection(db, `tbl_users/${user.uid}/tasks`);

    await addDoc(taskRef, {
      ...insertData,
      userId: user.uid,
    });

    Vibration.vibrate(10);
    toast.show('Task added!', {
      native: true,
    });
    reset();
    router.back();
  };
  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority(0);
    setMwl(1);
    setStartDate(null);
    setEndDate(null);
  };
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
      <DateTimePicker
        date={startDate}
        setDate={setStartDate}
        label='Start at'
      />
      <DateTimePicker date={endDate} setDate={setEndDate} label='End at' />

      <Button
        theme='green'
        borderWidth='$0.25'
        borderColor='green'
        onPress={() => handleSubmit()}
      >
        Save
      </Button>
    </YStack>
  );
};

export default AddTask;
