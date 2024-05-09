import React from "react";
import { View, Text } from "../Themed";

export type TaskType = {
  bucket: string;
  title: string;
  description: string;
  status: "done" | "pending" | "overdue";
  mentalWorkload: number;
  dueDate: string;
  priority: "high" | "medium" | "low";
};

const TaskCard = ({
  bucket,
  title,
  description,
  status,
  dueDate,
  priority,
}: TaskType) => {
  return (
    <View className="bg-gray-50 p-4 border border-gray-200 rounded-md w-full my-2">
      <Text className="text-gray-400 text-xs">{bucket}</Text>
      <Text className="text-lg font-medium">{title}</Text>
      <Text className="text-sm text-gray-800">{description}</Text>
      <View className="flex flex-row gap-2 justify-between ">
        <Text className="text-xs text-gray-400">{dueDate}</Text>
        <Text className="text-xs text-gray-400">{priority}</Text>
      </View>
    </View>
  );
};

export default TaskCard;
