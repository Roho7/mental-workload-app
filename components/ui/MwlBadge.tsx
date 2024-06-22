import { FontAwesome5 } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Text, View } from 'tamagui';

export type MwlType = {
  color: string;
  text: string;
  icon: string;
  iconColor?: string;
  feedbackText: string;
};

export const MwlMap: Record<number, MwlType> = {
  5: {
    color: '#EA5757',
    text: 'Overload',
    icon: 'brain',
    iconColor: '#DC2626',
    feedbackText: 'Overload!',
  },
  4: {
    color: '#F97316',
    text: 'High Load',
    icon: 'brain',
    iconColor: '#FB7185',
    feedbackText: 'One of those tough days',
  },
  3: {
    color: '#34C51E',
    text: 'Medium Load',
    icon: 'brain',
    iconColor: '#F59E0B',
    feedbackText: 'Perfect balance',
  },
  2: {
    color: '#A1DF3B',
    text: 'Light Load',
    icon: 'brain',
    iconColor: '#34D399',
    feedbackText: 'Breezier than usual',
  },
  1: {
    color: '#82E9B2',
    text: 'No Load',
    icon: 'brain',
    iconColor: '#BEF264',
    feedbackText: 'Not enough challenge',
  },
};

type Props = {
  load: number;
};

const MwlBadge = ({ load }: Props) => {
  return (
    <View
      className={clsx(
        'flex max-w-min flex-row items-center justify-center rounded-md p-0.5'
      )}
      style={{ columnGap: 2 }}
    >
      <FontAwesome5
        name={MwlMap[load]?.icon || 'brain'}
        color={MwlMap[load]?.iconColor || 'white'}
        size={12}
      />
      <Text color={MwlMap[load].color}>{load}</Text>
    </View>
  );
};

export default MwlBadge;
