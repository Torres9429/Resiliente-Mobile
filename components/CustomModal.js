import { Video, ResizeMode } from 'expo-av';
import { useState, useEffect, useRef } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

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
                    <Text style={styles.modalText}>Sigue las señas para pedir tu orden!</Text>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                            //uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                            uri: videoUri,
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
        width: 300,
        height: 350,
        marginTop: 10,
        borderRadius: 10,
    }
});
export default CustomModal;