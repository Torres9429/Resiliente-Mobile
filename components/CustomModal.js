import { Video, ResizeMode } from 'expo-av';
import { useState, useEffect, useRef } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const CustomModal = ({ visible, videoUri, onClose }) => {
    const [isVisible, setIsVisible] = useState(visible);
    const [status, setStatus] = useState({});
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadTimeout, setLoadTimeout] = useState(null);
    const video = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
        console.log('video recibido: ', videoUri);
        console.log('tipo de videoUri: ', typeof videoUri);
        console.log('videoUri es válido: ', videoUri && videoUri.length > 0);
        
        // Reset states when modal opens
        if (visible) {
            setHasError(false);
            setIsLoading(true);
            
            // Set a timeout to prevent infinite loading
            const timeout = setTimeout(() => {
                console.log('Timeout reached - GIF too large');
                setHasError(true);
                setIsLoading(false);
            }, 30000); // 30 seconds timeout
            
            setLoadTimeout(timeout);
        }
        
        // Probar si la URL es accesible
        if (videoUri) {
            fetch(videoUri)
                .then(response => {
                    console.log('Fetch response status:', response.status);
                    console.log('Fetch response headers:', response.headers);
                })
                .catch(error => {
                    console.log('Fetch error:', error);
                });
        }
        
        return () => {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
        };
    }, [visible]);

    const handleClose = () => {
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
        setIsVisible(false);
        setHasError(false);
        setIsLoading(false);
        onClose();
    };

    const handleImageLoad = () => {
        console.log('Tu GIF cargado exitosamente');
        setIsLoading(false);
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
    };

    const handleImageError = (error) => {
        console.log('Error cargando tu GIF:', error);
        setHasError(true);
        setIsLoading(false);
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    
                    <View style={{ position: "absolute", top: 20, right: 30 }}>
                        <TouchableOpacity onPress={handleClose}>
                            <Feather name="x" size={36} color="#BACA16" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalText}>¡Sigue las señas para pedir tu orden!</Text><ScrollView>
                    <Text style={{color: 'red', marginBottom: 10}}>Debug: {videoUri}</Text>
                    
                    <View style={styles.gifStyle}>
                        <Text style={{color: 'blue'}}>Área del GIF</Text>
                        <Image
                            source={require('../assets/default-food.png')}
                            style={{width: '100%', height: '100%'}}
                            resizeMode="contain"
                            onLoad={() => console.log('Imagen local cargada exitosamente')}
                            onError={(error) => console.log('Error cargando imagen local:', error.nativeEvent)}
                        />
                    </View>
                    
                    <View style={[styles.gifStyle, {marginTop: 10}]}>
                        <Text style={{color: 'green'}}>Tu GIF: {videoUri}</Text>
                        
                        {hasError ? (
                            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0'}}>
                                <Text style={{color: 'red', textAlign: 'center', padding: 20}}>
                                    Error al cargar el GIF{'\n'}
                                    El archivo es muy grande (51MB){'\n\n'}
                                    Recomendación:{'\n'}
                                    Optimiza el GIF a menos de 5MB{'\n'}
                                    o convierte a MP4
                                </Text>
                            </View>
                        ) : isLoading ? (
                            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0'}}>
                                <Text style={{color: 'blue', textAlign: 'center'}}>Cargando GIF...</Text>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: videoUri }}
                                style={{width: '100%', height: '100%'}}
                                resizeMode="contain"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        )}
                    </View>
                    
                    <View style={[styles.gifStyle, {marginTop: 10}]}>
                        <Text style={{color: 'purple'}}>GIF de ejemplo (funciona)</Text>
                        <Image
                            source={{ uri: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif' }}
                            style={{width: '100%', height: '100%'}}
                            resizeMode="contain"
                            onLoad={() => console.log('GIF de ejemplo cargado exitosamente')}
                            onError={(error) => console.log('Error cargando GIF de ejemplo:', error.nativeEvent)}
                        />
                    </View>
                    
                    </ScrollView>
                </View>

            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: '100%',
        maxHeight: '80%',
        minHeight: '50%',
        bottom: 0,
        position: "absolute",
        padding: 30,
        backgroundColor: "white",
        borderRadius: 50,
        alignItems: "center",
        paddingBottom: 40,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    video: {
        width: '80%',
        height: 450,
        marginTop: 10,
        borderRadius: 10,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: '100%',
    },
    gifStyle:{
        width: 300,
        height: 400,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'center',
        backgroundColor: '#f0f0f0', // Para ver el área del GIF
    }
});
export default CustomModal;