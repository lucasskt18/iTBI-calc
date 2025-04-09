import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <Button
      icon={{
        name: 'arrow-back',
        type: 'ionicon',
        size: 25,
        color: '#007AFF'
      }}
      title="Voltar"
      onPress={() => navigation.goBack()}
      type="clear"
      containerStyle={styles.backButton}
      titleStyle={styles.backButtonText}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  backButtonText: {
    color: '#007AFF',
    marginLeft: 5,
  },
}); 