import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.goBack()}
    >
      <Icon
        name="arrow-left"
        type="font-awesome-5"
        color="#FFF"
        size={20}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#252544',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
}); 