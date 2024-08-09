import { useTasks } from '@/components/hooks/useTasks';
import { chartConfig } from '@/components/ui/Graph';
import { TaskType } from '@/constants/types';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text, View, YStack } from 'tamagui';

const HourlyMentalWorkloadScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { todaysTasks } = useTasks();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const startTime = new Date().setHours(0, 0, 0, 0);
  const endTime = Math.max(
    ...todaysTasks.map(
      (event) => new Date(event.endDate?.toMillis() || 0).getTime() || 0
    )
  );
  // const totalDuration = endTime - startTime;
  const totalDuration = 60 * 60 * 1000 * 24; // 24 hours in milliseconds

  const pixelsPerHalfHour = 75; // Adjust this value to change the scale
  const halfHoursInTimeline = 48; // 24 hours * 2 (for half-hourly)

  const calculateContentWidth = () => {
    const width = halfHoursInTimeline * pixelsPerHalfHour;
    setContentWidth(width);
    return width;
  };

  useEffect(() => {
    calculateContentWidth();
    scrollViewRef.current?.scrollTo({
      x: getEventStyle(todaysTasks[0]).left,
      y: 0,
    });
  }, [todaysTasks]);

  const formatTime = (timestamp: any) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateVerticalPositions = (events: TaskType[]) => {
    const sortedEvents = [...events].sort(
      (a, b) => (a.startDate?.toMillis() || 0) - (b.startDate?.toMillis() || 0)
    );

    const positions = new Map();
    const occupied: any[] = [];

    sortedEvents.forEach((event) => {
      const startTime = event.startDate?.toMillis() || 0;
      const endTime = event.endDate?.toMillis() || 0;

      let level = 0;
      while (occupied[level] && occupied[level] > startTime) {
        level++;
      }

      positions.set(event, level);
      occupied[level] = endTime;
    });

    return positions;
  };

  const verticalPositions = useMemo(
    () => calculateVerticalPositions(todaysTasks),
    [todaysTasks]
  );

  const getEventStyle = (event: TaskType) => {
    const left =
      (((event.startDate?.toMillis() || 1) - startTime) / totalDuration) *
      contentWidth;
    const width =
      (((event.endDate?.toMillis() || 1) - (event.startDate?.toMillis() || 1)) /
        totalDuration) *
      contentWidth;
    const top = 30 + (verticalPositions.get(event) || 0) * 85; // 80px height + 5px gap
    return { left, width, top };
  };

  const renderTimeAxis = () => {
    const timeMarkers = [];
    const markerInterval = 30 * 60 * 1000; // 30 mins in milliseconds
    let currentTime = new Date(startTime);
    currentTime.setMinutes(0, 0, 0); // Round to the nearest hour

    while (currentTime.getTime() <= totalDuration + startTime) {
      const markerPosition =
        ((currentTime.getTime() - startTime) / totalDuration) * contentWidth;
      timeMarkers.push(
        <View
          key={currentTime.getTime()}
          style={[styles.timeMarker, { left: markerPosition }]}
        >
          <Text style={styles.timeMarkerText}>{formatTime(currentTime)}</Text>
        </View>
      );
      currentTime = new Date(currentTime.getTime() + markerInterval);
    }

    return timeMarkers;
  };
  const halfHourlyMwlData = useMemo(() => {
    const multipliersMap: Record<string, any> = {
      difficulty: { 1: 1, 2: 1.2, 3: 1.5, 4: 1.7, 5: 2 },
      priority: { 0: 1, 1: 1.2, 2: 1.5, 3: 1.7, 4: 2 },
    };
    const halfHourlyData: number[] = new Array(48).fill(0);

    todaysTasks.forEach((task, taskIndex) => {
      const taskStartTime = new Date(task.startDate?.toMillis() || 0);
      const previousTaskEndTime = new Date(
        todaysTasks[taskIndex - 1]?.startDate?.toMillis() || 0
      );
      const taskEndTime = new Date(task.endDate?.toMillis() || 0);
      const difficultyMultiplier =
        multipliersMap.difficulty[task.difficulty] || 1;
      const priorityMultiplier = multipliersMap.priority[task.priority] || 1;
      const gapMultiplier =
        previousTaskEndTime.getHours() - taskStartTime.getHours() < 1
          ? 0.5
          : 1.2;
      const startIndex =
        taskStartTime.getHours() * 2 +
        Math.floor(taskStartTime.getMinutes() / 30);
      const endIndex =
        taskEndTime.getHours() * 2 + Math.ceil(taskEndTime.getMinutes() / 30);

      for (let i = startIndex; i < endIndex; i++) {
        halfHourlyData[i] +=
          1 * difficultyMultiplier * priorityMultiplier * gapMultiplier;
      }
    });

    // Apply the additional logic for nearby tasks
    halfHourlyData.forEach((value, index) => {
      if (value > 0 && halfHourlyData[index + 4] > 0) {
        halfHourlyData[index + 2] += 2;
        halfHourlyData[index + 3] += 1;
      }
      if (value > 4) {
        halfHourlyData[index] = 4;
      }
    });

    return halfHourlyData;
  }, [todaysTasks]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 16 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={[
          styles.scrollContent,
          { width: contentWidth, height: '100%' },
        ]}
      >
        <YStack
          style={{
            marginLeft: 63,
            position: 'relative',
          }}
        >
          {renderTimeAxis()}

          {todaysTasks.map((event, index) => (
            <View key={index} style={[styles.eventCard, getEventStyle(event)]}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>
                {moment(event.startDate?.toDate()).format('HH:mmA')} -{' '}
                {moment(event.endDate?.toDate()).format('HH:mmA')}
              </Text>
            </View>
          ))}
        </YStack>
        {halfHourlyMwlData.map((item, index) => {
          return (
            <View
              key={index}
              backgroundColor={
                item > 3
                  ? '$orange1'
                  : index % 2 === 0
                    ? '$background05'
                    : '$background075'
              }
              style={{
                position: 'absolute',
                left: index * (contentWidth / 48),
                zIndex: -1,
                height: '100%',
                width: 63,
                // opacity: item > 3 ? 0.2 : 1,
              }}
            ></View>
          );
        })}

        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: halfHourlyMwlData,
              },
              {
                data: [4],
              },
            ],
          }}
          width={contentWidth + 63} // from react-native
          height={260}
          yAxisLabel=''
          formatYLabel={(value) => Math.floor(parseInt(value)).toString()}
          yAxisSuffix=''
          yAxisInterval={1} // optional, defaults to 1
          style={{
            padding: 0,
            // marginLeft: -40,
          }}
          chartConfig={chartConfig}
          fromZero
          bezier
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  eventCard: {
    position: 'absolute',
    top: 30,
    height: 80,
    backgroundColor: '#3498db',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventTime: {
    color: '#fff',
    fontSize: 12,
  },
  timeMarker: {
    position: 'absolute',
    top: 0,
    height: 30,
    backgroundColor: '#fff',
  },
  timeMarkerText: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 12,
    color: '#fff',
  },
});
export default HourlyMentalWorkloadScreen;

// <View position='relative'>{renderTimeAxis()}</View>
// {todaysTasks.map((event, index) => (
//   <View key={index} style={[styles.eventCard, getEventStyle(event)]}>
//     <Text style={styles.eventTitle}>{event.title}</Text>
//     <Text style={styles.eventTime}>
//       {/* {moment(event.startDate?.toDate()).format('HH:mm')} -{' '}
//       {moment(event.endDate?.toDate()).format('HH:mm')} */}
//     </Text>
//   </View>
// ))}
