import { View, Text, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dropdown from '@/components/ui/Dropdown';
import PriorityBadge, { PriorityMap } from '@/components/ui/PriorityBadge';

const AddTask = () => {
  const [priority, setPriority] = useState(0);
  return (
    <SafeAreaView className="bg-gray-50 px-4 py-2" style={{ rowGap: 10 }}>
      <TextInput placeholder="New Task" className="text-4xl" />
      <TextInput
        placeholder="Description"
        numberOfLines={4}
        multiline={true}
        style={{ height: 100 }}
        className="rounded-md bg-gray-100 p-2 text-lg"
      />
      <Dropdown
        elements={[0, 1, 2, 3, 4].map((item) => {
          return (
            <Pressable
              className="flex flex-row items-center rounded-md p-2 hover:bg-gray-100"
              style={{ columnGap: 8 }}
              onPress={() => {
                setPriority(item);
              }}
            >
              <PriorityBadge priority={item} />
              <Text>{PriorityMap[item].text}</Text>
            </Pressable>
          );
        })}
      >
        <View className="flex flex-row items-center" style={{ columnGap: 8 }}>
          <PriorityBadge priority={priority} />
          <Text>{PriorityMap[priority].text}</Text>
        </View>
      </Dropdown>
    </SafeAreaView>
  );
};

export default AddTask;
