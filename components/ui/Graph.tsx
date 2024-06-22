import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { View } from 'tamagui';

type GraphProps = {
  interval: string;
};

const chartConfig = {
  backgroundGradientFrom: '#0362FF',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  borderRadius: 20,
  color: (opacity = 1) => `rgba(3, 98, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(144, 144, 144, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  propsForDots: {
    r: '2',
    strokeWidth: '2',
    stroke: '#fff',
  },
};

const dailyLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'];
const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Graph = ({ interval }: GraphProps) => {
  return (
    <View
      borderWidth="$1"
      borderColor="$borderColor"
      borderRadius="$8"
      overflow="hidden"
    >
      <LineChart
        data={{
          labels:
            interval === 'daily'
              ? dailyLabels
              : interval === 'monthly'
                ? monthlyLabels
                : weeklyLabels,
          datasets: [
            {
              data: [
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 5),
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // from react-native
        height={260}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export default Graph;
