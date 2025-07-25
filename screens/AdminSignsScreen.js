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
    Alert,
} from 'react-native';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
} from "react-native-responsive-dimensions"
import { eliminarSena, obtenerTodasLasSenas, senasActivas, senasInactivas } from '../api/sign';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../components/CustomModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';



const AdminSignScreen = () => {
    const navigation = useNavigation();
    const [signItems, setSignItems] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState(null);
    const [search, setSearch] = useState('');
    const [keyBoardVisible, setKeyBoardVisible] = useState();
    const { theme } = useTheme();
    const [filter, setFilter] = useState('todos'); // 'todos', 'activos', 'inactivos'

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
    const signsFiltered = signItems.filter(sign =>
        sign.nombre.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id) => {
        try {
            await eliminarSena(id);
            Alert.alert("Éxito", "Seña eliminada correctamente", [
                { text: "OK" },
            ]);
        } catch (error) {
            console.error("Error al eliminar seña:", error);
            Alert.alert("Error", "No se pudo eliminar la seña, por favor intente nuevamente.");
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchSigns = async () => {
                try {
                    const response = await obtenerTodasLasSenas();
                    if (response.data.tipo === "SUCCESS") {
                        setSignItems(response.data.datos);
                        console.log("Respuesta completa:", response.data);
                    } else {
                        console.error("Error en la respuesta:", response.data.mensaje);
                    }
                } catch (error) {
                    console.error("Error al obtener los productos:", error);
                }
            };
            fetchSigns();
            // Probar si la URL es accesible
            if (videoUri) {
                fetch(videoUri)
                    .then(response => {
                        console.log('Fetch response status admin:', response.status, ' uri: ', videoUri);
                        console.log('Fetch response headers:', response.headers);
                    })
                    .catch(error => {
                        console.log('Fetch error:', error);
                    });
            }
            return () => {
                // Opcional: limpiar estado 
            };
        }, [])

    );

    const handleToggle = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };
    const handleModal = (video) => {
        setModalVisible(true);
        console.log("video: ", video);
        setVideoUri(video);
    }
    const handleEdit = (item) => {
        console.log('nav: ', item);

        navigation.navigate('EditSign', { isEdit: true, item: item });
    }
    const handleFilterChange = async (newFilter) => {
        setFilter(newFilter);
        try {
            let response;
            if (newFilter === 'activas') {
                response = await senasActivas();
            } else if (newFilter === 'inactivas') {
                response = await senasInactivas();
            } else {
                response = await obtenerTodasLasSenas();
            }
            if (response.data.tipo === "SUCCESS") {
                setSignItems(response.data.datos);
            } else if (response.data.tipo === "WARNING") {
                setSignItems([]);
            }
        } catch (error) {
            console.error("Error al filtrar meseros:", error);
        }
    };


    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} /*onPress={() => handleToggle(index)} onPress={() => navigation.navigate('DetallesEdit', { item })}*/>

            {item.video && item.video !== "" ? (
                <Video
                    source={{ uri: item.video }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    useNativeControls
                    onLoad={() => console.log('Video cargado exitosamente')}
                    onError={(error) => console.log('Error cargando video:', error?.nativeEvent)}
                />
            ) : (
                <View style={styles.videoOff}>
                    <MaterialCommunityIcons name="video-off" size={rw(10)} color="#ccc" />
                    <Text style={[styles.noVideoText, { color: theme.textColor }]}>Video no disponible</Text>
                </View>
            )}

            <Text style={styles.name}>{item.nombre}</Text>

            {expandedIndex === index && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.descripcion}</Text>

                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 1 }}>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleEdit(item)}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleModal(item.video)}
                >
                    <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button3} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.headerGradient} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Señas</Text>
                </View>
            </LinearGradient>
            <View style={styles.sectionContainer}>
                <View style={styles.btns}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search" size={20} color="#416FDF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Buscar seña..."
                            placeholderTextColor="#999"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddSign')}>
                        <MaterialCommunityIcons name='plus' size={24} color="#fff" style={{ marginLeft: 0 }} />
                        <Text style={styles.btnText}>Agregar</Text>
                    </TouchableOpacity>
                </View>
                {/* Filtros */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'activas' && styles.filterButtonActive]}
                        onPress={() => handleFilterChange('activas')}
                    >
                        <Text style={styles.filterButtonText}>Activos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'inactivas' && styles.filterButtonActive]}
                        onPress={() => handleFilterChange('inactivas')}
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
            {signItems.length === 0 ? (
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
                            data={signsFiltered}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.list}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </>
            )}
            <CustomModal
                visible={modalVisible}
                videoUri={videoUri}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

export default AdminSignScreen;

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
        marginTop: -rh(6),
        paddingTop: rh(8),
    },
    list: {
        paddingBottom: rh(1),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: rw(3),
        padding: rw(2),
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
        height: rh(18),
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
        marginTop: rh(1),
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
        width: rw(40),
        height: rh(30),
        marginTop: rh(1),
        borderRadius: rw(2),
    },
    videoOff: {
        width: rw(40),
        height: rh(30),
        marginTop: rh(1),
        borderRadius: rw(2),
        backgroundColor: "#f5f5f5",
        alignItems: 'center',
        justifyContent: 'center'
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
        // Sombra para Android
        elevation: 4,
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    btns: {
        height: rh(5),
        width: '90%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: rh(11),
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
        top: rh(16),
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