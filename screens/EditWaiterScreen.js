import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Image,
    KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback, Alert,
} from "react-native";
import { useContext, useState, useEffect, } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToWasabi } from "../services/wasabi";
import DropDownPicker from 'react-native-dropdown-picker';
import { actualizarMesero } from "../api/waiters";
import { obtenerTodasLasCondiciones } from "../api/disability";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EditWaiterScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;

    const [nombre, setNombre] = useState("");
    const [presentacion, setPresentacion] = useState("");
    const [edad, setEdad] = useState("");
    const [status, setStatus] = useState(true);
    const [foto, setFoto] = useState("");
    const [uploading, setUploading] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    console.log('mesero: ', item);

    useEffect(() => {
        const fetchCondiciones = async () => {
            try {
                const response1 = await obtenerTodasLasCondiciones();
                const response = response1.data.datos;
                const opciones = response.map(cond => ({
                    label: cond.nombre,
                    value: cond.id,
                }));
                setItems(opciones);
            } catch (error) {
                console.error("Error al cargar condiciones", error);
            }
        };

        fetchCondiciones();
    }, []);

    useEffect(() => {
        if (item) {
            setNombre(item.nombre || '');
            setEdad(item.edad ? item.edad.toString() : '');
            setPresentacion(item.presentacion || '');
            setStatus(item.status ?? true);
            setFoto(item.foto || '');
            setValue(item.condicion.id || null);
        }
    }, [item]);

    const handleActualizar = async () => {
        if (!nombre || !edad || !presentacion || !value) {
            Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            setUploading(true);
            let fotoUrl = foto;

            if (foto && !foto.startsWith('http')) {
                fotoUrl = await uploadImageToWasabi(foto);
            }

            const meseroActualizado = {
                condicionId: parseInt(value),
                edad: parseInt(edad),
                foto: fotoUrl,
                nombre,
                presentacion,
                status
            };

            await actualizarMesero(item.id, meseroActualizado);

            setUploading(false);
            Alert.alert("Éxito", "Mesero actualizado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            setUploading(false);
            Alert.alert("Error", "No se pudo actualizar el mesero");
        }
    };

    const handleSelectPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
                </TouchableOpacity>
                <Text style={styles.title}>Editar mesero</Text>
                <Text style={styles.subtitle}>
                    Modifica los campos para actualizar el mesero.
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
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                            <View style={{ zIndex: 1000 }}>
                                <Text style={styles.label}>Edad</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Edad"
                                    value={edad}
                                    onChangeText={setEdad}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={{ zIndex: 1000 }}>
                                <Text style={styles.label}>Presentación</Text>
                                <TextInput
                                    style={[styles.input, { height: 70 }]}
                                    placeholder="Presentación"
                                    value={presentacion}
                                    onChangeText={setPresentacion}
                                    multiline
                                />
                            </View>
                            <View style={{ zIndex: 1000 }}>
                                <Text style={styles.label}>Condición</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    placeholder="Selecciona..."
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    textStyle={styles.dropdownText}
                                    listMode="SCROLLVIEW"
                                    modalProps={{ animationType: 'slide' }}
                                />
                            </View>
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
                            <View style={{ zIndex: 500 }}>
                                <Text style={styles.label}>Foto</Text>
                                <TouchableOpacity
                                    style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
                                    onPress={handleSelectPhoto}
                                >
                                    <Text style={{ color: '#888' }}>
                                        {foto ? "Cambiar foto" : "Seleccionar foto"}
                                    </Text>
                                </TouchableOpacity>
                                {foto && (
                                    <Image source={{ uri: foto }} style={styles.imagePreview} />
                                )}
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
            <TouchableOpacity
                style={[styles.button, uploading && { opacity: 0.7 }]}
                onPress={handleActualizar}
                disabled={uploading}
            >
                <Text style={styles.buttonText}>{uploading ? "Guardando..." : "Guardar"}</Text>
            </TouchableOpacity>
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
        color: '#000',
        top: 10,
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
        alignItems: 'center'
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
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ccc'
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

export default EditWaiterScreen;
