/* eslint-disable react-native/no-inline-styles */

import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';

import {
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
function SplashScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Splash Screen</Text>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const {user, setUser} = useUser();

  useEffect(() => {
    setUser('DJ John');
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Text>{user}</Text>
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

function ExpenseDetailsScreen() {
  const {user} = useUser();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Expense Details</Text>
      <Text>{user}</Text>
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

function LandingPageScreen() {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Landing Page</Text>
      <Button
        title="Go to Login"
        onPress={() =>
          navigation.navigate('Login', {email: 'martin.wiingaard@pleoi.io'})
        }
      />
    </View>
  );
}

type LoginProps = StaticScreenProps<{
  email: string;
}>;

function LoginScreen(props: LoginProps) {
  const {signIn} = useSession();
  const navigation = useNavigation();
  props.route.params.email;

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

const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Cards: CardsScreen,
    Account: AccountScreen,
  },
});

type Root = 'user' | 'login' | 'splash';

const useCurrentRoot = (): Root => {
  const {isSignedIn} = useSession();
  const [loading, setLoading] = useState(true);
  const [currentRoot, setCurrentRoot] = useState<Root>('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentRoot(isSignedIn ? 'user' : 'login');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return currentRoot;
};

const isUserRootEnabled = () => {
  return useCurrentRoot() === 'user';
};

const isLoginRootEnabled = () => {
  return useCurrentRoot() === 'login';
};

const isSplashRootEnabled = () => {
  return useCurrentRoot() === 'splash';
};

const UserContext = React.createContext({
  user: '',
  setUser: (user: string) => {
    console.log(user);
  },
});

const useUser = () => useContext(UserContext);

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = React.useState<string>('');

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

const SessionContext = React.createContext({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

const useSession = () => React.useContext(SessionContext);

const SessionProvider = ({children}: {children: React.ReactNode}) => {
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
      {children}
    </SessionContext.Provider>
  );
};

const RootStackNavigator = createNativeStackNavigator({
  groups: {
    User: {
      if: isUserRootEnabled,
      screens: {
        TabBar: {
          screen: TabNavigator,
          options: {
            animation: 'none',
          },
        },
        ExpenseDetails: ExpenseDetailsScreen,
        Profile: ProfileScreen,
      },
    },
    Login: {
      if: isLoginRootEnabled,
      screens: {
        LandingPage: {
          screen: LandingPageScreen,
          options: {
            animation: 'none',
          },
        },
        Login: LoginScreen,
        Passcode: PasscodeScreen,
      },
    },
  },
  screens: {
    Splash: {
      if: isSplashRootEnabled,
      screen: SplashScreen,
    },
    // Offline: {
    //   if: useOfflineScreenEnabled,
    //   screen: OfflineScreen,
    // },
    // ...
  },
});

const Navigation = createStaticNavigation(RootStackNavigator);
// const UserNavigation = createStaticNavigation(RootStackNavigator);
// const LoginNavigation = createStaticNavigation(RootStackNavigator);

// const NavigationProvider = () => {
//   const isSignedIn = true;
//   useSession();
//   if (isSignedIn) {
//     return (
//       <UserProvider>
//         <UserNavigation />
//       </UserProvider>
//     );
//   }

//   return <LoginNavigation />;
// };

function App(): React.JSX.Element {
  return (
    <SessionProvider>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </SessionProvider>
  );
}

export default App;
