import { MwlMap } from '@/constants/TaskParameters';
import React from 'react';
import { Text, View } from 'tamagui';

const MwlFeedbackLabel = ({ mwl }: { mwl: 1 | 2 | 3 | 4 | 5 }) => {
  return (
    mwl && (
      <View
        borderWidth='$1'
        borderColor={MwlMap[mwl].color}
        borderRadius='$8'
        paddingVertical='$2'
        paddingHorizontal='$4'
        marginBlock='$4'
      >
        <Text color={MwlMap[mwl].color} textAlign='center'>
          {MwlMap[mwl].feedbackText}
        </Text>
      </View>
    )
  );
};

export default MwlFeedbackLabel;
