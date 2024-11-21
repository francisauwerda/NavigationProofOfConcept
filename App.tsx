/* eslint-disable react-native/no-inline-styles */

import React, {createContext, useContext, useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';

import {
  createNavigatorFactory,
  createStaticNavigation,
  StaticScreenProps,
  useNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

type RootStackParamList = StaticParamList<typeof RootStackNavigator>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Screens

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Show Profile modal"
        onPress={() => navigation.navigate('ProfileStack')}
      />
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Profile</Text>
      <Button
        title="Go to More Profile"
        onPress={() =>
          navigation.navigate('ProfileStack', {screen: 'MoreProfile'})
        }
      />
    </View>
  );
}

https://stackoverflow.com/questions/79211748/wrap-nested-navigator-in-context-with-static-api

function MoreProfileScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>More Profile</Text>
    </View>
  );
}

// Context

type ProfileContextType = {
  name?: string;
  setName: (name: string) => void;
};

const ProfileContext = React.createContext<ProfileContextType | undefined>(
  undefined,
);

const ProfileProvider = ({children}: {children: React.ReactNode}) => {
  const [name, setName] = React.useState<string>();

  return (
    <ProfileContext.Provider value={{name, setName}}>
      {children}
    </ProfileContext.Provider>
  );
};

// Navigators

const ProfileStackNavigator = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    MoreProfile: MoreProfileScreen,
  },
});

const RootStackNavigator = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    ProfileStack: {
      screen: ProfileStackNavigator,
      options: {
        presentation: 'modal',
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStackNavigator);

// App

function App(): React.JSX.Element {
  return <Navigation />;
}

export default App;

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within the ProfileProvider');
  }
  return context;
};
