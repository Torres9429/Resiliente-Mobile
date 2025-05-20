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
     KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { obtenerTodosLosProductos } from '../api/menu';
import { CartContext } from '../context/CartContext';
import {Ionicons} from '@expo/vector-icons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../components/CustomModal';
import { useNavigation, useRoute } from '@react-navigation/native';


const AdminMenuScreen = () => {
    const navigation = useNavigation();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState(null);
    const [search, setSearch] = useState('');
    const [keyBoardVisible, setKeyBoardVisible] = useState();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyBoardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyBoardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // filtros de búsqueda
    const productsFiltered = menuItems.filter( product => 
        product.nombre.toLowerCase().includes(search.toLowerCase())
    )


    useEffect(() => {
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
    }, []);

    const handleToggle = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };
    const handleModal = (video) => {
        setModalVisible(true);
        setVideoUri(video);
    }


    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} /*onPress={() => handleToggle(index)}*/ onPress={() => navigation.navigate('DetallesEdit', { item })}>
            <Image
                source={
                    item.foto ? { uri: item.foto } : require('../assets/default-food.png')
                }
                style={styles.image}
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.category}>{item.categoria}</Text>
            <Text style={styles.price}>${item.precio.toFixed(2)}</Text>

            {expandedIndex === index && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.descripcion}</Text>

                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity
                    style={styles.button}
                   onPress={() => navigation.navigate('Editar', { item })}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
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
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
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
            {menuItems.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    No hay productos disponibles
                </Text>
            ) : (
                <FlatList
                    data={productsFiltered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default AdminMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    list: {
        paddingBottom: 16,
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
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
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
        paddingHorizontal: 12,
        borderRadius: 8,
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