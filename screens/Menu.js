import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Button,
    TextInput
} from 'react-native';
import { obtenerTodosLosProductos } from '../api/menu';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { globalStyles } from '../styles/globalStyle';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf
  } from 'react-native-responsive-dimensions';  
import InstructionsModal from '../components/InstructionsModal';


const Menu = () => {
    const navigation = useNavigation()
    const [menuItems, setMenuItems] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null)
    const { addToCart } = useContext(CartContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [instructionsModalVisible, setInstructionsModalVisible] = useState(false)
    const [videoUri, setVideoUri] = useState([null])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("todos")
    const { theme } = useTheme()

    const route = useRoute()
    const { waiter } = route.params || {}
    console.log("Mesero recibido:", waiter)
    console.log("Condición del mesero:", waiter?.condicion?.id)

    const video = useRef(null)
    const [status, setStatus] = useState({})

    // filtros de búsqueda
    const productsFiltered = menuItems.filter(product =>
        product.nombre.toLowerCase().includes(search.toLowerCase())
    )

    useFocusEffect(
        React.useCallback(() => {
            const fetchMenu = async () => {
                try {
                    const response = await obtenerTodosLosProductos();
                    if (response.data.tipo === "SUCCESS") {
                        setMenuItems(response.data.datos);
                        console.log("Respuesta completa:", response.data);
                    } else {
                        console.error("Error en la respuesta:", response.data.mensaje);
                    }
                } catch (error) {
                    console.error("Error al obtener los productos:", error);
                }
            };
            fetchMenu();
        }, []));
    /*useEffect(() => {
  const interval = setInterval(() => {
    fetchMenu(); // Llama a tu función
  }, 9000); // Cada 5 segundos (ajústalo según lo necesario)
  const fetchMenu = async () => {
            try {
                const response = await obtenerTodosLosProductos();
                if (response.data.tipo === "SUCCESS") {
                    setMenuItems(response.data.datos);
                    console.log("Respuesta completa:", response.data);
                } else {
                    console.error("Error en la respuesta:", response.data.mensaje);
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };
        fetchMenu()
  return () => clearInterval(interval); // Limpia el intervalo al desmontar
}, []);*/




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
        setSelectedProduct(product)
        setInstructionsModalVisible(true)
      }

    const renderActionButton = (item) => {
        // Si la condición del mesero es 1, mostrar botón de señas
        if (waiter?.condicion?.id === 1) {
          return (
            <TouchableOpacity style={styles.button} onPress={() => handleModal(item.sena?.video)}>
              <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
            </TouchableOpacity>
          )
        }
        // Si la condición del mesero es 2, mostrar botón de instrucciones
        else if (waiter?.condicion?.id === 2) {
          return (
            <TouchableOpacity style={styles.button2} onPress={() => handleInstructionsModal(item)}>
              <MaterialCommunityIcons name="format-list-bulleted" size={rw(6)} color="#fff" />
            </TouchableOpacity>
          )
        }
        // Por defecto, mostrar botón de señas
        return (
          <TouchableOpacity style={styles.button} onPress={() => handleModal(item.sena?.video)}>
            <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
          </TouchableOpacity>
        )
      }

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} /*onPress={() => handleToggle(index)}*/ onPress={() => navigation.navigate('ProductDetails', { item })}>
            <Image
                source={
                    item.foto ? { uri: item.foto } : require('../assets/default-food.png')
                }
                style={styles.image}
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.category}>{item.categoria}</Text>


            {expandedIndex === index && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.descripcion}</Text>

                </View>
            )}

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
                <>
                    <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No hay productos disponibles
                        </Text>
                    </View>

                </>
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
                        {/* Filtros */}
                        <View style={styles.filterContainer}>
                            <TouchableOpacity
                                style={[styles.filterButton, filter === 'activos' && styles.filterButtonActive]}
                                onPress={() => handleFilterChange('activos')}
                            >
                                <Text style={styles.filterButtonText}>Postres</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filter === 'inactivos' && styles.filterButtonActive]}
                                onPress={() => handleFilterChange('inactivos')}
                            >
                                <Text style={styles.filterButtonText}>Bebidas calientes</Text>
                            </TouchableOpacity>
                            {filter !== 'todos' && (
                                <TouchableOpacity
                                    style={[styles.filterButton, filter === 'todos' && styles.filterButtonActive]}
                                    onPress={() => handleFilterChange('todos')}
                                >
                                    <Text style={styles.filterButtonText}>Borrar filtros</Text>
                                    <MaterialCommunityIcons name='close' size={18} color="#333" style={{ marginLeft: 5 }} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    {/* Fin Filtros */}
                    <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
                        <FlatList
                            data={productsFiltered}
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

/* const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#000',
        height: 30,
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '20%',
        paddingTop: 50,
        paddingHorizontal: 10,
        //experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
    },
    headerContent: {
        width: '100%',
        //justifyContent: 'space-between',
        flexDirection: 'column',
        marginTop: 0,
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
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#fcfcfc",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -45,
        paddingTop: 80,
    },
    list: {
        paddingBottom: 10,
    },
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
        elevation: 3,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        maxWidth: '45%',

    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        aspectRatio: 1.5,
        alignSelf: 'center',
        //resizeMode: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    category: {
        fontSize: 12,
        color: '#777',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#BACA16',
        marginBottom: 8,
    },
    description: {
        fontSize: 12,
        color: '#555',
        marginTop: 8,
        textAlign: 'center',
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
    button2: {
        backgroundColor: '#f6c80d',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    button3: {
        backgroundColor: '#597cff',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    detailsContainer: {
        alignItems: 'center',
    },
    gif: {
        width: 80,
        height: 80,
        marginTop: 10,
    },
    video: {
        width: 150,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    addButton: {
        flexDirection: 'row',
        height: 40,
        width: '30%',
        backgroundColor: '#BACA16',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    btns: {
        height: 40,
        width: '90%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: 90,
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    btnText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 5
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        minHeight: 40,
        maxHeight: 45,
        marginRight: 10,
        marginBottom: 35,

    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    // --- Filtros ---
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
        paddingHorizontal: 5,
        //zIndex: 1,
        top: 130,
        left: 10,
        right: 0,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fcedb1', // Color de fondo amarillo claro
        //backgroundColor: 'rgba(246, 199, 13, 0.2)', //amarillo transparente F6C80D
        borderColor: 'rgba(187, 202, 22, 0.48)',//'#BACA16' transparente,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#BACA16',
    },
    filterButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
}); */
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
      paddingTop: rh(6),
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
      paddingTop: rh(8),
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
        //aspectRatio: 1.5,
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
    gif: {
      width: rw(20),
      height: rh(10),
      marginTop: rh(1),
    },
    video: {
      width: rw(40),
      height: rh(25),
      marginTop: rh(1),
      borderRadius: rw(2),
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: rh(1),
    },
    addButton: {
      flexDirection: 'row',
      height: rh(5),
      width: rw(30),
      backgroundColor: '#BACA16',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: rw(3),
      paddingHorizontal: rw(3),
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
    btnText: {
      textAlign: 'center',
      fontSize: rf(2),
      color: '#fff',
      marginHorizontal: rw(1),
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: rw(3),
      paddingHorizontal: rw(4),
      paddingVertical: rh(0.6),
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
      justifyContent: 'flex-start',
      marginVertical: rh(1),
      paddingHorizontal: rw(2),
      top: rh(17),
      left: rw(2),
      right: 0,
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
    },
    filterButtonText: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: rf(1.8),
    },
  });