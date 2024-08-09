import { useTasks } from '@/components/hooks/useTasks';
import DonutChart from '@/components/ui/DonutChart';
import React from 'react';
import { Text, View } from 'tamagui';
import MwlFeedbackLabel from '../MwlFeedbackLabel';

const DonutCard = () => {
  const { todaysApproximateMWL } = useTasks();
  return (
    <View
      borderColor='$blue4'
      borderWidth='$1'
      backgroundColor='$background075'
      borderRadius='$8'
      padding='$4'
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>
        <MwlFeedbackLabel mwl={todaysApproximateMWL.avg} />
      </Text>
      <DonutChart />
    </View>
  );
};

export default DonutCard;
