import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import RegisterPropertyScreen from "../screens/RegisterPropertyScreen";
import ListPropertiesScreen from "../screens/ListPropertiesScreen";
import EditPropertyScreen from "../screens/EditPropertyScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import { RootStackParamList } from "./types";
import { colors } from "../theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    border: colors.bg,
    primary: colors.accent,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "fade",
          animationDuration: 500,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="RegisterProperty"
          component={RegisterPropertyScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="ListProperties"
          component={ListPropertiesScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="EditProperty"
          component={EditPropertyScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
