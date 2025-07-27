import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function GlobalFeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StyledView className="flex-1 items-center justify-center">
        <StyledText className="text-2xl font-bold text-gray-800">Global Feed Screen</StyledText>
        <StyledText className="text-gray-600 mt-2">Content coming soon!</StyledText>
      </StyledView>
    </SafeAreaView>
  );
}