/* eslint-disable react-native/no-inline-styles */

import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';

import {
  createStaticNavigation,
  useNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

type RootStackParamList = StaticParamList<typeof SessionStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const SessionContext = React.createContext({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

const useSession = () => React.useContext(SessionContext);

function SplashScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Splash Screen</Text>
    </View>
  );
}

function DeprecationWallScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Deprecation Wall</Text>
    </View>
  );
}

function OfflineScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Offline Screen</Text>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Expense Details"
        onPress={() => navigation.navigate('ExpenseDetails')}
      />
    </View>
  );
}

function CardsScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Cards Screen</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Account Screen</Text>
    </View>
  );
}

const MainStackTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Cards: CardsScreen,
    Account: AccountScreen,
  },
});

function ExpenseDetailsScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Expense Details</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Profile</Text>
    </View>
  );
}

// UserNavigator from Excalidraw
const MainStack = createNativeStackNavigator({
  screens: {
    MainStackTabs: MainStackTabs,
    ExpenseDetails: ExpenseDetailsScreen,
    Profile: ProfileScreen,
  },
});

function LandingPageScreen() {
  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener('focus', () =>
        console.log('LandingPageScreen was focused'),
      ),
    [navigation],
  );

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Landing Page</Text>
      <Button
        title="Go to LoginPage"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

function LoginScreen() {
  const {signIn} = useSession();
  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener('focus', () =>
        console.log('LoginScreen was focused'),
      ),
    [navigation],
  );

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Login</Text>
      <Button title="Sign In" onPress={signIn} />
    </View>
  );
}

function PasscodeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Passcode</Text>
    </View>
  );
}

// LoginNavigator from Excalidraw
const AuthStack = createNativeStackNavigator({
  screens: {
    LandingPage: LandingPageScreen,
    Login: LoginScreen,
    Passcode: PasscodeScreen,
  },
});

const useCurrentSessionStackScreen = () => {
  const {isSignedIn} = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [currentStack, setCurrentStack] = useState('Splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStack(isSignedIn ? 'MainStack' : 'AuthStack');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return loading ? 'Splash' : currentStack;
};

const useSplashScreenEnabled = () => {
  const splashScreenEnabled = useCurrentSessionStackScreen() === 'Splash';
  console.log('splashScreenEnabled', splashScreenEnabled);
  return useCurrentSessionStackScreen() === 'Splash';
};

// const useDeprecationWallScreenEnabled = () => {
//   return useCurrentSessionStackScreen() === 'DeprecationWall';
// };

// const useOfflineScreenEnabled = () => {
//   return useCurrentSessionStackScreen() === 'Offline';
// };

const useMainStackEnabled = () => {
  const mainStackEnabled = useCurrentSessionStackScreen() === 'MainStack';
  console.log('mainStackEnabled', mainStackEnabled);
  return useCurrentSessionStackScreen() === 'MainStack';
};

const useAuthStackEnabled = () => {
  const authStackEnabled = useCurrentSessionStackScreen() === 'AuthStack';
  console.log('authStackEnabled', authStackEnabled);
  return useCurrentSessionStackScreen() === 'AuthStack';
};

// SessionNavigator from Excalidraw
const SessionStack = createNativeStackNavigator({
  screens: {
    Splash: {
      if: useSplashScreenEnabled,
      screen: SplashScreen,
    },
    // DeprecationWall: {
    //   if: useDeprecationWallScreenEnabled,
    //   screen: DeprecationWallScreen,
    // },
    // Offline: {
    //   if: useOfflineScreenEnabled,
    //   screen: OfflineScreen,
    // },
    MainStack: {
      if: useMainStackEnabled,
      screen: MainStack,
    },
    AuthStack: {
      if: useAuthStackEnabled,
      screen: AuthStack,
    },
  },
});

const Navigation = createStaticNavigation(SessionStack);

function App(): React.JSX.Element {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const signIn = () => setIsSignedIn(true);
  const signOut = () => setIsSignedIn(false);

  return (
    <SessionContext.Provider
      value={{
        isSignedIn,
        signIn,
        signOut,
      }}>
      <Navigation />
    </SessionContext.Provider>
  );
}

export default App;
