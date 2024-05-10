import React, { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';

const radius = 30;
const strokeWidth = 7;
const circumference = 2 * Math.PI * radius;
const progress = 0.75; // Assuming 75% progress

// Calculate the offset to start from the top
const progressPercentage = circumference * (1 - progress);

function DonutChart() {
  return (
    <View style={{ height: 200 }} className="relative">
      <Svg width="200" height="200" viewBox="0 0 100 100" className="">
        <Circle
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={'#F3F4F6'}
          cx="50"
          cy="50"
          r={radius + 10}
          fill="transparent"
          transform="rotate(-90, 50, 50)"
        />
        <Circle
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={'#34D399'}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressPercentage}
          transform="rotate(-90, 50, 50)"
        />
        <Circle
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={'#0362FF'}
          cx="50"
          cy="50"
          r={radius + 10}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressPercentage}
          transform="rotate(-90, 50, 50)"
        />

        <Text x="50%" y="48%" textAnchor="middle" fill="#000" dy=".2em">
          3/5
        </Text>
        <Text
          x="50%"
          y="56%"
          textAnchor="middle"
          fill="#000"
          dy=".2em"
          fontSize={4}
        >
          tasks remaining
        </Text>
      </Svg>
    </View>
  );
}

export default DonutChart;
