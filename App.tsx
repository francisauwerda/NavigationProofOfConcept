/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {Text, View} from 'react-native';

import {
  createStaticNavigation,
  type StaticScreenProps,
  type StaticParamList,
  useNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button} from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        onPress={() =>
          navigation.navigate('Details', {
            detailsScreenProp1: 'Hello from home screen',
          })
        }>
        Go to Details
      </Button>
    </View>
  );
}

type DetailsScreenProps = StaticScreenProps<{
  detailsScreenProp1: string;
}>;

function DetailsScreen({route}: DetailsScreenProps) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Text>{route.params.detailsScreenProp1}</Text>
    </View>
  );
}

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Overview',
      },
    },
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {
  return <Navigation />;
}

export default App;
