import React, { useState } from 'react';
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
const WeeklyCard = () => {
  const [today, setToday] = useState(weekMap[new Date().getDay()].day);

  return (
    <View
      borderColor="$blue4"
      borderWidth="$1"
      backgroundColor="$background075"
      borderRadius="$8"
      padding="$4"
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View className="flex flex-col items-center justify-center">
        <XStack gap="$4">
          {[0, 1, 2, 3, 4, 5, 6].map((item: number) => {
            return (
              <YStack key={item} gap="$2" alignItems="center">
                <View
                  width="$1"
                  height="$14"
                  borderRadius="$4"
                  backgroundColor="$blue5"
                  padding="$1"
                >
                  <View
                    marginTop="auto"
                    style={{ height: `${weekMap[item].mwl * 10}%` }}
                    borderRadius="$4"
                    backgroundColor="$blue10"
                  ></View>
                </View>
                <Text
                  color={weekMap[item].day === today ? '$blue11' : '$gray10'}
                >
                  {weekMap[item].day}
                </Text>
              </YStack>
            );
          })}
        </XStack>
      </View>
    </View>
  );
};

export default WeeklyCard;
