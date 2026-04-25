import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable
} from "react-native";

import {Item} from "./Item"
import { PostType } from "../components/Post"
import Post from "../components/Post"

const { width } = Dimensions.get("window");

const mockPosts: PostType[] = [
  {
    id: '1',
    follow: true,
    numberFollowers: 12,
    type: 'offers',
    offer: 'Free laptop stand',
    search: 'pc gamer',
    description: 'A barely used aluminum laptop stand.',
    placeToChange: 'London',
    urgency: 2,
    images: [],
    user: {
      userName: 'John Doe',
    },
    numberComments: 4,
    showSwapp: true,
  },
  {
    id: '2',
    follow: false,
    numberFollowers: 5,
    type: 'donation',
    offer: 'Winter clothes',
    description: 'Looking for warm jackets.',
    placeToChange: 'Manchester',
    urgency: 3,
    images: [],
    user: {
      userName: 'Sarah',
    },
    numberComments: 1,
  },
];

const DATA: Item[] = [
    {
      id: "1",
      title: "Mountains",
      description: "Beautiful mountain landscape, Beautiful mountain landscapeul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain , Beautiful mountain landscape ,Beautiful mountain landscapeul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscapeul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ul mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape, Beautiful mountain landscape ,Beautiful mountain landscape ,Beautiful mountain landscape, Beautiful mountain landscape.",
      images: ["https://picsum.photos/800/500?1", "https://picsum.photos/800/500?9",  "https://picsum.photos/800/500?10", "https://picsum.photos/800/500?3"],
    },
    {
      id: "2",
      title: "Forest",
      description: "Deep green forest scenery",
      images: ["https://picsum.photos/800/500?2", "https://picsum.photos/800/500?1"],
    },
    {
      id: "3",
      title: "Ocean",
      description: "Blue ocean view",
      images: ["https://picsum.photos/800/500?3"],
    },
    {
        id: "4",
        title: "testttt4",
        description: "Blue ocean view",
        images: ["https://picsum.photos/800/500?6"],
    },
    {
        id: "5",
        title: "testttt555",
        description: "Blue5555 ocean view",
        images: ["https://picsum.photos/800/500?5"],
    }
  ];

  const FullScreenSwiper = ({ images }: { images: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: any) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / width
        );
        setActiveIndex(index);
      };

    return (
        <View>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width }} 
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      {/* Pager dots */}
      <View style={styles.pager}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === activeIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
      </View>
    );
  };

  const ImageCell = ({ item, onPress }: { item: Item, onPress: (item: Item) => void }) => {
    return (
        <Pressable onPress={() => onPress(item)}>
            <View style={styles.card}>
          
                <FullScreenSwiper images={item.images} />
  
                <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        </Pressable>
    );
  };

  
  export default function HomeScreen({ navigation }: any) {
//   export default function HomeScreen() {
    const handlePress = (item: Item) => {
        console.log("Clicked::::::", item);
        // navigate or do something here
        console.log(navigation);
        navigation.navigate("Details" as never, { item } as never);
      };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
        <FlatList style={{ flex: 1,  }} contentContainerStyle={{ backgroundColor: "#000" }}
          data={mockPosts}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => <Post
          key={item.id}
          post={item}
          token="mock-token"
          refreshToken="mock-refresh-token"
          navigation={navigation}
        />}
          showsVerticalScrollIndicator
        />
      </View>
    );
  }

const IMAGE_HEIGHT = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  card: {
    width: width,
    height: IMAGE_HEIGHT,
    marginVertical: 10
  },

  image: { width: width, height: IMAGE_HEIGHT,
    marginRight: 10,
    borderRadius: 12,
  },

  pager: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },

  textContainer: {
      //absolute is similar to zstack in ios
    position: "absolute",
    bottom: 16,
    left: 16,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  description: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 4,
  },
});