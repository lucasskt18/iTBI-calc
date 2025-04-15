import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RegisterPropertyScreen from '../screens/RegisterPropertyScreen';
import CalculateITBIScreen from '../screens/CalculateITBIScreen';
import ListPropertiesScreen from '../screens/ListPropertiesScreen';
import EditPropertyScreen from '../screens/EditPropertyScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RegisterProperty" component={RegisterPropertyScreen} />
        <Stack.Screen name="CalculateITBI" component={CalculateITBIScreen} />
        <Stack.Screen name="ListProperties" component={ListPropertiesScreen} />
        <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 