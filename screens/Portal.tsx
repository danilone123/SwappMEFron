import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  useWindowDimensions,
} from 'react-native';

import {
  TabView,
  TabBar,
} from 'react-native-tab-view';

import { colors } from '../styles';

import OfferingInView from '../components/OfferingInView';
import OfferingOutView from '../components/OfferingOutView';
import FollowingView from '../components/FollowingView';

type TabRoute = {
  key: 'offers_in' | 'offers_out' | 'following';
  title: string;
};

interface Props {
  update?: boolean;
  navigation: any;
}

const Portal: React.FC<Props> = ({
    update,
    navigation,
  }) => {
    const layout = useWindowDimensions();
  
    const [index, setIndex] = useState(0);
  
    const routes = useMemo<TabRoute[]>(
      () => [
        {
          key: 'offers_in',
          title: 'Ofertas\nRecibidas',
        },
        {
          key: 'offers_out',
          title: 'Ofertas\nRealizadas',
        },
        {
          key: 'following',
          title: 'Seguidos',
        },
      ],
      []
    );
  
    const renderScene = ({
      route,
    }: {
      route: TabRoute;
    }) => {
      switch (route.key) {
        case 'offers_in':
          return <OfferingInView update={update} />;
  
        case 'offers_out':
          return <OfferingOutView update={update} />;
  
        case 'following':
          return (
            <FollowingView
              // update={update}
              navigation={navigation}
            />
          );
  
        default:
          return null;
      }
    };

    const icons = {
        offers_in: require('../assets/icons/ofertas-de-otros-light.png'),
        offers_out: require('../assets/icons/mis-ofertas-light.png'),
        following: require('../assets/icons/seguidos-light.png'),
      } as const;
  
    const renderTabBar = (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: colors.BLACK_LIGHT,
        }}
        style={{
          backgroundColor: colors.BLACK,
        }}
        renderLabel={({
          route,
        }: {
          route: TabRoute;
        }) => (
          <View style={styles.tabLabelContainer}>
            <Image
              source={icons[route.key]}
              resizeMode="contain"
              style={styles.tabIcon}
            />
  
            <Text style={styles.tabLabel}>
              {route.title}
            </Text>
          </View>
        )}
      />
    );
  
    return (
      <TabView
        lazy
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{
          width: layout.width,
        }}
      />
    );
  };
  
  export default Portal;

const styles = StyleSheet.create({
    tabLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    tabIcon: {
      width: 25,
      height: 25,
    },
  
    tabLabel: {
      color: colors.BLACK,
      fontSize: 11,
      fontWeight: 'bold',
      margin: 8,
    },
  });
