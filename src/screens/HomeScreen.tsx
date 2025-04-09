import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button } from '@rneui/themed';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  RegisterProperty: undefined;
  CalculateITBI: undefined;
  ListProperties: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/brasao.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.videoContainer}>
        {/* O componente de vídeo será adicionado posteriormente */}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Imóvel"
          onPress={() => navigation.navigate('RegisterProperty')}
          buttonStyle={styles.button}
          containerStyle={styles.buttonWrapper}
        />
        <Button
          title="Calcular ITBI"
          onPress={() => navigation.navigate('CalculateITBI')}
          buttonStyle={styles.button}
          containerStyle={styles.buttonWrapper}
        />
        <Button
          title="Consultar Imóveis"
          onPress={() => navigation.navigate('ListProperties')}
          buttonStyle={styles.button}
          containerStyle={styles.buttonWrapper}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    height: 60,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  videoContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  buttonWrapper: {
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
}); 