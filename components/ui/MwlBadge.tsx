import { FontAwesome5 } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Text, View } from 'react-native';

type MwlType = {
  color: string;
  text: string;
  icon: string;
  iconColor?: string;
};

export const MwlMap: Record<number, MwlType> = {
  5: {
    color: 'text-red-500',
    text: 'Overload',
    icon: 'brain',
    iconColor: '#DC2626',
  },
  4: {
    color: 'text-rose-400',
    text: 'High Load',
    icon: 'brain',
    iconColor: '#FB7185',
  },
  3: {
    color: 'text-amber-400',
    text: 'Medium Load',
    icon: 'brain',
    iconColor: '#F59E0B',
  },
  2: {
    color: 'text-emerald-400',
    text: 'Light Load',
    icon: 'brain',
    iconColor: '#34D399',
  },
  1: {
    color: 'text-lime-400',
    text: 'No Load',
    icon: 'brain',
    iconColor: '#BEF264',
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
      <Text className={MwlMap[load]?.color}>{load}</Text>
    </View>
  );
};

export default MwlBadge;
