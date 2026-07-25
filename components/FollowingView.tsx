import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import {
    textStyles,
    globalStyles,
    colors,
  } from '../styles';

import { getFollowingItems } from '../hooks/createItemHook';
import { PostItem } from '../screens/HomeScreen';
import  { _parseItems }   from '../utils/PostParsing';
import FollowingItem from '../components/FollowingItem';
import LoadingIndicator from '../components/LoadingIndicator';
import { getUser } from '../servicesSecure/authStorage'

type Props = {
  navigation: any;
};

export interface UserResponse {
    user: {
      id: number;
      userName: string;
      nickName: string;
      phone: string;
      userHasPreference: boolean;   
    }
}

const FollowingView: FC<Props> = ({
  navigation,
}) => {
  const followingMutation = getFollowingItems(); 
  const [items, setItems] = useState<PostItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUserData] = useState<UserResponse['user'] | null>(null);


  const loadItems = useCallback(async () => {
    try {
        setIsRefreshing(true);
        const response = await followingMutation.mutateAsync()
        let items = _parseItems(response)
        setItems(items)
    } catch (error) {
        console.error(error);
    } finally {
        setIsRefreshing(false);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const response = await getUser();
      setUserData(response);
    } catch (error) {
      console.error(error);
    }
};

  useEffect(() => {
    loadItems();
    loadUserData();
  }, [loadItems]);

  const isOffertable = useCallback(
    (item: PostItem) => user?.id !== item.user.id,
    [user?.id],
  );

  const handleRefresh = useCallback(() => {
    loadItems();
  }, [loadItems]);

  const renderItem = useCallback(
    ({ item }: { item: PostItem }) => (
      <FollowingItem
        post={item}
        isOffertable={isOffertable(item)}
        navigation={navigation}
        callback={() =>
          navigation.navigate('OfferParamItem', {
            post: item,
          })
        }
        // modalFunction={(text: string, onSuccess: () => void) => {
        //   // openModal(text, onSuccess)
        // }}
      />
    ),
    [navigation, isOffertable],
  );

  if (isRefreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <LoadingIndicator />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {items.length === 0 ? (
          <View style={styles.noItemsMessageContainer}>
            <Text style={textStyles.label}>
              No tienes ofertas seguidas
            </Text>

            <TouchableOpacity onPress={loadItems}>
              <Text style={textStyles.link}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            style={styles.itemList}
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.BLUE]}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {...globalStyles.container,
      width: '100%',
      padding: 0,
  
    },
    body: {
      width: '100%',
      flex: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noItemsMessageContainer: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    separator: {
      flex: 0.3,
      width: '100%',
      height: '100%',
      flexDirection: "column",
      justifyContent: 'center',
    },
    itemList: {
      width: '100%',
      height: '100%',
    }
  });

export default FollowingView;
