import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth'; // We will create this hook next
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledActivityIndicator = styled(ActivityIndicator);

export default function LoginScreen() {
  const { signInWithGoogle, loading, error } = useAuth();

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <StyledView className="p-8 rounded-lg shadow-md w-full max-w-sm">
        <StyledText className="text-4xl font-bold text-center text-gray-800 mb-6">Swaraj</StyledText>
        <StyledText className="text-lg text-center text-gray-600 mb-8">
          Discover and share news that matters to you.
        </StyledText>

        <StyledTouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg shadow-md flex-row items-center justify-center"
          onPress={signInWithGoogle}
          disabled={loading}
        >
          {loading ? (
            <StyledActivityIndicator color="#fff" />
          ) : (
            <StyledText className="text-white text-lg font-bold">Sign in with Google</StyledText>
          )}
        </StyledTouchableOpacity>

        {error && (
          <StyledText className="text-red-500 text-center mt-4">{error}</StyledText>
        )}
      </StyledView>
    </SafeAreaView>
  );
}
