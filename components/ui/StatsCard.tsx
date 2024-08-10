import React, { CSSProperties } from 'react';

import { StyleProp } from 'react-native';
import { View } from 'tamagui';

type Props = {
  color: string;
  children: React.ReactNode;
  style?: StyleProp<CSSProperties>;
  badge?: React.ReactNode;
};

const StatsCard = ({ color, children, style, badge }: Props) => {
  return (
    <View
      borderColor={`$${color}10`}
      borderWidth='$1'
      padding='$4'
      width='50%'
      height='$12'
      backgroundColor={`$${color}3`}
      borderRadius='$6'
      position='relative'
      style={style}
    >
      <View style={{ position: 'absolute', right: 12, top: 12 }}>{badge}</View>
      {children}
    </View>
  );
};

export default StatsCard;
