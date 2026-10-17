// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { inventarioInicial, Producto } from '../utils/inventario';

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>(inventarioInicial);
  const [busqueda, setBusqueda] = useState('');

  const cambiarPrecio = (id: string, nuevoPrecioTexto: string) => {
    const precioNumerico = parseFloat(nuevoPrecioTexto);
    if (isNaN(precioNumerico)) return;

    setProductos(productosAnteriores => 
      productosAnteriores.map(prod => 
        prod.id === id ? { ...prod, precio: precioNumerico } : prod
      )
    );
  };

  const productosFiltrados = productos.filter(prod => {
    const termino = busqueda.toLowerCase();
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      prod.categoria.toLowerCase().includes(termino)
    );
  });

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.tarjetaProducto}>
      <View style={styles.infoProducto}>
        <Text style={styles.nombreProducto}>{item.nombre}</Text>
        <Text style={styles.categoriaEtiqueta}>{item.categoria}</Text>
        <Text style={styles.textoPrecio}>S/. {item.precio.toFixed(2)}</Text>
      </View>
      <View style={styles.contenedorInput}>
        <Text style={styles.simboloMoneda}>S/.</Text>
        <TextInput
          style={styles.inputCorto}
          keyboardType="numeric"
          placeholder={item.precio.toString()}
          placeholderTextColor="#999"
          onChangeText={(txt) => cambiarPrecio(item.id, txt)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedorBase}>
      <Text style={styles.tituloHeader}>🏪 Mi Bodega - Control</Text>
      
      <TextInput
        style={styles.barraBusqueda}
        placeholder="🔍 Buscar por nombre o categoría..."
        placeholderTextColor="#777"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listaContenido}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>No se encontraron productos.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorBase: { flex: 1, backgroundColor: '#F5F7FA' },
  tituloHeader: { fontSize: 24, fontWeight: 'bold', color: '#1A1C1E', textAlign: 'center', marginVertical: 15 },
  barraBusqueda: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, marginHorizontal: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0', color: '#333' },
  listaContenido: { paddingHorizontal: 15, paddingBottom: 20 },
  tarjetaProducto: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  infoProducto: { flex: 1, paddingRight: 10 },
  nombreProducto: { fontSize: 16, fontWeight: '600', color: '#1A1C1E' },
  categoriaEtiqueta: { fontSize: 12, color: '#64748B', backgroundColor: '#E2E8F0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, overflow: 'hidden' },
  textoPrecio: { fontSize: 16, fontWeight: 'bold', color: '#059669', marginTop: 6 },
  contenedorInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 8, backgroundColor: '#F8FAFC', width: 90 },
  simboloMoneda: { fontSize: 14, color: '#64748B', marginRight: 2 },
  inputCorto: { flex: 1, paddingVertical: 6, fontSize: 15, color: '#333', textAlign: 'right' },
  textoVacio: { textAlign: 'center', color: '#64748B', marginTop: 30, fontSize: 16 },
});
