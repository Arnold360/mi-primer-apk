import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [precioArroz, setPrecioArroz] = useState(4.50);
  const [precioAceite, setPrecioAceite] = useState(7.20);
  const [precioGaseosa, setPrecioGaseosa] = useState(2.50);

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.tituloHeader}>Mi Bodega - Precios</Text>
      
      <View style={styles.tarjetaProducto}>
        <View>
          <Text style={styles.nombreProducto}>Arroz Extra 1kg</Text>
          <Text style={styles.textoPrecio}>S/. {precioArroz.toFixed(2)}</Text>
        </View>
        <TextInput
          style={styles.inputCorto}
          keyboardType="numeric"
          placeholder="Nuevo"
          onChangeText={(txt) => {
            const num = parseFloat(txt);
            if (!isNaN(num)) setPrecioArroz(num);
          }}
        />
      </View>

      <View style={styles.tarjetaProducto}>
        <View>
          <Text style={styles.nombreProducto}>Aceite Vegetal 1L</Text>
          <Text style={styles.textoPrecio}>S/. {precioAceite.toFixed(2)}</Text>
        </View>
        <TextInput
          style={styles.inputCorto}
          keyboardType="numeric"
          placeholder="Nuevo"
          onChangeText={(txt) => {
            const num = parseFloat(txt);
            if (!isNaN(num)) setPrecioAceite(num);
          }}
        />
      </View>

      <View style={styles.tarjetaProducto}>
        <View>
          <Text style={styles.nombreProducto}>Gaseosa Coca-Cola</Text>
          <Text style={styles.textoPrecio}>S/. {precioGaseosa.toFixed(2)}</Text>
        </View>
        <TextInput
          style={styles.inputCorto}
          keyboardType="numeric"
          placeholder="Nuevo"
          onChangeText={(txt) => {
            const num = parseFloat(txt);
            if (!isNaN(num)) setPrecioGaseosa(num);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  tarjetaProducto: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  nombreProducto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  textoPrecio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  inputCorto: {
    backgroundColor: '#F0F2F5',
    width: 80,
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});
