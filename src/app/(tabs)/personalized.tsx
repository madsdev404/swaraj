import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { fetchPersonalizedFeed, upvotePost, savePost } from "@/utils/services/posts";
import { Post } from "@/types/supabase";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

export default function PersonalizedFeedScreen() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["personalized-feed", userId],
    queryFn: () => (userId ? fetchPersonalizedFeed(userId) : Promise.resolve({ data: [], error: null })),
    enabled: !!userId, // Only run the query if userId is available
  });

  const handleUpvote = async (postId: string) => {
    if (!userId) return;
    await upvotePost(userId, postId);
    refetch(); // Re-fetch posts to update upvote count (if implemented)
  };

  const handleSave = async (postId: string) => {
    if (!userId) return;
    await savePost(userId, postId);
    refetch(); // Re-fetch posts to update saved status (if implemented)
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading personalized feed...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Error: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Post }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3 mx-2">
      <View className="flex-row items-center mb-2">
        {item.user_avatar_url && (
          <Image
            source={{ uri: item.user_avatar_url }}
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <ThemedText className="text-sm text-gray-600">
          {item.user_name || "Anonymous"} • {new Date(item.created_at).toLocaleDateString()}
        </ThemedText>
      </View>
      <ThemedText type="subtitle" className="text-lg font-bold text-gray-900 mt-1">
        {item.title}
      </ThemedText>
      {item.description && (
        <ThemedText className="text-base text-gray-700 mt-1">
          {item.description}
        </ThemedText>
      )}
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          className="w-full h-48 rounded-md mt-3"
          contentFit="cover"
        />
      )}
      {item.tags && item.tags.length > 0 && (
        <View className="flex-row flex-wrap mt-2">
          {item.tags.map((tag) => (
            <Text key={tag.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
              {tag.name}
            </Text>
          ))}
        </View>
      )}
      <View className="flex-row justify-around mt-3">
        <TouchableOpacity onPress={() => handleUpvote(item.id)} className="flex-row items-center">
          <Ionicons name="arrow-up-circle-outline" size={20} color="gray" />
          <ThemedText className="ml-1 text-gray-600">Upvote</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSave(item.id)} className="flex-row items-center">
          <Ionicons name="bookmark-outline" size={20} color="gray" />
          <ThemedText className="ml-1 text-gray-600">Save</ThemedText>
        </TouchableOpacity>
        {item.lat && item.lng && (
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="location-outline" size={20} color="gray" />
            <ThemedText className="ml-1 text-gray-600">Location</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-gray-100">
      <FlatList
        data={posts?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <ThemedText className="text-center mt-10 text-gray-500">No personalized posts available. Follow some tags!</ThemedText>
        }
      />
    </ThemedView>
  );
}