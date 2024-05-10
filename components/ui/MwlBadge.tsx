import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { View, Text } from 'react-native';

type MwlType = {
  color: string;
  text: string;
  icon: JSX.Element;
};

const MwlMap: Record<number, MwlType> = {
  5: {
    color: 'text-red-500',
    text: 'Overload',
    icon: <FontAwesome5 name="brain" color="#DC2626" size={12} />,
  },
  4: {
    color: 'text-rose-400',
    text: 'High Load',
    icon: <FontAwesome5 name="brain" color="#FB7185" size={12} />,
  },
  3: {
    color: 'text-amber-400',
    text: 'Medium Load',
    icon: <FontAwesome5 name="brain" color="#F59E0B" size={12} />,
  },
  2: {
    color: 'text-emerald-400',
    text: 'Light Load',
    icon: <FontAwesome5 name="brain" color="#34D399" size={12} />,
  },
  1: {
    color: 'text-lime-400',
    text: 'No Load',
    icon: <FontAwesome5 name="brain" color="#BEF264" size={12} />,
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
      {MwlMap[load]?.icon}
      <Text className={MwlMap[load].color}>{load}</Text>
    </View>
  );
};

export default MwlBadge;
