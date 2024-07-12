import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { XStack } from 'tamagui';

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
export const DifficultyMap: Record<number, any> = {
  5: {
    color: '#EA5757',
    text: 'Quite Difficult',
    icon: 'flushed',
    iconColor: '#DC2626',
  },
  4: {
    color: '#F97316',
    text: 'Difficult',
    icon: 'grin-beam-sweat',
    iconColor: '#FB7185',
  },
  3: {
    color: '#34C51E',
    text: 'Doable',
    icon: 'smile-wink',
    iconColor: '#F59E0B',
  },
  2: {
    color: '#A1DF3B',
    text: 'Easy',
    icon: 'meh',
    iconColor: '#34D399',
  },
  1: {
    color: '#82E9B2',
    text: 'Very easy',
    icon: 'meh-rolling-eyes',
    iconColor: '#BEF264',
  },
};

type Props = {
  load: number;
};

const DifficultyBadge = ({ load }: Props) => {
  return (
    load && (
      <XStack
        justifyContent='center'
        alignItems='center'
        borderRadius={4}
        padding={0.5}
        maxWidth='min-content'
        style={{ columnGap: 2 }}
      >
        <FontAwesome5
          name={DifficultyMap[load]?.icon || 'muscle'}
          color={'white'}
          size={16}
        />
      </XStack>
    )
  );
};

export default DifficultyBadge;
