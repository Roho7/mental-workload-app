import { useTasks } from '@/components/hooks/useTasks';
import DonutChart from '@/components/ui/DonutChart';
import React from 'react';
import { Text, View, YStack } from 'tamagui';
import MwlFeedbackLabel from '../MwlFeedbackLabel';

const DonutCard = () => {
  const { todaysApproximateMWL } = useTasks();
  return (
    <YStack
      borderColor='$blue4'
      borderWidth='$1'
      backgroundColor='$background075'
      borderRadius='$8'
      padding='$4'
    >
      <YStack>
        <Text fontSize={10} color='$blue10'>
          Today
        </Text>
        <Text>Productivity</Text>
      </YStack>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MwlFeedbackLabel mwl={todaysApproximateMWL.avg} />

        <DonutChart />
      </View>
    </YStack>
  );
};

export default DonutCard;
