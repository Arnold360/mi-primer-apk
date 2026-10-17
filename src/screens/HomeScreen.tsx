// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { inventarioInicial, Producto } from '../utils/inventario';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>(inventarioInicial);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pagoCon, setPagoCon] = useState('');

  const cambiarPrecio = (id: string, nuevoPrecioTexto: string) => {
    const precioNumerico = parseFloat(nuevoPrecioTexto);
    if (isNaN(precioNumerico)) return;

    setProductos(productosAnteriores => 
      productosAnteriores.map(prod => 
        prod.id === id ? { ...prod, precio: precioNumerico } : prod
      )
    );

    setCarrito(carritoAnterior =>
      carritoAnterior.map(item =>
        item.producto.id === id 
          ? { ...item, producto: { ...item.producto, precio: precioNumerico } }
          : item
      )
    );
  };

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(carritoAnterior => {
      const existe = carritoAnterior.find(item => item.producto.id === producto.id);
      if (existe) {
        return carritoAnterior.map(item =>
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...carritoAnterior, { producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (id: string) => {
    setCarrito(carritoAnterior => {
      return carritoAnterior
        .map(item => item.producto.id === id ? { ...item, cantidad: item.cantidad - 1 } : item)
        .filter(item => item.cantidad > 0);
    });
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setPagoCon('');
  };

  const totalVenta = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const efectivo = parseFloat(pagoCon) || 0;
  const vuelto = efectivo > totalVenta ? efectivo - totalVenta : 0;

  const productosFiltrados = productos.filter(prod => {
    const termino = busqueda.toLowerCase();
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      prod.categoria.toLowerCase().includes(termino)
    );
  });

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity 
      style={styles.tarjetaProducto} 
      activeOpacity={0.7}
      onPress={() => agregarAlCarrito(item)}
    >
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
    </TouchableOpacity>
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

      {carrito.length > 0 && (
        <View style={styles.panelVenta}>
          <View style={styles.filaHeaderVenta}>
            <Text style={styles.tituloVenta}>Cuenta Actual ({carrito.length})</Text>
            <TouchableOpacity onPress={limpiarCarrito}>
              <Text style={styles.botonLimpiar}>Limpiar 🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* CORREGIDO: Renderizado seguro de texto plano */}
          <View style={styles.contenedorFichas}>
            {carrito.map(item => (
              <TouchableOpacity 
                key={item.producto.id} 
                style={styles.fichaItem}
                onPress={() => quitarDelCarrito(item.producto.id)}
              >
                <Text style={styles.textoFicha}>
                  {item.cantidad}x {item.producto.nombre} ✕
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cajaTotales}>
            <View>
              <Text style={styles.labelTotal}>TOTAL A COBRAR</Text>
              <Text style={styles.montoTotal}>S/. {totalVenta.toFixed(2)}</Text>
            </View>
            
            <View style={styles.cajaPago}>
              <Text style={styles.labelTotal}>PAGO CON:</Text>
              <TextInput
                style={styles.inputPago}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#999"
                value={pagoCon}
                onChangeText={setPagoCon}
              />
            </View>

            <View style={styles.cajaVuelto}>
              <Text style={styles.labelVuelto}>VUELTO</Text>
              <Text style={styles.montoVuelto}>S/. {vuelto.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorBase: { flex: 1, backgroundColor: '#F5F7FA' },
  tituloHeader: { fontSize: 24, fontWeight: 'bold', color: '#1A1C1E', textAlign: 'center', marginVertical: 15 },
  barraBusqueda: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, marginHorizontal: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0', color: '#333' },
  listaContenido: { paddingHorizontal: 15, paddingBottom: 180 }, 
  tarjetaProducto: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  infoProducto: { flex: 1, paddingRight: 10 },
  nombreProducto: { fontSize: 16, fontWeight: '600', color: '#1A1C1E' },
  categoriaEtiqueta: { fontSize: 12, color: '#64748B', backgroundColor: '#E2E8F0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, overflow: 'hidden' },
  textoPrecio: { fontSize: 16, fontWeight: 'bold', color: '#059669', marginTop: 6 },
  contenedorInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 8, backgroundColor: '#F8FAFC', width: 90 },
  simboloMoneda: { fontSize: 14, color: '#64748B', marginRight: 2 },
  inputCorto: { flex: 1, paddingVertical: 6, fontSize: 15, color: '#333', textAlign: 'right' },
  textoVacio: { textAlign: 'center', color: '#64748B', marginTop: 30, fontSize: 16 },
  
  panelVenta: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1E293B', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 10 },
  filaHeaderVenta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloVenta: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  botonLimpiar: { color: '#F87171', fontWeight: '600', fontSize: 14 },
  contenedorFichas: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, maxHeight: 60, overflow: 'hidden' },
  fichaItem: { backgroundColor: '#334155', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
  textoFicha: { color: '#E2E8F0', fontSize: 12, fontWeight: '500' },
  cajaTotales: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderColor: '#334155' },
  labelTotal: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  montoTotal: { color: '#34D399', fontSize: 20, fontWeight: 'bold' },
  cajaPago: { width: 85, alignItems: 'center' },
  inputPago: { backgroundColor: '#334155', color: '#FFFFFF', borderRadius: 6, width: '100%', textAlign: 'center', paddingVertical: 4, marginTop: 4, fontSize: 16, fontWeight: 'bold' },
  cajaVuelto: { alignItems: 'flex-end' },
  labelVuelto: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  montoVuelto: { color: '#60A5FA', fontSize: 20, fontWeight: 'bold' }
});
