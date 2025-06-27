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


const Menu = () => {
    const navigation = useNavigation();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState([null]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('todos'); // 'todos', 'activos', 'inactivos'
    const { theme } = useTheme();

    route = useRoute();
    const { waiter } = route.params || {};
    //console.log("Mesero recibido:", waiter);


    const video = useRef(null);
    const [status, setStatus] = useState({});

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

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} /*onPress={() => handleToggle(index)}*/ onPress={() => navigation.navigate('Detalles', { item })}>
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
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleAddToCart(item)}
                >
                    <MaterialCommunityIcons name="cart-plus" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleModal(item.sena?.video)}
                >
                    <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <CustomModal
                visible={modalVisible}
                videoUri={videoUri}
                onClose={() => setModalVisible(false)}
            />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <LinearGradient colors={theme.headerGradient} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: theme.textColor }]}>Menu</Text>

                </View>
            </LinearGradient>

            {menuItems.length === 0 ? (
                <>
                    <View style={styles.bodyContainer}>
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No hay productos disponibles
                        </Text>
                    </View>

                </>
            ) : (
                <>
                    <View style={[styles.sectionContainer, { backgroundColor: theme.backgroundColor }]}>
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
                                <Text style={styles.filterButtonText}>Activos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filter === 'inactivos' && styles.filterButtonActive]}
                                onPress={() => handleFilterChange('inactivos')}
                            >
                                <Text style={styles.filterButtonText}>Inactivos</Text>
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

const styles = StyleSheet.create({
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
        zIndex: 1,
        //experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
    },
    headerContent: {
        width: '100%',
        //justifyContent: 'space-between',
        flexDirection: 'column',
        marginTop: 0,
        zIndex: 1,
    },
    sectionContainer: {
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingBottom: 100,
    },
    bodyContainer: {
        width: '100%',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#fcfcfc",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -55,
        paddingBottom: 80,
        paddingTop: 70,
        zIndex: 0,
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
    button2: {
        backgroundColor: '#f6c80d',
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
    /*searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        minHeight: 50,
        maxHeight: 50,
        marginHorizontal: 10,
        marginBottom: 35,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },*/
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
        zIndex: 1,
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

});