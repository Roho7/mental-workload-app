import React from 'react';
import { SafeAreaView } from 'react-native';
import { H3, Tabs, Text } from 'tamagui';
import DailyMentalWorkloadScreen from './DailyMwl';
import HourlyMentalWorkloadScreen from './HourlyMwl';

const MwlTabLayout = () => {
  return (
    <SafeAreaView
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        flexGrow: 1,
        height: '100%',
        width: '100%',
        paddingHorizontal: 4,
        backgroundColor: 'black',
      }}
    >
      <H3 marginBottom='$4' width='100%' textAlign='left'>
        Mental Workload
      </H3>
      <Tabs
        defaultValue='tab1'
        orientation='horizontal'
        flexDirection='column'
        width={400}
        height='97%'
        overflow='hidden'
        unstyled
        borderColor='$colorTransparent'
      >
        <Tabs.List aria-label='See your mental workload distribution'>
          <Tabs.Tab flex={1} value='tab1'>
            <Text>Daily</Text>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value='tab2'>
            <Text>Hourly</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value='tab1' flex={1} height='100vh'>
          <DailyMentalWorkloadScreen />
        </Tabs.Content>

        <Tabs.Content value='tab2' flex={1}>
          <HourlyMentalWorkloadScreen />
        </Tabs.Content>
      </Tabs>
    </SafeAreaView>
  );
};

export default MwlTabLayout;
