import React, { useState } from 'react';

import { TaskType } from '@/constants/types';
import { Feather } from '@expo/vector-icons';
import { Pressable, Vibration } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import { Button, H4, Text, View, XStack, YStack } from 'tamagui';
import { useTasks } from '../hooks/useTasks';
import MwlBadge from './DifficultyBadge';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task }: { task: TaskType }) => {
  const [showActions, setShowActions] = useState(false);
  const { updateTask } = useTasks();
  const handleLongPress = () => {
    if (task.status === 'done') return;
    Vibration.vibrate(100);
    setShowActions(!showActions);
  };

  const handleCompleteTask = (task: TaskType) => {
    updateTask(task.taskId, { ...task, status: 'done' });
    setShowActions(false);
  };

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        setShowActions(false);
      }}
    >
      <Pressable
        onLongPress={handleLongPress}
        onHoverOut={() => setShowActions(false)}
      >
        <YStack
          backgroundColor={
            showActions
              ? '$color1'
              : task.status !== 'done'
                ? '$color2'
                : '$active'
          }
          padding='$4'
          borderRadius='$4'
          gap='$2'
          borderColor='$borderColor'
          borderWidth='$0.25'
          marginBlock='$2'
        >
          <XStack alignItems='center' justifyContent='space-between'>
            <H4 color={task.status === 'done' ? 'gray' : '$color'}>
              {task.title}
            </H4>
            <View
              gap='$2'
              display='flex'
              flexDirection='row'
              alignItems='center'
            >
              <MwlBadge load={task.difficulty} />
              <PriorityBadge priority={task.priority} />
            </View>
          </XStack>
          {!showActions ? (
            <YStack gap='$2'>
              <Text color='$gray10'>{task.description}</Text>
              <Text color='$blue8'>
                {task.startDate?.toDate().toDateString()}
              </Text>
            </YStack>
          ) : (
            <YStack gap='$2'>
              <Button
                onPress={() => handleCompleteTask(task)}
                backgroundColor='$green4'
              >
                <Text color='white'>Complete Task</Text>
                <Feather name='check-circle' color='white' />
              </Button>
              <Button theme='purple'>
                <Text color='white'>Reschedule</Text>
                <Feather name='calendar' color='white' />
              </Button>
              <Button theme='red'>
                <Text color='white'>Delete</Text>
                <Feather name='trash' color='white' />
              </Button>
            </YStack>
          )}
        </YStack>
      </Pressable>
    </OutsidePressHandler>
  );
};

export default TaskCard;
