import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';
import { useTasks } from '../hooks/useTasks';

const radius = 40;
const strokeWidth = 7;
const circumference = 2 * Math.PI * radius;

function DonutChart() {
  const { completedTasks, todaysTasks } = useTasks();
  const progress = useMemo(
    () =>
      todaysTasks.length > 0 ? completedTasks.length / todaysTasks.length : 0,
    [completedTasks, todaysTasks]
  );

  const isCompleted = useMemo(
    () =>
      completedTasks.length === todaysTasks.length && todaysTasks.length > 0,
    [completedTasks, todaysTasks]
  );
  return (
    <View style={{ height: 200, position: 'relative' }}>
      <Svg width="200" height="200" viewBox="0 0 100 100">
        <Circle
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={'#1F2839'}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 100}
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
          strokeDashoffset={circumference * (1 - progress)}
          transform="rotate(-90, 50, 50)"
        />

        {!isCompleted ? (
          <Text x="50%" y="48%" textAnchor="middle" fill="grey" dy=".2em">
            {todaysTasks.length - completedTasks.length}
          </Text>
        ) : (
          <Text x="50%" y="45%" textAnchor="middle" fill="grey" dy=".2em">
            🎊
          </Text>
        )}

        <Text
          x="50%"
          y="56%"
          textAnchor="middle"
          fill={isCompleted ? '#34D399' : 'grey'}
          dy=".2em"
          fontSize={4}
        >
          {isCompleted ? "You're done for the day!" : 'tasks remaining'}
        </Text>
      </Svg>
    </View>
  );
}

export default DonutChart;
