import { Feather } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { View, Text } from 'react-native';

type PriorityType = {
  color: string;
  text: string;
  icon: JSX.Element;
};

const PriorityMap: Record<number, PriorityType> = {
  4: {
    color: 'bg-red-500',
    text: 'Urgent',
    icon: <Feather name="alert-circle" color="white" size={12} />,
  },
  3: {
    color: 'bg-orange-500',
    text: 'High',
    icon: <Feather name="chevrons-up" color="white" size={12} />,
  },
  2: {
    color: 'bg-yellow-500',
    text: 'Medium',
    icon: <Feather name="chevron-up" color="white" size={12} />,
  },
  1: {
    color: 'bg-green-500',
    text: 'Low',
    icon: <Feather name="chevron-down" color="white" size={12} />,
  },
  0: {
    color: 'bg-gray-300',
    text: 'No Priority',
    icon: <Feather name="minus" color="white" size={12} />,
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
      {PriorityMap[priority].icon}
    </View>
  );
};

export default PriorityBadge;
