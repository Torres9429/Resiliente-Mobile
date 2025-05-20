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
import { CartContext } from '../context/CartContext'; // Ajusta la ruta si es necesario
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

const CartScreen = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.precio, 0).toFixed(2);
  };
  const handleModal = (video) => {
    setModalVisible(true);
    setVideoUri(video);
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.foto
            ? { uri: item.foto }
            : require('../assets/default-food.png')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombre}</Text>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center', }}>
        <Text style={styles.price}>${item.precio.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleModal(item.indicaciones?.[0].sena?.video)}
        >
          <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalVisible}
        videoUri={videoUri}
        onClose={() => setModalVisible(false)}
      />
    </View >
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
            key={`columns-${2}`}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            numColumns={2}
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
    backgroundColor: '#f5f5f5',
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
  /*card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },*/
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    aspectRatio: 1.5,
    alignSelf: 'center'
    //resizeMode: 'contain',

  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BACA16',
    marginTop: 10,

  },
  info: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#f6c80d',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  totalContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 12,
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
  button: {
    backgroundColor: '#BACA16',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
