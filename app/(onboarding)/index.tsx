import { useAuth } from '@/components/hooks/useAuth';
import { db } from '@/utils/firebase';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState, useTransition } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, H4, H5, Text, XStack, YStack } from 'tamagui';

const OnboardingMap: Record<number, any> = {
  1: {
    title:
      'On a scale of 1-5, how mentally demanding do you find your typical workday?',
    key: 'mentalDemand',
    options: [1, 2, 3, 4, 5],
  },
  2: {
    title: 'What time of day do you usually feel most productive?',
    key: 'productiveTime',
    options: ['Morning', 'Afternoon', 'Evening'],
  },
  3: {
    title: 'Do you regularly engage in multitasking?',
    key: 'multitasking',
    options: ['Yes', 'No'],
  },
  4: {
    title: 'What types of tasks do you find most mentally challenging?',
    key: 'mostMentallyChallengingTasks',
    options: [
      'Problem Solving (e.g. Coding)',
      'Creative Work (e.g. Writing)',
      'Household Chores (e.g. Cooking)',
      'Repetitive Tasks (e.g. Filling out forms)',
      'Physical Labor (e.g. Gym)',
    ],
  },
};

const Onboarding = () => {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({
    mentalDemand: 0,
    productiveTime: '',
    multitasking: false,
    mostMentallyChallengingTasks: [],
  });

  const handleSubmitOnboarding = () => {
    startTransition(() => {
      const taskRef = collection(db, `tbl_users/${user?.uid}/preferences`);
      addDoc(taskRef, onboardingData)
        .catch((error) => {
          console.error('Error updating document: ', error);
          // Optionally, handle error and revert state if necessary
        })
        .finally(() => {
          // Redirect to the dashboard
          router.push('/(protected)');
        });
    });
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: 'black', flex: 1, flexGrow: 1, height: '100%' }}
    >
      <YStack
        padding='$4'
        alignItems='center'
        justifyContent='center'
        marginBlock='auto'
        gap='$4'
        height='100%'
      >
        <XStack gap='$2' alignItems='center'>
          <H5>Just a few more questions</H5>
          <Text color='$gray10'>#{onboardingStep}</Text>
        </XStack>
        <Card padding='$4' gap='$4'>
          <H4 color='$accentBackground'>
            {OnboardingMap[onboardingStep].title}
          </H4>
          <XStack
            gap='$2'
            justifyContent='space-between'
            width='100%'
            flexWrap='wrap'
          >
            {OnboardingMap[onboardingStep].options.map((option: any) => {
              return (
                <Button
                  key={option}
                  backgroundColor={
                    OnboardingMap[onboardingStep].key ===
                    'mostMentallyChallengingTasks'
                      ? onboardingData[
                          OnboardingMap[onboardingStep].key
                        ]?.includes(option)
                        ? '$color7'
                        : '$active'
                      : onboardingData[OnboardingMap[onboardingStep].key] ===
                          option
                        ? '$color7'
                        : '$active'
                  }
                  onPress={() => {
                    if (
                      OnboardingMap[onboardingStep].key ===
                      'mostMentallyChallengingTasks'
                    ) {
                      setOnboardingData((prevOnboardingData) => {
                        const currentKey = OnboardingMap[onboardingStep].key;
                        const currentOptions =
                          prevOnboardingData[currentKey] || [];

                        const optionExists = currentOptions.includes(option);

                        const updatedOptions = optionExists
                          ? currentOptions.filter(
                              (item: any) => item !== option
                            )
                          : [...currentOptions, option]; // Add the option if it does not exist

                        // Return the updated state
                        return {
                          ...prevOnboardingData,
                          [currentKey]: updatedOptions,
                        };
                      });
                    } else {
                      setOnboardingData({
                        ...onboardingData,
                        [OnboardingMap[onboardingStep].key]: option,
                      });
                    }
                  }}
                >
                  <Text>{option}</Text>
                </Button>
              );
            })}
          </XStack>
        </Card>

        {onboardingStep < 4 ? (
          <XStack marginBlock='$4' flex={1} gap='$2'>
            {onboardingStep > 1 && (
              <Button
                onPress={() => setOnboardingStep(onboardingStep - 1)}
                flex={1}
              >
                Back
              </Button>
            )}
            <Button
              onPress={() => setOnboardingStep(onboardingStep + 1)}
              flex={1}
            >
              Next
            </Button>
          </XStack>
        ) : (
          <Button onPress={handleSubmitOnboarding} width='100%'>
            Finish
          </Button>
        )}
      </YStack>
    </SafeAreaView>
  );
};

export default Onboarding;
