// src/screens/HomeScreen.tsx (PARTE 1 CORREGIDA)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  actualizadoEn: number;
}

type CriterioOrden = 'nombre' | 'recientes';

export default function HomeScreen() {
  // 1. Estados principales dentro del componente
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('Abarrotes');
  const [busqueda, setBusqueda] = useState('');
  
  // Usamos categoriaSeleccionada (o categoriaActiva, asegúrate de mantener el mismo nombre que uses en tu return)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');
  const [ordenarPor, setOrdenarPor] = useState<CriterioOrden>('nombre');
  const [idConfirmandoBorrado, setIdConfirmandoBorrado] = useState<string | null>(null);

  // Estados adicionales que tenías en tu interfaz visual (asegúrate de tenerlos declarados)
  const [nombreBodega, setNombreBodega] = useState('Mi Bodega Pro');
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [inputNombreTemp, setInputNombreTemp] = useState('');
  const [modalCatVisible, setModalCatVisible] = useState(false);
  const [nuevaCatInput, setNuevaCatInput] = useState('');
  const [idConfirmandoBorradoCat, setIdConfirmandoBorradoCat] = useState<string | null>(null);

  // 2. Sincronización en tiempo real con Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
      const listaProductos = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Producto[];
      setProductos(listaProductos);
      setCargando(false);
    }, (error) => {
      console.error("Error al sincronizar productos: ", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Categorías dinámicas calculadas de forma segura DENTRO del componente
  const categoriasDinamicas = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria))).filter(Boolean)];

  // 4. Filtrado y ordenamiento de productos
  const productosFiltrados = productos
    .filter(item => {
      const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaSeleccionada === 'Todos' || item.categoria === categoriaSeleccionada;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (ordenarPor === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else {
        return b.actualizadoEn - a.actualizadoEn;
      }
    });


    // 1. Agregar un producto nuevo a la nube
  const handleAgregarProducto = async (nombreProd: string, precioProd: string, catProd: string) => {
    if (!nombreProd.trim() || !precioProd.trim()) {
      alert('Por favor ingresa el nombre y el precio.');
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        nombre: nombreProd.trim(),
        precio: parseFloat(precioProd),
        categoria: catProd.trim() || 'General',
        actualizadoEn: Date.now()
      });

      // Limpiamos las casillas del formulario local
      setNombre('');
      setPrecio('');
      setCategoria('General');
    } catch (error) {
      console.error("Error al guardar en Firebase: ", error);
    }
  };

  // 2. Cambiar el precio directamente en la nube usando el ID
  const cambiarPrecio = async (id: string, nuevoPrecioStr: string) => {
    const nuevoPrecio = parseFloat(nuevoPrecioStr);
    if (isNaN(nuevoPrecio)) return;

    try {
      const productoRef = doc(db, 'productos', id);
      await updateDoc(productoRef, {
        precio: nuevoPrecio,
        actualizadoEn: Date.now()
      });
    } catch (error) {
      console.error("Error al actualizar el precio: ", error);
    }
  };

  // 3. Borrar producto de la nube (con doble toque de seguridad)
  const intentarEliminar = async (id: string) => {
    if (idConfirmandoBorrado !== id) {
      setIdConfirmandoBorrado(id);
      setTimeout(() => setIdConfirmandoBorrado(null), 4000);
      return;
    }

    try {
      await deleteDoc(doc(db, 'productos', id));
      setIdConfirmandoBorrado(null);
    } catch (error) {
      console.error("Error al eliminar de Firebase: ", error);
    }
  };

    
 const productosProcesados = productos.filter(prod => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaActiva === 'Todos' || prod.categoria === categoriaActiva;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (ordenarPor === 'recientes') return b.actualizadoEn - a.actualizadoEn;
      return a.nombre.localeCompare(b.nombre);
    });

    

  // --- ELIMINAR PRODUCTO DE FIRESTORE ---
  const handleEliminarProducto = async (id: string) => {
    try {
      // doc() busca el producto exacto por su ID único y deleteDoc lo borra de la nube
      await deleteDoc(doc(db, 'productos', id));
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
      alert('No se pudo eliminar el producto.');
    }
  };

    return (
      <ScrollView 
          style={styles.contenedor} 
          keyboardShouldPersistTaps="handled">
        <Pressable style={{ flex: 1 }} onPress={() => { setIdConfirmandoBorrado(null); setIdConfirmandoBorradoCat(null); }}>
          
        {/* ENCABEZADO DE BODEGA DINÁMICO */}
        <View style={styles.cajaHeader}>
          {!editandoNombre ? (
            <Pressable onLongPress={() => { setInputNombreTemp(nombreBodega); setEditandoNombre(true); }} style={{ width: '100%', alignItems: 'center' }}>
              <Text style={styles.tituloHeader} numberOfLines={1}>🏪 {nombreBodega}</Text>
            </Pressable>
          ) : (
            <View style={styles.cajaEditarNombre}>
              <TextInput
                style={styles.inputNombreHeader}
                value={inputNombreTemp}
                onChangeText={setInputNombreTemp}
                placeholder="Nombre de tu bodega"
                placeholderTextColor="#999"
                autoFocus
              />
              <View style={styles.filaAccionsNombre}>
                <TouchableOpacity style={styles.botonGuardarNombre} onPress={guardarNombreBodega}>
                  <Text style={styles.textoAccionNombre}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelarNombre} onPress={() => setEditandoNombre(false)}>
                  <Text style={styles.textoAccionCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* FORMULARIO */}
        <View style={styles.cajaFormulario}>
          <View style={styles.filaTituloConBoton}>
            <Text style={styles.tituloFormulario}>Nuevo Producto</Text>
          </View>

          <TextInput
            style={[styles.inputForm, { marginTop: 8 }]}
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

          {/* Selector de categoría al crear el producto */}
          <Text style={[styles.labelPanelCat, { marginTop: 10 }]}>Categoría:</Text>
          <TextInput
            style={[styles.inputForm, { marginTop: 4 }]}
            placeholder="Ej. Abarrotes, Bebidas (se crea sola)"
            placeholderTextColor="#999"
            value={nuevaCategoria}
            onChangeText={setNuevaCategoria}
          />
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
          
          {/* Carrusel de categorías dinámicas (¡Incluye 'Todas' y las que existan en la nube!) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carruselCategorias}>
            {categoriasDinamicas.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.pestañaCat, categoriaSeleccionada === cat && styles.pestañaCatActiva]}
                onPress={() => setCategoriaSeleccionada(cat)}
              >
                <Text style={[styles.textoPestaña, categoriaSeleccionada === cat && styles.textoPestañaActiva]}>{cat}</Text>
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
        <Text style={styles.subtituloSeccion}>Productos en vista ({productosFiltrados.length})</Text>
        {productosFiltrados.map((item) => {
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
        {productosFiltrados.length === 0 && <Text style={styles.textoVacio}>No hay productos.</Text>}
        <View style={{ height: 40 }} />
        </Pressable>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { paddingHorizontal: 15, backgroundColor: '#F5F7FA' },
  cajaHeader: { marginVertical: 15, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  tituloHeader: { fontSize: 20, fontWeight: 'bold', color: '#1A1C1E', textAlign: 'center' },
  cajaEditarNombre: { width: '100%', gap: 8 },
  inputNombreHeader: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F8FAFC', color: '#333', fontSize: 15 },
  filaAccionsNombre: { flexDirection: 'row', gap: 8 },
  botonGuardarNombre: { backgroundColor: '#0284C7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, flex: 1, alignItems: 'center' },
  textoAccionNombre: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  botonCancelarNombre: { backgroundColor: '#F1F5F9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  textoAccionCancelar: { color: '#475569', fontSize: 13, fontWeight: '600' },

  subtituloSeccion: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 10, marginTop: 5 },
  cajaFormulario: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  filaTituloConBoton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tituloFormulario: { fontSize: 13, fontWeight: '700', color: '#475569' },
  botonAbrirCategorias: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1' },
  textoBotonAbrirCat: { fontSize: 13, color: '#475569' },
  
  panelGestionCat: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginVertical: 8 },
  labelPanelCat: { fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 4 },
  sugerenciasContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chipSugerencia: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#BAE6FD' },
  textoChipSugerencia: { fontSize: 11, color: '#0369A1', fontWeight: '600' },
  listaBorrarCat: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  badgeBorrarCat: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1' },
  badgeBorrarCatAlerta: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  textoBadgeBorrar: { fontSize: 11, color: '#334155', fontWeight: '600' },
  textoBadgeBorrarAlerta: { color: '#DC2626' },
  botonGuardarCat: { backgroundColor: '#0284C7', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },

  inputForm: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F8FAFC', color: '#333', fontSize: 14 },
  filaForm: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
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
