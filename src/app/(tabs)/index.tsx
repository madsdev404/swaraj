import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "@/utils/supabase";
import { fetchGlobalFeed } from "../../utils/services/posts";
import { Post } from "@/types/supabase";
import { useRouter } from "expo-router";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error } = await fetchGlobalFeed();
      if (error) {
        setError(error.message);
      } else if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-base mb-4">Error: {error}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-red-500 text-xl font-bold mb-4">
        Global Feed
      </Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 my-2 rounded-md w-full">
            <Text className="text-lg font-bold mb-1">{item.title}</Text>
            {item.description && <Text className="text-gray-700">{item.description}</Text>}
            {item.user_name && <Text className="text-xs text-gray-500 mt-1">By: {item.user_name}</Text>}
            {item.tags && item.tags.length > 0 && (
              <Text className="text-xs text-blue-600 mt-1">Tags: {item.tags.map(tag => tag.name).join(', ')}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-base text-gray-600 mt-5">No posts available.</Text>
        }
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
