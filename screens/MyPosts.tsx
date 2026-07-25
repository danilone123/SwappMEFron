import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { textStyles, colors } from '../styles';
import LoadingIndicator from '../components/LoadingIndicator';
import PostGrid from '../components/PostGrid';
import { _parseItems } from '../utils/PostParsing';
import { PostItem } from './HomeScreen';
import { getAllMyItems } from '../hooks/createItemHook';

export type RootStackParamList = {
  MyPosts: undefined;
  SinglePost: {
    post: any;
    isOffertable: boolean;
    hideActions?: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'MyPosts'>;

const MyPostsScreen: React.FC<Props> = ({ navigation }) => {
    const getItemMutation = getAllMyItems();
    const [myPosts, setMyPosts] = useState<PostItem[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
        setIsRefreshing(true);
      const response = await getItemMutation.mutateAsync();

      console.log('my items from backend:', response);
      let items = _parseItems(response)
      setMyPosts(items);
      
    } catch (error) {
      console.log("error when getting items::::::", error);
    } finally {
        setIsRefreshing(false);
    }
  }

//   const loadMyItems = useCallback(
//     async (refreshList = false) => {
//       try {
//         if (refreshList) {
//           setIsRefreshing(true);
//         }



//         setMyPosts(
//           network.responseJSON
//             ? _parseItems(network.responseJSON)
//             : [],
//         );
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsRefreshing(false);
//       }
//     },
//     [
//       dispatch,
//       authentication.token,
//       refresh.refreshToken,
//       network.responseJSON,
//     ],
//   );

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {isRefreshing ? (
          <View style={styles.noItemsMessageContainer}>
            <LoadingIndicator />
          </View>
        ) : myPosts.length === 0 ? (
          <View style={styles.noItemsMessageContainer}>
            <Text style={textStyles.label}>
              No tienes Items registrados
            </Text>

            <TouchableOpacity
              onPress={() => fetchPosts()}
            >
              <Text style={textStyles.link}>
                Actualizar
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <PostGrid
            data={myPosts}
            callback={item =>
              
                navigation.navigate('SinglePost', {
                  post: item,
                  isOffertable: false,
                  hideActions: true
                })
              }
            isRefreshing={isRefreshing}
            onRefresh={() => fetchPosts()}
          />
        )}
      </View>
    </View>
  );
};

export default MyPostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  body: {
    flex: 1,
    paddingTop: 2,
  },

  noItemsMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    backgroundColor: colors.GRAY,
    flex: 0.7,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tab: {
    flex: 2,
    paddingTop: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
