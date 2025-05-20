import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Image,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { actualizarProducto } from "../api/menu";
import { uploadImageToWasabi } from "../services/wasabi";

const EditProductScreen = () => {
    const { logout } = useContext(AuthContext);
    const route = useRoute();
    const navigation = useNavigation();
    const { item } = route.params;

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [codigo, setCodigo] = useState("");
    const [status, setStatus] = useState(true);
    const [foto, setFoto] = useState("");
    const [id, setId] = useState(null);
    const [keyBoardVisible, setKeyBoardVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    useEffect(() => {
        if (item) {
            setNombre(item.nombre || "");
            setDescripcion(item.descripcion || "");
            setPrecio(item.precio?.toString() || "");
            setCategoria(item.categoria || "");
            setCodigo(item.codigo || "");
            setStatus(item.status ?? true);
            setFoto(item.foto || "");
            setId(item.id || null);
        }
    }, [item]);

    const handleActualizar = async () => {
        try {
            let fotoUrl = foto;

            // Si la imagen es local (no es una URL)
            if (foto && !foto.startsWith('http')) {
                setUploading(true);
                fotoUrl = await uploadImageToWasabi(foto);
                setUploading(false);
            }

            const productoDto = {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                categoria,
                codigo,
                status,
                foto: fotoUrl,
            };

            await actualizarProducto(item.id, productoDto);
            Alert.alert("Éxito", "Producto actualizado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            setUploading(false);
            Alert.alert("Error", "No se pudo actualizar el producto");
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
            setFoto(result.assets[0].uri); // solo guardamos la URI local
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Editar producto</Text>
                <Text style={styles.subtitle}>
                    Completa los campos para editar el producto.
                </Text>
            </View>
            <View style={styles.bodyContainer}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            <TextInput
                                style={styles.input}
                                placeholder="Id"
                                value={id?.toString() || ""}
                                editable={false}
                            />

                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del producto"
                                value={nombre}
                                onChangeText={setNombre}
                            />

                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, { height: 70 }]}
                                placeholder="Descripción"
                                value={descripcion}
                                onChangeText={setDescripcion}
                                multiline
                            />

                            <Text style={styles.label}>Precio</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Precio"
                                value={precio}
                                onChangeText={setPrecio}
                                keyboardType="numeric"
                            />

                            <Text style={styles.label}>Categoría</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Categoría"
                                value={categoria}
                                onChangeText={setCategoria}
                            />

                            <Text style={styles.label}>Código</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Código"
                                value={codigo}
                                onChangeText={setCodigo}
                            />

                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Estado </Text>
                                <Switch
                                    value={status}
                                    onValueChange={setStatus}
                                    trackColor={{ false: "#ccc", true: "#BACA16" }}
                                    thumbColor={status ? "#fff" : "#fff"}
                                />
                                <Text style={{ marginLeft: 10 }}>{status ? "Activo" : "Inactivo"}</Text>
                            </View>

                            <Text style={styles.label}>Foto</Text>
                            <TouchableOpacity
                                style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
                                onPress={handleSelectPhoto}
                            >
                                <Text style={{ color: '#888' }}>
                                    {foto ? "Cambiar foto" : "Seleccionar foto"}
                                </Text>
                            </TouchableOpacity>

                            {foto ? (
                                <Image source={{ uri: foto }} style={styles.imagePreview} />
                            ) : null}

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
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '25%',
        paddingTop: 50,
        paddingHorizontal: 10,
        backgroundColor: '#BACA16',
        color: '#fff',
        // experimental_backgroundImage is not supported, so remove it or replace with something else if needed
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
        color: '#444'
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
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

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
    }
});

export default EditProductScreen;
