import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { INVENTARIO_INICIAL, Producto } from '../utils/inventario';

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>(INVENTARIO_INICIAL);
  const [busqueda, setBusqueda] = useState('');

  const cambiarPrecio = (id: string, precioActual: number) => {
    Alert.prompt(
      'Actualizar Precio',
      'Ingresa el nuevo precio para este producto:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: (nuevoPrecio) => {
            if (!nuevoPrecio || isNaN(Number(nuevoPrecio))) {
              Alert.alert('Error', 'Por favor ingresa un número válido.');
              return;
            }
            setProductos((prev) =>
              prev.map((p) => (p.id === id ? { ...p, precio: Number(nuevoPrecio) } : p))
            );
          },
        },
      ],
      'plain-text',
      precioActual.toString()
    );
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.tituloHeader}>Bodega MiAppTs</Text>
      
      <TextInput
        style={styles.buscador}
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.tarjetaProducto} 
            onPress={() => cambiarPrecio(item.id, item.precio)}
          >
            <View>
              <Text style={styles.nombreProducto}>{item.nombre}</Text>
              <Text style={styles.categoriaProducto}>{item.categoria}</Text>
            </View>
            <View style={styles.contenedorPrecio}>
              <Text style={styles.textoPrecio}>S/. {item.precio.toFixed(2)}</Text>
              <Text style={styles.editarLink}>Cambiar</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  buscador: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    marginBottom: 16,
  },
  tarjetaProducto: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  nombreProducto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  categoriaProducto: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  contenedorPrecio: {
    alignItems: 'flex-end',
  },
  textoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  editarLink: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
});
