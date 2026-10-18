// src/screens/HomeScreen.tsx (PARTE 1)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'Abarrotes' | 'Librería' | 'Golosinas' | 'Limpieza';
  actualizadoEn: number;
}

type CategoriaFiltro = 'Todos' | 'Abarrotes' | 'Librería' | 'Golosinas' | 'Limpieza';
type CriterioOrden = 'nombre' | 'recientes';

const RUTA_ARCHIVO_INVENTARIO = FileSystem.documentDirectory + 'inventario_bodega.json';

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState<'Abarrotes' | 'Librería' | 'Golosinas' | 'Limpieza'>('Abarrotes');

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>('Todos');
  const [ordenarPor, setOrdenarPor] = useState<CriterioOrden>('nombre');
  const [idConfirmandoBorrado, setIdConfirmandoBorrado] = useState<string | null>(null);

  // Cargar datos persistentes del disco duro del celular al iniciar
  useEffect(() => {
    const cargarInventarioLocal = async () => {
      try {
        const infoArchivo = await FileSystem.getInfoAsync(RUTA_ARCHIVO_INVENTARIO);
        if (infoArchivo.exists) {
          const contenidoRaw = await FileSystem.readAsStringAsync(RUTA_ARCHIVO_INVENTARIO);
          setProductos(JSON.parse(contenidoRaw));
        } else {
          const listaBase: Producto[] = [
            { id: '1', nombre: 'Arroz Extra 1kg', precio: 4.55, categoria: 'Abarrotes', actualizadoEn: Date.now() },
            { id: '2', nombre: 'Aceite Vegetal 1L', precio: 7.20, categoria: 'Abarrotes', actualizadoEn: Date.now() },
            { id: '3', nombre: 'Gaseosa 500ml', precio: 2.50, categoria: 'Golosinas', actualizadoEn: Date.now() },
          ];
          setProductos(listaBase);
          await FileSystem.writeAsStringAsync(RUTA_ARCHIVO_INVENTARIO, JSON.stringify(listaBase));
        }
      } catch (e) {
        console.log("Error al cargar local:", e);
      }
    };
    cargarInventarioLocal();
  }, []);

  const guardarEnDisco = async (nuevaLista: Producto[]) => {
    try {
      await FileSystem.writeAsStringAsync(RUTA_ARCHIVO_INVENTARIO, JSON.stringify(nuevaLista));
    } catch (e) {
      console.log("Error al salvar local:", e);
    }
  };

  const agregarProducto = () => {
    if (nuevoNombre.trim() === '' || nuevoPrecio.trim() === '') return;
    const precioNum = parseFloat(nuevoPrecio);
    if (isNaN(precioNum)) return;

    const nuevoProd: Producto = {
      id: Date.now().toString(),
      nombre: nuevoNombre.trim(),
      precio: precioNum,
      categoria: nuevaCategoria,
      actualizadoEn: Date.now()
    };

    const listaActualizada = [nuevoProd, ...productos];
    setProductos(listaActualizada);
    guardarEnDisco(listaActualizada);
    setNuevoNombre('');
    setNuevoPrecio('');
  };

  const intentarEliminar = (id: string) => {
    if (idConfirmandoBorrado === id) {
      const listaActualizada = productos.filter(prod => prod.id !== id);
      setProductos(listaActualizada);
      guardarEnDisco(listaActualizada);
      setIdConfirmandoBorrado(null);
    } else {
      setIdConfirmandoBorrado(id);
    }
  };

  const cambiarPrecio = (id: string, nuevoPrecioTexto: string) => {
    const precioNumerico = parseFloat(nuevoPrecioTexto);
    if (isNaN(precioNumerico)) return;

    const listaActualizada = productos.map(prod => 
      prod.id === id ? { ...prod, precio: precioNumerico, actualizadoEn: Date.now() } : prod
    );
    setProductos(listaActualizada);
    guardarEnDisco(listaActualizada);
  };

  const productosProcesados = productos
    .filter(prod => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaActiva === 'Todos' || prod.categoria === categoriaActiva;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (ordenarPor === 'recientes') return b.actualizadoEn - a.actualizadoEn;
      return a.nombre.localeCompare(b.nombre);
    });
