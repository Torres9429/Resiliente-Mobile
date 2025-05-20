import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Alert
} from 'react-native';
import { eliminarMesero, obtenerTodosLosMeseros } from '../api/waiters';
import axios from 'axios';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';


const AdminEmployeesScreen = ({ navigation }) => {
    const [waiters, setWaiters] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);  // Estado para manejar el índice expandido
    const [search, setSearch] = useState('');

    const handleSelect = (waiter) => {
        console.log("Seleccionado:", waiter);
        // navigation.navigate('NextScreen', { waiter }); // si quieres navegar
    };
    useFocusEffect(
        React.useCallback(() => {
            const fetchWaiters = async () => {
                try {
                    const response = await obtenerTodosLosMeseros();
                    console.log("Respuesta completa:", response.data);
                    if (response.data.tipo === "SUCCESS") {
                        setWaiters(response.data.datos || []);
                    } else {
                        console.error("Error en la respuesta:", response.data.mensaje);
                    }
                } catch (error) {
                    console.error("Error al obtener los meseros:", error);
                }
            };

            fetchWaiters();

            return () => {
                // Opcional: limpia estado si deseas
            };
        }, [])
    );

    const handleDelete = async (id) => {
        try {
            await eliminarMesero(id);
            Alert.alert("Éxito", "Mesero eliminado correctamente", [
                { text: "OK" },
            ]);
        } catch (error) {
            console.error("Error al eliminar mesero:", error);
            Alert.alert("Error", "No se pudo eliminar el mesero");
        }
    }

    const handleToggleDetails = (index) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);  //Si ya está expandido, lo colapsamos
        } else {
            setExpandedIndex(index);  //Expande el detalle del recurso
        }
    };
    const filteredWaiters = waiters.filter(waiter =>
        waiter.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleToggleDetails(index)}>
            <Image
                source={
                    item.foto
                        ? { uri: item.foto }
                        : require('../assets/default-avatar.png') // Imagen predeterminada si no hay foto
                }
                style={styles.image}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.presentation}>{item.presentacion}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('EditWaiter', { item })}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meseros</Text>
                <View style={styles.btns}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search" size={20} color="#416FDF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Buscar empleado..."
                            placeholderTextColor="#999"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton}
                        onPress={() => navigation.navigate('AddWaiter')}
                    >
                        <MaterialCommunityIcons name='plus' size={24} color="#fff" style={{ marginLeft: 0 }} />
                        <Text style={styles.btnText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

            </View>
            {waiters.length === 0 ? (
                <>
                    <View style={styles.bodyContainer}>
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No hay empleados disponibles
                        </Text>
                    </View>

                </>
            ) : (
                <>
                    <View style={styles.bodyContainer} >
                        <FlatList
                            data={filteredWaiters}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.list}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </>)
            }
        </View>
    );
};

export default AdminEmployeesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#000',
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '24%',
        paddingTop: 50,
        paddingHorizontal: 10,
        experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
    },
    bodyContainer: {
        width: '100%',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#fff",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25
    },
    addButton: {
        flexDirection: 'row',
        height: 50,
        width: '30%',
        backgroundColor: '#BACA16',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    btns: {

        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    btnText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 5
    },
    list: {
        paddingBottom: 0,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0.5, height: 3 },
        elevation: 3,
        margin: 8,
        flex: 1,
        maxWidth: '47%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 20,
        //aspectRatio: 1.5,
        resizeMode: 'contain'
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    presentation: {
        fontSize: 14,
        color: '#555',
    },
    detalleContainer: {
        marginTop: 5,
        padding: 0,
        borderRadius: 8,
    },
    detalleTexto: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        textAlign: 'justify',
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BACA16',
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        minHeight: 50,
        maxHeight: 50,
        marginHorizontal: 10,
        marginBottom: 35,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    button2: {
        backgroundColor: '#f6c80d',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#BACA16',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
