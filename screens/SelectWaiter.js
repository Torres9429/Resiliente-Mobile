import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { obtenerTodosLosMeseros } from '../api/waiters';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelectWaiter = ({ navigation }) => {
    const [waiters, setWaiters] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);  // Estado para manejar el índice expandido

    const handleSelect = (waiter) => {
        console.log("Seleccionado:", waiter);
        // navigation.navigate('NextScreen', { waiter }); // si quieres navegar
    };
    useEffect(() => {
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
    }, [])

    const handleToggleDetails = (index) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);  // Si ya está expandido, lo colapsamos
        } else {
            setExpandedIndex(index);  // Expande el detalle del recurso
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={{ width: '100%' }}>
            <TouchableOpacity style={styles.card} onPress={() => handleToggleDetails(index)}>
                <View style={styles.row}>
                    <Image
                        source={
                            item.foto
                                ? { uri: `data:image/jpeg;base64,${item.foto}` } // Decodifica la imagen Base64
                                : require('../assets/default-avatar.png') // Imagen predeterminada si no hay foto
                        }
                        style={styles.image}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{item.nombre}</Text>
                        <Text style={styles.presentation}>{item.presentacion}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Menu', { waiter: item })} // Navega a otra pantalla
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
                {expandedIndex === index && (
                    <View style={styles.detalleContainer}>
                        <Text style={styles.detalleTexto}>Condición: {item.condicion.nombre}</Text>
                        <Text style={styles.detalleTexto}>{item.condicion.descripcion}</Text>
                    </View>
                )}
            </TouchableOpacity>

        </View>
    );

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Selecciona a tu mesero</Text>
                    <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', textAlign: 'justify', paddingHorizontal: 10 }}>
                        Selecciona el mesero que te atiende y revisa sus características para tener una mejor comunicación.
                    </Text>
                </View>

                <View style={styles.waitersContainer} >
                    <FlatList
                        data={waiters}
                        keyExtractor={(waiter, index) => waiter.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
    );
};

export default SelectWaiter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        //color: '#fff'
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '25%',
        paddingTop: 50,
        paddingHorizontal: 10,
        experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
        //backgroundColor: '#BACA16',
        color: '#fff'
    },
    waitersContainer: {
        width: '100%',
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20
    },
    list: {
        gap: 16,
        paddingHorizontal: 5,
        paddingVertical: 5,
        height: '100%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0.5, height: 3 },
        elevation: 3,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        resizeMode: 'cover',
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
        backgroundColor: '#BACA16', // Fondo del botón
        borderRadius: 20, // Botón redondeado
        width: 40,
        height: 40,
    },
});
