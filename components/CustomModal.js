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
                    console.log('Fetch response status modal:', response.status);
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
                    {/* <Text style={{color: 'red', marginBottom: 10}}>Debug: {videoUri}</Text> */}
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                            uri: videoUri,
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={() => {
                                if (status.isPlaying) {
                                    video.current.pauseAsync();
                                } else {
                                    video.current.playAsync();
                                }
                            }}
                        >
                            <MaterialCommunityIcons
                                name={status.isPlaying ? 'pause' : 'play'}
                                size={36}
                                color="#BACA16"
                            />
                        </TouchableOpacity>
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
        paddingVertical: 30,
        paddingHorizontal: 0,
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
        height: 450,
        marginTop: 10,
        borderRadius: 10,
        aspectRatio: 9/16,
        alignSelf: 'center',
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