// src/screens/HomeScreen.tsx (PARTE 2 - Continuación)
  return (
    <Pressable style={{ flex: 1 }} onPress={() => setIdConfirmandoBorrado(null)}>
      <ScrollView style={styles.contenedor} keyboardShouldPersistTaps="handled">
        <Text style={styles.tituloHeader}>🏪 BODEGA ELVIS</Text>

        {/* FORMULARIO */}
        <View style={styles.cajaFormulario}>
          <Text style={styles.tituloFormulario}>Nuevo Producto</Text>
          <TextInput
            style={styles.inputForm}
            placeholder="Nombre del producto"
            placeholderTextColor="#999"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
          <View style={styles.filaForm}>
            <TextInput
              style={[styles.inputForm, { flex: 1, marginRight: 8, marginBottom: 0 }]}
              placeholder="Precio"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={nuevoPrecio}
              onChangeText={setNuevoPrecio}
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={agregarProducto}>
              <Text style={styles.textoBoton}>+ Guardar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contenedorSelectCategoria}>
            {(['Abarrotes', 'Librería', 'Golosinas', 'Limpieza'] as const).map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.opcionMiniCat, nuevaCategoria === cat && styles.opcionMiniCatActiva]}
                onPress={() => setNuevaCategoria(cat)}
              >
                <Text style={[styles.textoMiniCat, nuevaCategoria === cat && styles.textoMiniCatActivo]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CONTROLES DE BUSCADOR Y FILTROS */}
        <View style={styles.seccionFiltros}>
          <TextInput
            style={styles.barraBusqueda}
            placeholder="🔍 Buscar producto..."
            placeholderTextColor="#777"
            value={busqueda}
            onChangeText={setBusqueda}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carruselCategorias}>
            {(['Todos', 'Abarrotes', 'Librería', 'Golosinas', 'Limpieza'] as CategoriaFiltro[]).map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.pestañaCat, categoriaActiva === cat && styles.pestañaCatActiva]}
                onPress={() => setCategoriaActiva(cat)}
              >
                <Text style={[styles.textoPestaña, categoriaActiva === cat && styles.textoPestañaActiva]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.filaOrdenamiento}>
            <Text style={styles.labelOrden}>Orden:</Text>
            <TouchableOpacity style={[styles.botonOrden, ordenarPor === 'nombre' && styles.botonOrdenActivo]} onPress={() => setOrdenarPor('nombre')}>
              <Text style={[styles.textoOrden, ordenarPor === 'nombre' && styles.textoOrdenActivo]}>🔤 A-Z</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonOrden, ordenarPor === 'recientes' && styles.botonOrdenActivo]} onPress={() => setOrdenarPor('recientes')}>
              <Text style={[styles.textoOrden, ordenarPor === 'recientes' && styles.textoOrdenActivo]}>⏱️ Recientes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TARJETAS DE PRODUCTOS */}
        <Text style={styles.subtituloSeccion}>Productos en vista ({productosProcesados.length})</Text>
        {productosProcesados.map((item) => {
          const esReciente = (Date.now() - item.actualizadoEn) < 12000;
          const esBorrando = idConfirmandoBorrado === item.id;
          return (
            <View key={item.id} style={[styles.tarjetaProducto, esReciente && styles.tarjetaResaltada]}>
              <View style={styles.infoProducto}>
                <View style={styles.filaNombre}>
                  <Text style={styles.nombreProducto} numberOfLines={1} elipsizeMode="tail">{item.nombre}</Text>
                  {esReciente && <Text style={styles.badgeModificado}>¡Ok!</Text>}
                </View>
                <Text style={styles.tagCategoria}>{item.categoria}</Text>
                <Text style={styles.textoPrecio}>S/. {item.precio.toFixed(2)}</Text>
              </View>
              <View style={styles.accionesProducto}>
                <TextInput
                  style={styles.inputCorto}
                  keyboardType="numeric"
                  placeholder="Editar"
                  placeholderTextColor="#999"
                  onChangeText={(txt) => cambiarPrecio(item.id, txt)}
                />
                <TouchableOpacity style={[styles.botonEliminar, esBorrando && styles.botonEliminarAlerta]} onPress={() => intentarEliminar(item.id)}>
                  <Text style={[styles.textoEliminar, esBorrando && styles.textoEliminarAlerta]}>{esBorrando ? '¿Borrar?' : '🗑️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {productosProcesados.length === 0 && <Text style={styles.textoVacio}>No hay productos.</Text>}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: { paddingHorizontal: 15, backgroundColor: '#F5F7FA' },
  tituloHeader: { fontSize: 24, fontWeight: 'bold', color: '#1A1C1E', textAlign: 'center', marginVertical: 15 },
  subtituloSeccion: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 10, marginTop: 5 },
  cajaFormulario: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  tituloFormulario: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  inputForm: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F8FAFC', color: '#333', marginBottom: 8, fontSize: 14 },
  filaForm: { flexDirection: 'row', alignItems: 'center' },
  botonGuardar: { backgroundColor: '#0284C7', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  textoBoton: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  contenedorSelectCategoria: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  opcionMiniCat: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  opcionMiniCatActiva: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  textoMiniCat: { fontSize: 12, color: '#475569' },
  textoMiniCatActivo: { color: '#FFFFFF', fontWeight: '600' },
  seccionFiltros: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  barraBusqueda: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0', color: '#333', marginBottom: 10 },
  carruselCategorias: { flexDirection: 'row', marginBottom: 10 },
  pestañaCat: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#F1F5F9', marginRight: 8 },
  pestañaCatActiva: { backgroundColor: '#1E293B' },
  textoPestaña: { fontSize: 13, color: '#475569' },
  textoPestañaActiva: { color: '#FFFFFF', fontWeight: '700' },
  filaOrdenamiento: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 6 },
  labelOrden: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  botonOrden: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  botonOrdenActivo: { backgroundColor: '#E0F2FE', borderColor: '#bae6fd' },
  textoOrden: { fontSize: 12, color: '#64748B' },
  textoOrdenActivo: { color: '#0369a1', fontWeight: '600' },
  tarjetaProducto: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  tarjetaResaltada: { borderColor: '#34D399', backgroundColor: '#F0FDF4', borderWidth: 1.5 },
  infoProducto: { flex: 1, paddingRight: 8 },
  filaNombre: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  nombreProducto: { fontSize: 15, fontWeight: '600', color: '#1A1C1E', maxWidth: '80%' },
  badgeModificado: { fontSize: 10, color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontWeight: '700' },
  tagCategoria: { fontSize: 11, color: '#64748B', marginTop: 2 },
  textoPrecio: { fontSize: 15, fontWeight: 'bold', color: '#059669', marginTop: 3 },
  accionesProducto: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputCorto: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, backgroundColor: '#F8FAFC', width: 60, fontSize: 12, color: '#333', textAlign: 'center' },
  botonEliminar: { paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FEE2E2', minWidth: 35, alignItems: 'center' },
  botonEliminarAlerta: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  textoEliminar: { fontSize: 14 },
  textoEliminarAlerta: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  textoVacio: { textAlign: 'center', color: '#64748B', marginTop: 15, fontSize: 14 }
});
