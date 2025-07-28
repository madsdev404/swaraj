import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { createPost } from "../../utils/services/posts";
import { fetchAllTags } from "../../utils/services/tags";
import { Tag } from "@/types/supabase";
import { supabase } from "../../utils/supabase";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImage_url] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      const { data, error } = await fetchAllTags();
      if (error) {
        Alert.alert("Error loading tags", error.message);
        setError(error.message);
      } else if (data) {
        setAvailableTags(data);
      }
      setTagsLoading(false);
    };
    loadTags();
  }, []);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "User not logged in.");
      setLoading(false);
      return;
    }

    const postData = {
      title,
      description,
      image_url,
      userId: user.id,
      tags: selectedTags,
    };

    const { data, error } = await createPost(postData);

    if (error) {
      setError(error.message);
      Alert.alert("Error creating post", error.message);
    } else if (data) {
      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setDescription("");
      setImage_url("");
      setSelectedTags([]);
    }
    setLoading(false);
  };

  if (tagsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading tags...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-5">Create New Post</Text>
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-md mb-4 h-24 text-top"
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        placeholder="Image URL (optional)"
        value={image_url}
        onChangeText={setImage_url}
      />

      <Text className="text-lg font-bold mt-2 mb-3">Tags</Text>
      <View className="flex-row flex-wrap justify-center mb-5">
        {availableTags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            onPress={() => handleTagToggle(tag.name)}
            className={`px-4 py-2 m-1 rounded-full ${
              selectedTags.includes(tag.name) ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedTags.includes(tag.name) ? "text-white" : "text-gray-700"
              }`}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text className="text-red-500 mb-4">{error}</Text>}

      <Button
        title={loading ? "Creating..." : "Create Post"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}
