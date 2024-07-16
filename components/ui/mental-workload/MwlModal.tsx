import { useTasks } from '@/components/hooks/useTasks';
import { AIMwlReturnType } from '@/functions/src/ai';
import moment from 'moment';
import React, { useState } from 'react';
import { Button, H2, H4, H5, Text, XStack, YStack } from 'tamagui';
import Drawer from '../Drawer';

const MwlQuestionnaire: Record<number, any> = {
  1: {
    key: 'perceivedMentalDemand',
    question:
      'On a scale of 1 to 5, how mentally demanding did you find your day?',
  },
  2: {
    key: 'perceivedPhysicalDemand',
    question: 'How physically demanding was your day?',
  },
  3: {
    key: 'perceivedTimePressure',
    question: 'How much time pressure did you feel while doing the task?',
    term: 'time pressure',
  },
  4: {
    key: 'frustrationLevel',
    question:
      'How frustrated did you feel throughout the day due to challenges or difficulties?',
    term: 'frustrated',
  },
  5: {
    key: 'satisfactionLevel',
    question:
      'How satisfied are you with your overall performance on tasks and activities today?',
    term: 'satistfied',
  },
};

const MwlModal = ({
  open,
  setOpen,
  date,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: moment.Moment | null;
}) => {
  const { generateMentalWorkload } = useTasks();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isQuestionnaireScreen, setIsQuestionnaireScreen] = useState(false);
  const [isFeedbackScreen, setIsFeedbackScreen] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<
    Record<string, number>
  >({
    perceivedMentalDemand: 0,
    perceivedPhysicalDemand: 0,
    perceivedTimePressure: 0,
    frustrationLevel: 0,
    satisfactionLevel: 0,
  });
  const [feedback, setFeedback] = useState<AIMwlReturnType | null>(null);

  const reset = () => {
    setOpen(false);
    setCurrentQuestion(1);
    setIsQuestionnaireScreen(false);
    setIsFeedbackScreen(false);
    setQuestionnaireData({
      perceivedMentalDemand: 0,
      perceivedPhysicalDemand: 0,
      perceivedTimePressure: 0,
      frustrationLevel: 0,
      satisfactionLevel: 0,
    });
  };

  return (
    <Drawer open={open} setOpen={reset}>
      <YStack gap='$4' justifyContent='center' alignItems='center' flex={1}>
        <H5 textAlign='center'>Mental Workload</H5>
        {!isQuestionnaireScreen && !isFeedbackScreen && (
          <>
            <Button onPress={() => setIsQuestionnaireScreen(true)}>
              Calculate Mental Workload
            </Button>
            <Text textAlign='center' color='$gray10'>
              We recommend calculating the day's MWL score at the end of the day
              or after you have planned the entire day.
            </Text>
            <Text>Or</Text>
            <Button
              onPress={async () => {
                try {
                  const feedback = await generateMentalWorkload({
                    isTemporaryFeedback: true,
                    date: date,
                  });
                  setFeedback(feedback);
                  setIsFeedbackScreen(true);
                } catch (e) {
                  console.log('Error generating feedback', e);
                }
              }}
              backgroundColor='$accentColor'
              borderColor='$accentBackground'
            >
              Get Feeback
            </Button>
            <Text textAlign='center' color='$gray10'>
              Get a quick feedback on your day based on the tasks you have
              planned.
            </Text>
          </>
        )}
        {isQuestionnaireScreen && (
          <>
            <H4 textAlign='center'>
              {MwlQuestionnaire[currentQuestion].question}
            </H4>
            {/* <Text color='$gray10'>
              With 1 being least {MwlQuestionnaire[currentQuestion].term ?? ''}{' '}
              and 5 being very{' '}
              {MwlQuestionnaire[currentQuestion].term ?? 'high'}
            </Text> */}
            <XStack flexWrap='wrap' gap='$2' justifyContent='center'>
              {[1, 2, 3, 4, 5].map((option, index) => (
                <Button
                  key={index}
                  backgroundColor={
                    questionnaireData[MwlQuestionnaire[currentQuestion].key] ===
                    option
                      ? '$color7'
                      : '$active'
                  }
                  onPress={() =>
                    setQuestionnaireData({
                      ...questionnaireData,
                      [MwlQuestionnaire[currentQuestion].key]: option,
                    })
                  }
                >
                  <Text>{option}</Text>
                </Button>
              ))}
            </XStack>
            <XStack gap='$2'>
              {currentQuestion > 1 && (
                <Button
                  onPress={() => {
                    setCurrentQuestion(currentQuestion - 1);
                  }}
                >
                  Previous
                </Button>
              )}
              <Button
                onPress={async () => {
                  if (currentQuestion === 5) {
                    try {
                      await generateMentalWorkload({
                        dayFeedback: questionnaireData,
                        date: date,
                      });
                      reset();
                    } catch (e) {
                      console.log(e);
                    }
                  } else {
                    setCurrentQuestion(currentQuestion + 1);
                  }
                }}
              >
                Next
              </Button>
            </XStack>
          </>
        )}
        {isFeedbackScreen && (
          <YStack justifyContent='center' alignItems='center' gap='$2'>
            <H2>{feedback?.mwl}</H2>
            <Text color='$gray10'>Current Estimated Workload</Text>
            <Text textAlign='center'>{feedback?.feedback}</Text>
          </YStack>
        )}
      </YStack>
    </Drawer>
  );
};

export default MwlModal;
