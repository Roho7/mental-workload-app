import { PriorityMap } from '@/constants/TaskParameters';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { XStack } from 'tamagui';

type Props = {
  priority: number;
};

const PriorityBadge = ({ priority }: Props) => {
  return (
    <XStack
      backgroundColor={PriorityMap[priority].color}
      borderRadius={999}
      justifyContent='center'
      alignItems='center'
      height={16}
      width={16}
    >
      <Feather name={PriorityMap[priority].icon} size={12} color='white' />
    </XStack>
  );
};

export default PriorityBadge;
