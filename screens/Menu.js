import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  ScrollView 
} from 'react-native';
import { productosActivos } from '../api/menu';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf
} from 'react-native-responsive-dimensions';
import InstructionsModal from '../components/InstructionsModal';


const Menu = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos'); // 'todos' para mostrar todo

  const { theme } = useTheme();
  const route = useRoute();
  const { waiter } = route.params || {};

  // Lógica de filtrado: primero por categoría, luego por búsqueda
  const productsFiltered = menuItems
    .filter(product => {
      if (selectedCategory === 'todos') {
        return true; // Si es 'todos', no filtrar por categoría
      }
      return product.categoria === selectedCategory;
    })
    .filter(product =>
      product.nombre.toLowerCase().includes(search.toLowerCase())
    );

  useFocusEffect(
    React.useCallback(() => {
      const fetchMenu = async () => {
        try {
          const response = await productosActivos();
          if (response.data.tipo === "SUCCESS") {
            const products = response.data.datos;
            setMenuItems(products);
            // 3. Extraer y guardar categorías únicas desde los productos
            const uniqueCategories = [...new Set(products.map(item => item.categoria))];
            setCategories(uniqueCategories);

          } else {
            console.error("Error en la respuesta:", response.data.mensaje);
          }
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      };
      fetchMenu();
    }, []));


  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const handleModal = (video) => {
    setModalVisible(true);
    setVideoUri(video);
  }

  const handleAddToCart = (item) => {
    addToCart(item);
    alert('Producto agregado al carrito');
  };
  const handleInstructionsModal = (product) => {
    setSelectedProduct(product);
    setInstructionsModalVisible(true);
  }

  const renderActionButton = (item) => {
    if (waiter?.condicion?.id === 1) {
      return (
        <TouchableOpacity style={styles.button} onPress={() => handleModal(item.sena?.video)}>
          <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
        </TouchableOpacity>
      )
    }
    else if (waiter?.condicion?.id === 2) {
      return (
        <TouchableOpacity style={styles.button2} onPress={() => handleInstructionsModal(item)}>
          <MaterialCommunityIcons name="format-list-bulleted" size={rw(6)} color="#fff" />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity style={styles.button} onPress={() => handleModal(item.sena?.video)}>
        <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { item })}>
      <Image
        source={
          item.foto ? { uri: item.foto } : require('../assets/default-food.png')
        }
        style={styles.image}
      />
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.category}>{item.categoria}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center', }}>
        <Text style={styles.price}>${item.precio.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button3} onPress={() => handleAddToCart(item)}>
          <MaterialCommunityIcons name="cart-plus" size={rw(6)} color="#fff" />
        </TouchableOpacity>
        {renderActionButton(item)}
      </View>
      <CustomModal
        visible={modalVisible}
        videoUri={videoUri}
        onClose={() => setModalVisible(false)}
      />
      <InstructionsModal
        visible={instructionsModalVisible}
        product={selectedProduct}
        onClose={() => setInstructionsModalVisible(false)}
      />
    </TouchableOpacity>
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <LinearGradient colors={theme.headerGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={40} color="#baca16" />
          </TouchableOpacity>
          <Text style={styles.title}>Menú</Text>
        </View>
      </LinearGradient>

      {menuItems.length === 0 ? (
        <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No hay productos disponibles
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionContainer}>
            <View style={styles.btns}>
              <View style={[styles.searchBarContainer, { backgroundColor: theme.cardBackground }]}>
                <Ionicons name="search" size={20} color="#416FDF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchBar}
                  placeholder="Buscar producto..."
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>
            {/* 4. Filtros dinámicos */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={{ paddingHorizontal: rw(2) }}
            >
              <TouchableOpacity
                style={[styles.filterButton, selectedCategory === 'todos' && styles.filterButtonActive]}
                onPress={() => setSelectedCategory('todos')}
              >
                <Text style={styles.filterButtonText}>Todos</Text>
              </TouchableOpacity>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.filterButtonText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* --- FIN CAMBIOS CLAVE --- */}
          </View>

          <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
            <FlatList
              data={productsFiltered} // Usar la lista ya filtrada
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Menu;

// --- ESTILOS (Añadí pequeños ajustes para el ScrollView de filtros) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  title: {
    fontSize: rf(3),
    fontWeight: 'bold',
    marginBottom: rh(2),
    textAlign: 'center',
    color: '#fff',
    height: rh(4),
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    justifyContent: 'flex-start',
    height: rh(20),
    paddingTop: Platform.OS === "ios" ? rh(6) : rh(5),
    paddingHorizontal: rw(3),
  },
  headerContent: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 0,
  },
  backButton: {
    position: "absolute",
    top: -rh(1.5),
    left: rw(5),
    zIndex: 1,
    borderRadius: rw(12.5),
    padding: rw(2),
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  sectionContainer: {
    width: '100%',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bodyContainer: {
    width: '100%',
    flex: 1,
    paddingHorizontal: rw(2),
    backgroundColor: "#fcfcfc",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(5),
    paddingTop: Platform.OS === 'ios' ? rh(8) : rh(8.5),
  },
  list: {
    paddingBottom: rh(1),
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: rw(3),
    padding: rw(3),
    margin: rw(2),
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    maxWidth: rw(45),
  },
  image: {
    width: rw(40),
    height: rh(14),
    borderRadius: rw(2),
    marginBottom: rh(1),
    alignSelf: 'center',
  },
  name: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  category: {
    fontSize: rf(1.5),
    color: '#777',
    marginBottom: rh(0.5),
  },
  price: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#BACA16',
    marginBottom: -rh(1),
  },
  description: {
    fontSize: rf(1.5),
    color: '#555',
    marginTop: rh(1),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#BACA16',
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
  },
  button2: {
    backgroundColor: '#f6c80d',
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
  },
  button3: {
    backgroundColor: '#597cff',
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
  },
  detailsContainer: {
    alignItems: 'center',
  },
  btns: {
    height: rh(5),
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: rh(12),
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: rw(3),
    paddingHorizontal: rw(4),
    paddingVertical: Platform.OS === 'android' ? rh(0) : rh(0.6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
    minHeight: rh(5),
    maxHeight: rh(6),
    marginRight: rw(3),
    marginBottom: rh(4),
  },
  searchIcon: {
    marginRight: rw(2),
  },
  searchBar: {
    flex: 1,
    fontSize: rf(2),
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: rh(18),
    left: 0,
    right: 0,
    width: '100%',
  },
  filterButton: {
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(4),
    backgroundColor: '#fcedb1',
    borderColor: 'rgba(187, 202, 22, 0.48)',
    borderWidth: 1,
    borderRadius: rw(10),
    marginHorizontal: rw(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#BACA16',
    borderColor: '#BACA16'
  },
  filterButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? rf(1.8) : rf(1.5),
  },
});