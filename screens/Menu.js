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


const Menu = () => {
    const navigation = useNavigation();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState([null]);
    const [search, setSearch] = useState('');

    route = useRoute(); 
    const {waiter} = route.params || {};
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Menú</Text>
                <View style={styles.searchBarContainer}>
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
                <View style={styles.bodyContainer}>
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
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '24%',
        paddingTop: 50,
        paddingHorizontal: 10,
        experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
    },
    bodyContainer: {
        width: '100%',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#fcfcfc",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25
    },
    list: {
        paddingBottom: 0,
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
        alignItems: 'flex-start'
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
    searchBarContainer: {
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
    },

});