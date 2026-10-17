// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

// Definimos la estructura de un producto
interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

export default function HomeScreen() {
  // Inicializamos el estado con tus productos base, pero ahora es una lista libre que puede crecer o achicarse
  const [productos, setProductos] = useState<Producto[]>([
    { id: '1', nombre: 'Arroz Extra 1kg', precio: 4.50 },
    { id: '2', nombre: 'Aceite Vegetal 1L', precio: 7.20 },
    { id: '3', nombre: 'Gaseosa 500ml', precio: 2.50 }
  ]);

  // Estados para el formulario de nuevo producto
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // Función para agregar un producto a la lista
  const agregarProducto = () => {
    if (nuevoNombre.trim() === '' || nuevoNombre.trim() === '') return;
    const precioNum = parseFloat(nuevoPrecio);
    if (isNaN(precioNum)) return;

    const nuevoProd: Producto = {
      id: Date.now().toString(), // Genera un ID único basado en el tiempo actual
      nombre: nuevoNombre,
      precio: precioNum
    };

    setProductos([...productos, nuevoProd]);
    
    // Limpiamos los campos del formulario
    setNuevoNombre('');
    setNuevoPrecio('');
  };

  // Función para borrar un producto de la lista
  const eliminarProducto = (id: string) => {
    setProductos(productos.filter(prod => prod.id !== id));
  };

  // Función para editar el precio de un producto existente directamente desde su tarjeta
  const cambiarPrecio = (id: string, nuevoPrecioTexto: string) => {
    const precioNumerico = parseFloat(nuevoPrecioTexto);
    if (isNaN(precioNumerico)) return;

    setProductos(productosAnteriores => 
      productosAnteriores.map(prod => 
        prod.id === id ? { ...prod, precio: precioNumerico } : prod
      )
    );
  };

  return (
    <ScrollView style={styles.contenedor} keyboardShouldPersistTaps="handled">
      <Text style={styles.tituloHeader}>🏪 Mi Bodega - Inventario</Text>

      {/* FORMULARIO PARA AÑADIR PRODUCTO */}
      <View style={styles.cajaFormulario}>
        <Text style={styles.tituloFormulario}>Añadir Nuevo Producto</Text>
        <TextInput
          style={styles.inputForm}
          placeholder="Nombre del producto (ej: Detergente)"
          placeholderTextColor="#999"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
        />
        <View style={styles.filaForm}>
          <TextInput
            style={[styles.inputForm, { flex: 1, marginRight: 10 }]}
            placeholder="Precio (ej: 5.50)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
          />
          <TouchableOpacity style={styles.botonGuardar} onPress={agregarProducto}>
            <Text style={styles.textoBoton}>+ Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtituloSeccion}>Lista de Productos ({productos.length})</Text>

      {/* LISTA DINÁMICA DE PRODUCTOS */}
      {productos.map((item) => (
        <View key={item.id} style={styles.tarjetaProducto}>
          <View style={styles.infoProducto}>
            <Text style={styles.nombreProducto}>{item.nombre}</Text>
            <Text style={styles.textoPrecio}>S/. {item.precio.toFixed(2)}</Text>
          </View>
          
          <View style={styles.accionesProducto}>
            {/* Input para cambiar precio velozmente */}
            <TextInput
              style={styles.inputCorto}
              keyboardType="numeric"
              placeholder="Editar"
              placeholderTextColor="#999"
              onChangeText={(txt) => cambiarPrecio(item.id, txt)}
            />
            {/* Botón para eliminar */}
            <TouchableOpacity 
              style={styles.botonEliminar} 
              onPress={() => eliminarProducto(item.id)}
            >
              <Text style={styles.textoEliminar}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {productos.length === 0 && (
        <Text style={styles.textoVacio}>No hay productos en tu inventario. ¡Añade el primero arriba!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { paddingHorizontal: 15, backgroundColor: '#F5F7FA' },
  tituloHeader: { fontSize: 24, fontWeight: 'bold', color: '#1A1C1E', textAlign: 'center', marginVertical: 15 },
  subtituloSeccion: { fontSize: 16, fontWeight: '700', color: '#64748B', marginBottom: 10, marginTop: 5 },
  
  // Estilos del Formulario
  cajaFormulario: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  tituloFormulario: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 10 },
  inputForm: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F8FAFC', color: '#333', marginBottom: 10, fontSize: 15 },
  filaForm: { flexDirection: 'row', alignItems: 'center' },
  botonGuardar: { backgroundColor: '#0284C7', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, justifyContent: 'center' },
  textoBoton: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  
  // Estilos de las Tarjetas
  tarjetaProducto: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  infoProducto: { flex: 1, paddingRight: 10 },
  nombreProducto: { fontSize: 16, fontWeight: '600', color: '#1A1C1E' },
  textoPrecio: { fontSize: 16, fontWeight: 'bold', color: '#059669', marginTop: 4 },
  
  accionesProducto: { flexDirection: 'row', alignItems: 'center' },
  inputCorto: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#F8FAFC', width: 70, fontSize: 13, color: '#333', textAlign: 'center', marginRight: 10 },
  botonEliminar: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FEE2E2' },
  textoEliminar: { fontSize: 16 },
  textoVacio: { textAlign: 'center', color: '#64748B', marginTop: 20, fontSize: 15 }
});
