import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Image,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import { useContext, useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { actualizarProducto, crearProducto } from "../api/menu";
import { uploadImageToWasabi } from "../services/wasabi";
import DropDownPicker from 'react-native-dropdown-picker';
import { obtenerTodasLasSenas } from "../api/sign";

const AddProductScreen = () => {
    const { logout } = useContext(AuthContext);
    const route = useRoute();
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

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

    const [addSign, setAddSign] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

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
        const fetchSenas = async () => {
            try {
                const response1 = await obtenerTodasLasSenas();
                console.log('aqui si llega')
                const response = response1.data.datos;
                console.log(response);

                const opciones = response.map(sign => ({
                    label: sign.nombre,
                    value: sign.id,
                }));
                console.log(opciones)
                setItems(opciones);
            } catch (error) {
                console.error("Error al cargar condiciones", error);
            }
        };

        fetchSenas();
    }, []);
    const handleSave = async () => {
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

            await crearProducto(productoDto);
            Alert.alert("Éxito", "Producto guardado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            setUploading(false);
            Alert.alert("Error", "No se pudo guardar el producto");
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

    // Función para manejar el scroll automático cuando se abre el dropdown
    const handleDropdownOpen = (isOpen) => {
        if (isOpen && scrollViewRef.current) {
            // Scroll hacia abajo para mostrar el dropdown completamente
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
                </TouchableOpacity>
                <Text style={styles.title}>Nuevo producto</Text>
                <Text style={styles.subtitle}>
                    Completa los campos para guardar el producto.
                </Text>
            </View>
            <View style={styles.bodyContainer}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} ref={scrollViewRef} >
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

                            {/*<View style={styles.switchContainer}>
                                <Text style={styles.label}>Estado </Text>
                                <Switch
                                    value={status}
                                    onValueChange={setStatus}
                                    trackColor={{ false: "#ccc", true: "#BACA16" }}
                                    thumbColor={status ? "#fff" : "#fff"}
                                />
                                <Text style={{ marginLeft: 10 }}>{status ? "Activo" : "Inactivo"}</Text>
                            </View>*/}
                            <Text style={styles.label}>Agregar seña (opcional)</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={(isOpen) => {
                                    setOpen(isOpen);
                                    handleDropdownOpen(isOpen);
                                }}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder="Selecciona..."
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                                textStyle={styles.dropdownText}
                                listMode="SCROLLVIEW"
                                modalProps={{ animationType: 'slide' }}
                                ArrowDownIconComponent={styles => (
                                    <MaterialCommunityIcons name="chevron-down" size={28} color="#BACA16"  {...styles} />
                                )}
                                ArrowUpIconComponent={styles => (
                                    <MaterialCommunityIcons name="chevron-up" size={28} color="#BACA16" {...styles} />
                                )}
                                arrowIconContainerStyle={{ height: 40, width: 40, alignSelf: 'center', marginTop: 10}}
                                labelStyle={{ color: '#bbb', fontSize: 16 }}
                                selectedItemLabelStyle={{ color: '#000', fontSize: 16 }}
                                searchable={true}
                                searchPlaceholder="Buscar..."
                                searchPlaceholderTextColor="#888"
                                searchError={() => <Text style={{ color: '#BACA16' }}>No se encontraron resultados</Text>}
                                searchStyle={{ color: '#000' }}
                                searchTextInputStyle={{ color: '#000' }}

                            />
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
                            {/*<TouchableOpacity style={[styles.button, { justifyContent: 'center', alignItems: 'center', backgroundColor: "#597cff" }]}
                                onPress={() => setAddSign(!addSign)}
                            >
                                <Text style={{ color: '#888', textAlign: 'center', marginTop: 10 }}>
                                    {addSign ? "Quitar seña" : "Agregar seña"}
                                </Text>
                            </TouchableOpacity>
                            {addSign && (
                                <View>
                                    <Text style={styles.label}>Agregar seña (opcional)</Text>
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
                                        ArrowDownIconComponent={styles => (
                                            <MaterialCommunityIcons name="chevron-down" size={24} color="#BACA16"  {...styles} />
                                        )}
                                        ArrowUpIconComponent={styles => (
                                            <MaterialCommunityIcons name="chevron-up" size={24} color="#BACA16" {...styles} />
                                        )}
                                        arrowIconContainerStyle={{ marginRight: 15, height: 40, width: 40}}
                                        labelStyle={{ color: '#bbb', fontSize: 16 }}
                                        selectedItemLabelStyle={{ color: '#000', fontSize: 16 }}
                                        searchable={true}
                                        searchPlaceholder="Buscar..."
                                        searchPlaceholderTextColor="#888"
                                        searchError={() => <Text style={{ color: '#BACA16' }}>No se encontraron resultados</Text>}
                                        searchStyle={{ color: '#000' }}
                                        searchTextInputStyle={{ color: '#000' }}

                                    />
                                </View>
                            )}*/}
                            <TouchableOpacity
                                style={[styles.button, uploading && { opacity: 0.7 }]}
                                onPress={handleSave}
                                disabled={uploading}
                            >
                                <Text style={styles.buttonText}>{uploading ? "Guardando..." : "Guardar"}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fcfcfc',

    },
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
        //paddingBottom: 90,
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
        top: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
        color: '#000'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
        color: '#333',
        textAlign: 'left'
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
        minHeight: 45,
        borderRadius: 10,
        paddingHorizontal: 14,
    },
    dropdownContainer: {
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
        height: 400
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
});

export default AddProductScreen;
