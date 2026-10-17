// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [precioArroz, setPrecioArroz] = useState(4.50);
  const [precioAceite, setPrecioAceite] = useState(7.20);
  const [precioGaseosa, setPrecioGaseosa] = useState(2.50);

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.tituloHeader}>Mi Bodega - Precios</Text>
      
      {/* Producto: Arroz */}
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

      {/* Producto: Aceite */}
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

      {/* Producto: Gaseosa */}
      <View style={styles.tarjetaProducto}>
        <View>
          <Text style={styles.nombreProducto}>Gaseosa 500ml</Text>
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
    paddingHorizontal: 15,
  },
  tituloHeader: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1A1C1E', 
    textAlign: 'center', 
    marginVertical: 15 
  },
  tarjetaProducto: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  nombreProducto: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1A1C1E' 
  },
  textoPrecio: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#059669', 
    marginTop: 4 
  },
  inputCorto: { 
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    width: 80,
    fontSize: 14, 
    color: '#333', 
    textAlign: 'center' 
  },
});
