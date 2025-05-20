import { Video, ResizeMode } from 'expo-av';
import { useState, useEffect, useRef } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const CustomModal = ({ visible, videoUri, onClose }) => {
    const [isVisible, setIsVisible] = useState(visible);
    const [status, setStatus] = useState({});
    const video = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
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
                    <Text style={styles.modalText}>Sigue las señas para pedir tu orden!</Text>
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
                    <Button title="Close" onPress={handleClose} />
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

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    video: {
        width: '80%',
        height: 400,
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
});
export default CustomModal;