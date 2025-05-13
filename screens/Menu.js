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
} from 'react-native';
import { obtenerTodosLosProductos } from '../api/menu';
import { CartContext } from '../context/CartContext';
import { useVideoPlayer, VideoView } from 'expo-video';
//import { useEvent } from 'expo';
//import Video from 'react-native-video';
import { Video, ResizeMode } from 'expo-av';
const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../components/CustomModal';


const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState(null);

    const video = useRef(null);
    const [status, setStatus] = useState({});

    const product =[
        {
            id: 1,
            nombre: 'Producto 1',
            categoria: 'Categoria 1',
            precio: 10.0,
            descripcion: 'Descripción del producto 1',
            foto: null,
            indicaciones: {
                video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            },

        },
        {
            id: 2,
            nombre: 'Producto 2',
            categoria: 'Categoria 2',
            precio: 20.0,
            descripcion: 'Descripción del producto 2',
            foto: null,
            indicaciones: {
                video: 'https://drive.google.com/file/d/1fk-sdUEcoiCHMZu5CuZwGLYaEsU8lZ-4/view?usp=sharing',
            },
        },
        {
            id: 3,
            nombre: 'Producto 3',
            categoria: 'Categoria 3',
            precio: 30.0,
            descripcion: 'Descripción del producto 3',
            foto: null,
            indicaciones: {
                video: 'https://youtu.be/9kt4R2wCrv4?si=lhD2e6DwaA2assDn',
            },
        },
        // Agrega más productos según sea necesario
    ]
    /*const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
    });*/

    //const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
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
        <TouchableOpacity style={styles.card} onPress={() => handleToggle(index)}>
            <Image
                source={
                    item.foto
                        ? { uri: `data:image/jpeg;base64,${item.foto}` }
                        : require('../assets/default-food.png')
                }
                style={styles.image}
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.category}>{item.categoria}</Text>
            <Text style={styles.price}>${item.precio.toFixed(2)}</Text>

            {expandedIndex === index && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.descripcion}</Text>
                    {/*<VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
                    <View style={styles.controlsContainer}>
                        <Button
                            title={isPlaying ? 'Pause' : 'Play'}
                            onPress={() => {
                                if (isPlaying) {
                                    player.pause();
                                } else {
                                    player.play();
                                }
                            }}
                        />
                    </View>*/}
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                            //uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                            uri: product[1].indicaciones.video,
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        isLooping
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    <View style={styles.buttons}>
                        <Button
                            title={status.isPlaying ? 'Pause' : 'Play'}
                            onPress={() =>
                                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                            }
                        />
                    </View>
                    {item.indicaciones?.video ? (
                        <Video
                            // source={{ uri: `data:video/mp4;base64,${item.indicaciones.video}` }}
                            source={{ uri: 'https://youtu.be/9kt4R2wCrv4?si=lhD2e6DwaA2assDn' }}
                            style={styles.video}
                            resizeMode="contain"
                            controls={true} // para mostrar controles de reproducción
                            paused={false}  // empieza automáticamente
                        />
                    ) : (
                        <Text style={{ fontSize: 12 }}>No hay video disponible</Text>
                    )}

                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addToCart(item)}
                >
                    <MaterialCommunityIcons name="cart-plus" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleModal(product[0].indicaciones.video)}
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
            {menuItems.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    No hay productos disponibles
                </Text>
            ) : (
                <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                />
            )}
        </SafeAreaView>
    );
};

export default Menu;

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
    }

});