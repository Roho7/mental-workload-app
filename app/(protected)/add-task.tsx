import DateTimePicker from '@/components/ui/DateTimePicker';
import Dropdown from '@/components/ui/Dropdown';
import MwlBadge, { MwlMap } from '@/components/ui/MwlBadge';
import PriorityBadge, { PriorityMap } from '@/components/ui/PriorityBadge';
import { db } from '@/utils/firebase';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import uuid from 'react-native-uuid';
import {
  Button,
  H2,
  H3,
  Input,
  Text,
  TextArea,
  View,
  XStack,
  YStack,
} from 'tamagui';

const AddTask = ({}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [mwl, setMwl] = useState(1);
  const [date, setDate] = useState<Date | null>(null);

  const handleSubmit = async () => {
    const insertData = {
      title: title,
      description: description,
      priority: priority,
      mwl: mwl,
      due_date: date,
      task_id: uuid.v1(),
    };
    const data = await addDoc(collection(db, 'tbl_tasks'), insertData);
    if (data) {
      reset();
      router.back();
    }
  };

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority(0);
    setMwl(1);
    setDate(null);
  };
  return (
    <SafeAreaView>
      <YStack gap="$4" paddingInline="$2">
        <XStack alignItems="center" gap="$4">
          <H2>Add Task</H2>
          <H3 color="$gray5">#TaskId</H3>
        </XStack>
        <Input
          placeholder="New Task"
          fontSize="$8"
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
        <TextArea
          placeholder="Description"
          numberOfLines={4}
          multiline={true}
          fontSize="$4"
          style={{ height: 100 }}
          onChange={(e) => setDescription(e.nativeEvent.text)}
        />
        <Dropdown
          action={() => setPriority}
          elements={[0, 1, 2, 3, 4].map((item) => {
            return (
              <Button
                size="$5"
                onPress={() => {
                  setPriority(item);
                }}
              >
                <XStack gap="$3">
                  <PriorityBadge priority={item} />
                  <Text>{PriorityMap[item].text}</Text>
                </XStack>
              </Button>
            );
          })}
        >
          <View className="flex flex-row items-center" style={{ columnGap: 8 }}>
            <PriorityBadge priority={priority} />
            <Text>{PriorityMap[priority].text}</Text>
          </View>
        </Dropdown>
        {/* ============================================ */}
        {/*                   MWL DROPDOWN               */}
        {/* ============================================ */}
        <Dropdown
          action={() => setMwl}
          elements={[1, 2, 3, 4, 5].map((item) => {
            return (
              <Button
                size="$5"
                onPress={() => {
                  setMwl(item);
                }}
              >
                <XStack gap="$3">
                  <MwlBadge load={item} />
                  <Text>{MwlMap[item].text}</Text>
                </XStack>
              </Button>
            );
          })}
        >
          <View className="flex flex-row items-center" style={{ columnGap: 8 }}>
            <MwlBadge load={mwl} />
            <Text>{MwlMap[mwl].text}</Text>
          </View>
        </Dropdown>
        {/* ============================================ */}
        {/*                   DATE PICKER                */}
        {/* ============================================ */}
        <DateTimePicker date={date} setDate={setDate} />
        <Button
          theme="green"
          borderWidth="$0.25"
          borderColor="green"
          onPress={() => handleSubmit()}
        >
          Save
        </Button>
      </YStack>
    </SafeAreaView>
  );
};

export default AddTask;
