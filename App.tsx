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

type UserStackParamList = StaticParamList<typeof UserStackNavigator>;
type LoginStackParamList = StaticParamList<typeof LoginStackNavigator>;

type CombinedStackParamList = UserStackParamList & LoginStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends CombinedStackParamList {}
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
        onPress={() => navigation.navigate('ExpenseDetails')}
      />
    </View>
  );
}

type LoginProps = StaticScreenProps<{
  email: string;
}>;

function LoginScreen(props: LoginProps) {
  const {signIn} = useSession();

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

type UserContextType = {
  user: string;
  setUser: (user: string) => void;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('UserContext must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = React.useState<string>('francis');

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

const UserStackNavigator = createNativeStackNavigator({
  screens: {
    TabBar: TabNavigator,
    ExpenseDetails: ExpenseDetailsScreen,
    Profile: ProfileScreen,
  },
});

const LoginStackNavigator = createNativeStackNavigator({
  screens: {
    LandingPage: LandingPageScreen,
    Login: LoginScreen,
    Passcode: PasscodeScreen,
  },
});

const UserNavigation = createStaticNavigation(UserStackNavigator);
const LoginNavigation = createStaticNavigation(LoginStackNavigator);

const NavigationProvider = () => {
  const root = useCurrentRoot();

  useEffect(() => {
    console.log({root});
  }, [root]);

  switch (root) {
    case 'user':
      return (
        <UserProvider>
          <UserNavigation />
        </UserProvider>
      );
    case 'login':
      return <LoginNavigation />;
    case 'splash':
      return <SplashScreen />;
  }
};

function App(): React.JSX.Element {
  return (
    <SessionProvider>
      <NavigationProvider />
    </SessionProvider>
  );
}

export default App;
