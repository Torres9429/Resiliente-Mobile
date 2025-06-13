import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { Video, ResizeMode } from "expo-av";
import { useRef, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from "../components/CustomModal";

const ProductDetailsScreen = () => {
    const { logout } = useContext(AuthContext);
    const route = useRoute();
    const { item } = route.params;
    const navigation = useNavigation();
    const { addToCart } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState(null);

    console.log('product', item);
    
    const handleModal = (video) => {
        setModalVisible(true);
        setVideoUri(video);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
                </TouchableOpacity>
                <Image
                    source={{ uri: item?.foto }}
                    style={styles.foto}
                    resizeMode="cover"
                    onLoad={(e) => {
                        const { width, height } = e.nativeEvent.source;
                        console.log(`Imagen original: ${width}x${height}`);
                    }}
                />

            </View>
            <View style={styles.detallesContainer}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{item?.nombre}</Text>
                <Text style={{ fontSize: 18, color: "#666",marginTop: 10  }}>{item?.categoria}</Text>
                <Text style={{ fontSize: 20, color: "#BACA16", marginTop: 10, fontWeight: '700'  }}>${item?.precio.toFixed(2)}</Text>
                <Text style={{ fontSize: 20, color: "#000", fontWeight: "bold",marginTop: 30  }}>Descripción:</Text>
                <Text style={{ fontSize: 16, marginTop: 10 }}>{item?.descripcion}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }}>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => addToCart(item)}
                    >
                        <MaterialCommunityIcons name="cart-plus" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontSize: 12, textAlign: 'center' }}>Agregar al carrito</Text>
                    </TouchableOpacity>
                    {item?.indicaciones?.[0]?.sena?.video && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleModal(item.indicaciones?.[0].sena?.video)}
                        >
                            <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 12 }}>Ver Video</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <CustomModal
                    visible={modalVisible}
                    videoUri={videoUri}
                    onClose={() => setModalVisible(false)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "flex-start", alignItems: "center" },
    button: { 
        backgroundColor: "#BACA16", 
        padding: 12, 
        borderRadius: 8, 
        marginTop: 10, 
        width: 100, 
        height: 60, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: 500,
        top: 0,
    },
    foto: {
        width: '100%',
        aspectRatio: 1.5, // mantiene proporción original
    },
    backButton: {
        position: "absolute",
        top: 35,
        left: 20,
        zIndex: 1,
        borderRadius: 50,
        padding: 5,
        //backgroundColor: "rgba(187, 202, 22, 0.35)", // semi-transparente
        backgroundColor: "rgba(255, 255, 255, 0.35)",
    },
    detallesContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -260// para 
    },
});

export default ProductDetailsScreen;