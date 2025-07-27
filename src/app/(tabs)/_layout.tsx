import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { styled } from 'nativewind';
import {
  Globe,
  Sparkles,
  PlusCircle,
} from 'lucide-react-native'; // Assuming Lucide icons are installed

const StyledText = styled(Text);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#6b7280', // gray-500
        tabBarStyle: {
          backgroundColor: '#ffffff', // bg-white
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // border-gray-200
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="global"
        options={{
          title: 'Global',
          tabBarIcon: ({ color }) => <Globe color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="personalized"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <Sparkles color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}