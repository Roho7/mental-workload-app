import { Feather } from '@expo/vector-icons';
import { Icon } from '@expo/vector-icons/build/createIconSet';
import clsx from 'clsx';
import React from 'react';
import { View, Text } from 'react-native';

type PriorityType = {
  color: string;
  text: string;
  icon: any;
};

export const PriorityMap: Record<number, PriorityType> = {
  4: {
    color: 'bg-red-500',
    text: 'Urgent',
    icon: 'alert-circle',
  },
  3: {
    color: 'bg-orange-500',
    text: 'High',
    icon: 'chevrons-up',
  },
  2: {
    color: 'bg-yellow-500',
    text: 'Medium',
    icon: 'chevron-up',
  },
  1: {
    color: 'bg-green-500',
    text: 'Low',
    icon: 'chevron-down',
  },
  0: {
    color: 'bg-gray-300',
    text: 'No Priority',
    icon: 'minus',
  },
};

type Props = {
  priority: number;
};

const PriorityBadge = ({ priority }: Props) => {
  return (
    <View
      className={clsx(
        PriorityMap[priority].color,
        'flex h-4 w-4 items-center justify-center rounded-md'
      )}
    >
      <Feather name={PriorityMap[priority].icon} size={12} color="white" />
    </View>
  );
};

export default PriorityBadge;
