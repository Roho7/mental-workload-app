import { Timestamp } from 'firebase/firestore';
import React from 'react';

import { H4, Text, View, XStack, YStack } from 'tamagui';
import MwlBadge from './MwlBadge';
import PriorityBadge from './PriorityBadge';

export type TaskType = {
  bucket?: string;
  title: string;
  description: string;
  status?: 'done' | 'pending' | 'overdue';
  mwl: number;
  due_date: Timestamp;
  priority: 1 | 2 | 3 | 4 | 0;
};

const TaskCard = ({
  bucket,
  title,
  description,
  status,
  due_date,
  priority,
  mwl,
}: TaskType) => {
  return (
    <YStack
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
      gap="$2"
      borderColor="$blue7"
      borderWidth="$0.25"
      marginBlock="$2"
    >
      {bucket && <Text color="$placeholderColor">{bucket}</Text>}
      <XStack alignItems="center" justifyContent="space-between">
        <H4>{title}</H4>
        <View gap="$2" display="flex" flexDirection="row" alignItems="center">
          <MwlBadge load={mwl} />
          <PriorityBadge priority={priority} />
        </View>
      </XStack>
      <Text color="$gray10">{description}</Text>
      <View gap="$2" display="flex" flexDirection="row">
        <Text color="$blue8">{due_date?.toDate().toDateString()}</Text>
      </View>
    </YStack>
  );
};

export default TaskCard;
