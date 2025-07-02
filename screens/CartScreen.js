import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

const CartScreen = () => {
  const { cart, removeFromCart, addToCart } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  // Calcula el total considerando la cantidad de cada producto
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0).toFixed(2);
  };

  const handleModal = (video) => {
    setModalVisible(true);
    setVideoUri(video);
  };

  // Nuevo: función para restar cantidad
  const decreaseQuantity = (item) => {
    if (item.cantidad > 1) {
      // Restar 1 a la cantidad
      addToCart({ ...item, cantidad: -1 });
    } else {
      // Si es 1, eliminar del carrito
      removeFromCart(item.id);
    }
  };

  // Nuevo: función para sumar cantidad
  const increaseQuantity = (item) => {
    addToCart({ ...item, cantidad: 1 });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Foto a la izquierda */}
      <Image
        source={
          item.foto
            ? { uri: item.foto }
            : require('../assets/default-food.png')
        }
        style={styles.image}
      />
      {/* Info a la derecha */}
      <View style={styles.infoSection}>
        
        <View style={styles.actionsRow}>
          <Text style={styles.name}>{item.nombre}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleModal(item.indicaciones?.[0]?.sena?.video)}
          >
            <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.category}>{item.categoria}</Text>
        <View style={styles.counterRowPrice}>
          <Text style={styles.price}>${item.precio.toFixed(2)}</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => decreaseQuantity(item)}
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.cantidad}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => increaseQuantity(item)}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        

      </View>
      <CustomModal
        visible={modalVisible}
        videoUri={videoUri}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Carrito</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${getTotal()}</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
  },
  infoSection: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    paddingVertical: 8,
    flexDirection: 'column',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginLeft: 8,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '50%',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    //color: '#BACA16',
    marginVertical: 4,
  },
  category: {
        fontSize: 16,
        color: '#777',
        marginBottom: 4,
    },
  counterRowPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'flex-end',
    flex: 1,
  },
  counterButton: {
    backgroundColor: '#BACA16',
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 4.5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'center',
    color: '#333',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  removeButton: {
    backgroundColor: '#f6c80d',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#597cff',
    //backgroundColor: '#BACA16',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
  },
  totalContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    //marginTop: 12,
    //bottom: 60,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});