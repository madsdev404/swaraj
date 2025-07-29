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
  Image
} from "react-native";
import { createPost } from "../../utils/services/posts";
import { fetchAllTags } from "../../utils/services/tags";
import { Tag } from "@/types/supabase";
import { supabase } from "../../utils/supabase";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { decode } from 'base64-arraybuffer';

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  };

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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "User not logged in.");
      setLoading(false);
      return;
    }

    let imageUrl = imageUri;
    if (imageUri) {
      const base64 = await fetch(imageUri).then(response => response.text());
      const fileName = `public/${user.id}/${Date.now()}.png`;
      const { data, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, decode(base64.split(',')[1]), {
          contentType: 'image/png',
        });

      if (uploadError) {
        Alert.alert("Error uploading image", uploadError.message);
        setLoading(false);
        return;
      }
      imageUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${fileName}`;
    }

    const postData = {
      title,
      description,
      image_url: imageUrl || undefined,
      lat: location?.latitude,
      lng: location?.longitude,
      userId: user.id,
      tags: selectedTags,
    };

    const { error: createPostError } = await createPost(postData);

    if (createPostError) {
      setError(createPostError.message);
      Alert.alert("Error creating post", createPostError.message);
    } else {
      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setDescription("");
      setImageUri(null);
      setLocation(null);
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

      <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded-md mb-4">
        <Text className="text-white text-center">Pick Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 10 }} />}

      <TouchableOpacity onPress={getLocation} className="bg-green-500 p-3 rounded-md mb-4">
        <Text className="text-white text-center">Get Location</Text>
      </TouchableOpacity>
      {location && (
        <Text className="mb-4">Location: {location.latitude}, {location.longitude}</Text>
      )}

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
