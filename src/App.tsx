import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.contenedorGlobal}>
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorGlobal: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
