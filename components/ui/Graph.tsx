import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { View } from 'tamagui';
import { useTasks } from '../hooks/useTasks';

type GraphProps = {
  interval: string;
  date: moment.Moment | null;
  range: { start: moment.Moment | null; end: moment.Moment | null };
};

export const chartConfig = {
  backgroundGradientFrom: '#0362FF',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  borderRadius: 20,
  color: (opacity = 1) => `rgba(3, 98, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(144, 144, 144, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
  propsForDots: {
    r: '2',
    strokeWidth: '2',
    stroke: '#fff',
  },
  propsForVerticalLabels: {},
};

const dailyLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'];
const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Graph = ({ interval, date, range }: GraphProps) => {
  const { mwlObject } = useTasks();

  const weekMWLMap = useMemo(() => {
    const startOfWeek = date?.clone().startOf('isoWeek');
    const weekMWLArray = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek
        ?.clone()
        .add(i, 'days')
        .format('DD-MM-YYYY');

      if (mwlObject.current[currentDay || '']) {
        weekMWLArray.push(mwlObject.current[currentDay || ''].mwl);
      } else {
        weekMWLArray.push(0); // Default MWL value if not present in data
      }
    }

    return weekMWLArray;
  }, [date, range]);

  return (
    <View
      borderWidth='$1'
      borderColor='$borderColor'
      borderRadius='$8'
      overflow='hidden'
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
              data: weekMWLMap,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // from react-native
        height={260}
        yAxisLabel=''
        yAxisSuffix=''
        yAxisInterval={2} // optional, defaults to 1
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export default Graph;
