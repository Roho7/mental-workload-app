import React from 'react';
import { View, Text } from '../Themed';
import PriorityBadge from './PriorityBadge';
import MwlBadge from './MwlBadge';

export type TaskType = {
  bucket: string;
  title: string;
  description: string;
  status: 'done' | 'pending' | 'overdue';
  mentalWorkload: number;
  dueDate: string;
  priority: 1 | 2 | 3 | 4 | 0;
};

const TaskCard = ({
  bucket,
  title,
  description,
  status,
  dueDate,
  priority,
  mentalWorkload,
}: TaskType) => {
  return (
    <View className="my-2 w-full rounded-md border border-gray-200 bg-gray-50 p-4">
      <Text className="text-xs text-gray-400">{bucket}</Text>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-lg font-medium">{title}</Text>
        <View className="flex flex-row items-center" style={{ columnGap: 4 }}>
          <MwlBadge load={mentalWorkload} />
          <PriorityBadge priority={priority} />
        </View>
      </View>
      <Text className="text-sm text-gray-800">{description}</Text>
      <View className="flex flex-row justify-between gap-2 ">
        <Text className="text-xs text-gray-400">{dueDate}</Text>
        <Text className="text-xs text-gray-400">{priority}</Text>
      </View>
    </View>
  );
};

export default TaskCard;
