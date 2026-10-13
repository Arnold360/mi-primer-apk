import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function App() {
  const [contador, setContador] = useState<number>(0);

  const incrementarContador = (): void => {
    const nuevoValor = contador + 1;
    setContador(nuevoValor);
    if (nuevoValor === 5) {
      Alert.alert("¡Excelente!", "Has presionado tu botón TypeScript 5 veces.", [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mi Primera App Android</Text>
      <Text style={styles.subtitulo}>Programado en: TypeScript</Text>
      <View style={styles.cajaContador}>
        <Text style={styles.numeroContador}>{contador}</Text>
      </View>
      <View style={styles.botonContenedor}>
        <Button title="Presionar Botón" onPress={incrementarContador} color="#007ACC" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#222222', marginBottom: 5, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#007ACC', fontWeight: '600', marginBottom: 40 },
  cajaContador: { backgroundColor: '#f0f4f8', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 15, marginBottom: 40 },
  numeroContador: { fontSize: 48, fontWeight: 'bold', color: '#333333' },
  botonContenedor: { width: '70%', borderRadius: 10, overflow: 'hidden' },
});
