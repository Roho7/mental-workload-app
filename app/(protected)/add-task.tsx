import { useAuth } from '@/components/hooks/useAuth';
import DateTimePicker from '@/components/ui/DateTimePicker';
import DifficultyBadge, {
  DifficultyMap,
} from '@/components/ui/DifficultyBadge';
import Dropdown from '@/components/ui/Dropdown';

import PriorityBadge, { PriorityMap } from '@/components/ui/PriorityBadge';
import { db } from '@/utils/firebase';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';

import uuid from 'react-native-uuid';
import { Button, H2, H3, Input, Text, TextArea, XStack, YStack } from 'tamagui';

const AddTask = ({}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [mwl, setMwl] = useState(1);
  const [date, setDate] = useState<Date | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      return;
    }
    const insertData = {
      title: title,
      description: description,
      priority: priority,
      mwl: mwl,
      dueDate: date,
      taskId: uuid.v4().toString(),
    };

    const taskRef = collection(db, `tbl_users/${user.uid}/tasks`);

    await addDoc(taskRef, {
      ...insertData,
      userId: user.uid,
    });

    reset();
    router.back();
  };
  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority(0);
    setMwl(1);
    setDate(null);
  };
  return (
    <YStack gap='$4' paddingInline='$2'>
      <XStack alignItems='center' gap='$4'>
        <H2>Add Task</H2>
        <H3 color='$gray5'>#TaskId</H3>
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
        style={{ height: 100 }}
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
                setPriority(item);
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
      {/*                   MWL DROPDOWN               */}
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
      {/*                   DATE PICKER                */}
      {/* ============================================ */}
      <DateTimePicker date={date} setDate={setDate} />
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
