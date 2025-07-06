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
import {eliminarSena, obtenerTodasLasSenas} from '../api/sign';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../components/CustomModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';


const AdminSignScreen = () => {
    const navigation = useNavigation();
    const [signItems, setSignItems] = useState([]);
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


    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} /*onPress={() => handleToggle(index)} onPress={() => navigation.navigate('DetallesEdit', { item })}*/>
            
            <Video
                source={
                    item.video ? { uri: item.video } : require('../assets/default-food.png')
                }
                style={styles.gifStyle}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={true}
                useNativeControls={true}
                onLoad={() => console.log('Imagen local cargada exitosamente')}
                            onError={(error) => console.log('Error cargando imagen local:', error.nativeEvent)}
                
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.category}>{item.categoria}</Text>

            {expandedIndex === index && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.descripcion}</Text>

                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => navigation.navigate('SignForm', { isEdit: true, signData: item })}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleModal(item.video)}
                >
                    <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button3} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Señas</Text>
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
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
        aspectRatio: 9 / 16,
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
        height: 300,
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
        height: 50,
        width: '30%',
        backgroundColor: '#BACA16',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    btns: {

        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
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
    gifStyle: {
        //width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'center',
        aspectRatio: 9/16,
        resizeMode: 'cover'
    },


});