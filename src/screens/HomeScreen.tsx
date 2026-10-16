import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { INVENTARIO_INICIAL, Producto } from '../utils/inventario';

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>(INVENTARIO_INICIAL);
  const [busqueda, setBusqueda] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  const abrirEditor = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setNuevoPrecio(producto.precio.toString());
    setModalVisible(true);
  };

  const guardarPrecio = () => {
    if (!productoSeleccionado || !nuevoPrecio || isNaN(Number(nuevoPrecio))) {
      setModalVisible(false);
      return;
    }

    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoSeleccionado.id ? { ...p, precio: Number(nuevoPrecio) } : p
      )
    );
    setModalVisible(false);
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
            onPress={() => abrirEditor(item)}
          >
            <View style={styles.infoColumna}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centradoModal}>
          <View style={styles.vistaModal}>
            <Text style={styles.tituloModal}>Actualizar Precio</Text>
            <Text style={styles.subtituloModal}>{productoSeleccionado?.nombre}</Text>
            
            <TextInput
              style={styles.inputPrecio}
              keyboardType="numeric"
              value={nuevoPrecio}
              onChangeText={setNuevoPrecio}
              autoFocus={true}
            />

            <View style={styles.filaBotones}>
              <TouchableOpacity 
                style={[styles.botonModal, styles.botonCancelar]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotonCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.botonModal, styles.botonGuardar]} 
                onPress={guardarPrecio}
              >
                <Text style={styles.textoBotonGuardar}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  infoColumna: {
    flex: 1,
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
    marginLeft: 10,
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
  centradoModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  vistaModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  subtituloModal: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputPrecio: {
    width: '100%',
    backgroundColor: '#F0F2F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  filaBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  botonModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  botonCancelar: {
    backgroundColor: '#E0E0E0',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
  },
  textoBotonCancelar: {
    color: '#333333',
    fontWeight: '600',
  },
  textoBotonGuardar: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
