import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Image,
    KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, Alert,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToWasabi, uploadVideoToWasabi } from "../services/wasabi";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {ResizeMode, Video } from 'expo-av';
import { crearSena, actualizarSena } from "../api/sign";

const SignFormScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();

    // Modo edición y datos de la seña (si existen)
    const isEdit = route?.params?.isEdit || false;
    const signData = route?.params?.signData || {};

    const [nombre, setNombre] = useState(signData.nombre || "");
    const [status, setStatus] = useState(signData.status ?? true);
    const [video, setVideo] = useState(signData.video || "");
    const [uploading, setUploading] = useState(false);

    const handleGuardar = async () => {
        if (!nombre || !video) {
            Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            setUploading(true);
            let videoUrl = video;

            if (video && !video.startsWith('http')) {
                videoUrl = await uploadVideoToWasabi(video);
            }

            const senaPayload = {
                video: videoUrl,
                nombre,
                status
            };

            console.log('Datos a enviar:', senaPayload);
            if (isEdit) {
                await actualizarSena(signData.id, senaPayload);
            } else {
                await crearSena(senaPayload);
            }

            setUploading(false);
            Alert.alert("Éxito", isEdit ? "Seña actualizada correctamente" : "Seña guardada correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error("Error al guardar seña:", error);
            setUploading(false);
            Alert.alert("Error", isEdit ? "No se pudo actualizar la seña. Por favor, inténtalo de nuevo más tarde." : "No se pudo guardar la seña. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    const handleSelectVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos','images','livePhotos'],
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });
        console.log(result);
        
        if (!result.canceled) {
            setVideo(result.assets[0].uri);
        }
        
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
                </TouchableOpacity>
                <Text style={styles.title}>{isEdit ? 'Editar seña' : 'Agregar seña'}</Text>
                <Text style={styles.subtitle}>
                    {isEdit ? 'Modifica los campos para actualizar la seña.' : 'Completa los campos para agregar la seña.'}
                </Text>
            </View>
            <View style={styles.bodyContainer}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            <View style={{ zIndex: 1000 }}>
                                <Text style={styles.label}>Nombre</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre de la seña"
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                            {isEdit && (
                                <View style={{ zIndex: 500 }}>
                                    <View style={styles.switchContainer}>
                                        <Text style={styles.label}>Estado </Text>
                                        <Switch
                                            value={status}
                                            onValueChange={setStatus}
                                            trackColor={{ false: "#ccc", true: "#BACA16" }}
                                            thumbColor="#fff"
                                        />
                                        <Text style={{ marginLeft: 10 }}>{status ? "Activo" : "Inactivo"}</Text>
                                    </View>
                                </View>
                            )}
                            <View style={{ zIndex: 1 }}>
                                <Text style={styles.label}>Video</Text>
                                <TouchableOpacity
                                    style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
                                    onPress={handleSelectVideo}
                                >
                                    <Text style={{ color: '#888' }}>
                                        {video ? "Cambiar video" : "Seleccionar video"}
                                    </Text>
                                </TouchableOpacity>
                                {video && (
                                    <Video source={{ uri: video }} style={styles.videoPreview}
                                    resizeMode={ResizeMode.COVER} 
                                    useNativeControls/>
                                )}
                            </View>
                            <TouchableOpacity
                style={[styles.button, uploading && { opacity: 0.7 }]}
                onPress={handleGuardar}
                disabled={uploading}
            >
                <Text style={styles.buttonText}>{uploading ? (isEdit ? "Actualizando..." : "Guardando...") : (isEdit ? "Actualizar" : "Guardar")}</Text>
            </TouchableOpacity>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '25%',
        paddingTop: 50,
        paddingHorizontal: 10,
        //backgroundColor: '#BACA16',
        experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
    },
    bodyContainer: {
        width: '100%',
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
        top: 10,
        color: '#000'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
        color: '#333'
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: "#BACA16",
        padding: 12,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
        bottom: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    backButton: {
        position: "absolute",
        top: 45,
        left: 20,
        zIndex: 1,
        borderRadius: 50,
        padding: 5,
        //backgroundColor: "rgba(187, 202, 22, 0.35)", // semi-transparente
        backgroundColor: "rgba(255, 255, 255, 0.55)",
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    videoPreview: {
        width: '50%',              // ocupa todo el ancho disponible
        maxWidth: 360,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        aspectRatio: 9/16,
        marginBottom: 30
    },
    dropdown: {
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
        minHeight: 50,
    },
    dropdownContainer: {
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },
    dropdownText: {
        color: '#333',
    },
});

export default SignFormScreen;
