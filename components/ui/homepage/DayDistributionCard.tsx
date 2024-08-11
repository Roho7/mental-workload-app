import { useTasks } from '@/components/hooks/useTasks';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';

type WeekMwlType = { day: string; mwl: number };

export const weekMap: Record<number, WeekMwlType> = {
  0: { day: 'Sun', mwl: 2 },
  1: { day: 'Mon', mwl: 3 },
  2: { day: 'Tue', mwl: 6 },
  3: { day: 'Wed', mwl: 3 },
  4: { day: 'Thu', mwl: 1 },
  5: { day: 'Fri', mwl: 3 },
  6: { day: 'Sat', mwl: 4 },
};
const dayMap: Record<number, any> = {
  0: { name: 'morning', icon: <Feather name='sunrise' /> },
  1: { name: 'afternoon', icon: <Feather name='sun' /> },
  2: { name: 'evening', icon: <Feather name='moon' /> },
};
const DayDistributionCard = () => {
  const { todaysTasks, todaysApproximateMWL } = useTasks();

  const mwlDistribution = [0, 0, 0];

  todaysApproximateMWL.values.forEach((value, index) => {
    if (index < 16) {
      mwlDistribution[0] += value;
    } else if (index < 32) {
      mwlDistribution[1] += value;
    } else {
      mwlDistribution[2] += value;
    }
  });

  return (
    <View
      borderColor='$blue4'
      borderWidth='$1'
      backgroundColor='$background075'
      borderRadius='$8'
      padding='$4'
      gap='$4'
    >
      <YStack>
        <Text fontSize={10} color='$blue10'>
          Today
        </Text>
        <Text>MWL Distribution</Text>
      </YStack>
      <YStack alignItems='center' justifyContent='center'>
        <XStack gap='$4'>
          {[0, 1, 2].map((item: number) => {
            return (
              <YStack key={item} gap='$2' alignItems='center'>
                <View
                  width='$10'
                  height='$14'
                  borderRadius='$4'
                  backgroundColor='$blue5'
                  padding='$1'
                >
                  <View
                    marginTop='auto'
                    style={{
                      height: `${Math.min(mwlDistribution[item] * 10, 100)}%`,
                    }}
                    borderRadius='$4'
                    backgroundColor='$blue10'
                  ></View>
                </View>
                <YStack alignItems='center'>
                  <Text
                  // color={weekMap[item].day === today ? '$blue11' : '$gray10'}
                  >
                    {dayMap[item].icon}
                  </Text>
                  <Text color='$gray10' fontSize={10}>
                    {dayMap[item].name}
                  </Text>
                </YStack>
              </YStack>
            );
          })}
        </XStack>
      </YStack>
    </View>
  );
};

export default DayDistributionCard;
