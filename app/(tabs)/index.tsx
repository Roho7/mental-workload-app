import DonutChart from "@/components/Dashboard/DonutChart";
import { Text, View } from "@/components/Themed";
import { Button, Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";

export default function TabOneScreen() {
  return (
    <SafeAreaView className=" bg-slate-50 h-full p-4 flex flex-col gap-4">
      <View className="bg-transparent">
        <Text className="text-4xl text-gray-800">Hi Roho!</Text>
        <Text className="text-gray-400 text-sm">
          You have 5 tasks remaining today
        </Text>
        <Pressable>
          <Feather name="sun" />
        </Pressable>
      </View>
      <View className="border border-gray-200 rounded-lg p-4">
        <Text className="text-2xl">Your Day</Text>
        <View className="flex flex-col items-center justify-center">
          <Text className="text-green-500">Smooth Sailing</Text>
          <DonutChart />
        </View>
      </View>
    </SafeAreaView>
  );
}
