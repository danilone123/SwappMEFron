import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator
} from "react-native";

import {Item} from "./Item"
import { PostType } from "../components/Post"
import Post from "../components/Post"
import { getAllItems } from '../hooks/createItemHook';
import  { _parseItems }   from '../utils/PostParsing';

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

  export interface PostItem {
    id: string;
    images: any;
    type: string;
    offer: string;
    search: string;
    description: string;
    urgency: number;
    follow: boolean;
    numberFollowers: number;
    numberComments: number;
    showSwapp: any;
    user: any;
    placeToChange: string
  }

  export default function HomeScreen({ navigation }: any) {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const getItemMutation = getAllItems();
    
    const fetchPosts = async () => {
      try {
        const response = await getItemMutation.mutateAsync(0);
  
        console.log('items from backend:::::', response);
        let items = _parseItems(response)
        setPosts(items);
        
      } catch (error) {
        console.log("error when getting items::::::", error);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      fetchPosts();
    }, []);

//   export default function HomeScreen() {
    const handlePress = (item: Item) => {
        console.log("Clicked::::::", item);
        // navigate or do something here
        console.log(navigation);
        navigation.navigate("Details" as never, { item } as never);
      };

      if (loading) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        );
      }

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
        <FlatList style={{ flex: 1,  }} contentContainerStyle={{ backgroundColor: "#000" }}
          data={posts}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => <Post
          key={item.id}
          post={item}
          isOffertable={true}
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