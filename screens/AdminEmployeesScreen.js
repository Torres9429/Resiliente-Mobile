import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator // Importa ActivityIndicator
} from 'react-native';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import { eliminarMesero, obtenerTodosLosMeseros, meserosActivos, meserosInactivos } from '../api/waiters';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const AdminEmployeesScreen = ({ navigation }) => {
    const [waiters, setWaiters] = useState([]);
    const [search, setSearch] = useState('');
    const { theme } = useTheme();
    const [filter, setFilter] = useState('todos');

    // --- CAMBIO CLAVE 1: Añadir estado de carga ---
    const [loading, setLoading] = useState(true);

    const filteredWaiters = waiters.filter(waiter =>
        waiter.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // --- CAMBIO CLAVE 2: Implementar la confirmación de eliminación ---
    const handleDelete = async (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar a este mesero?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        try {
                            await eliminarMesero(id);
                            Alert.alert("Éxito", "Mesero eliminado correctamente");
                            // Recargar la lista para reflejar el cambio
                            handleFilterChange(filter);
                        } catch (error) {
                            console.error("Error al eliminar mesero:", error);
                            Alert.alert("Error", "No se pudo eliminar el mesero");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    }

    // --- CAMBIO CLAVE 3: Ajustar filtros con el estado de carga ---
    const handleFilterChange = async (newFilter) => {
        setFilter(newFilter);
        setLoading(true); // Activar la carga
        try {
            let response;
            if (newFilter === 'activos') {
                response = await meserosActivos();
            } else if (newFilter === 'inactivos') {
                response = await meserosInactivos();
            } else {
                response = await obtenerTodosLosMeseros();
            }

            if (response.data.tipo === "SUCCESS") {
                setWaiters(response.data.datos || []); // Asegurarse de que sea un array
            } else {
                // Si la respuesta es WARNING o ERROR, vaciar la lista
                setWaiters([]);
            }
        } catch (error) {
            console.error("Error al filtrar meseros:", error);
            setWaiters([]); // Limpiar en caso de error de red
            Alert.alert("Error", "No se pudieron cargar los meseros.");
        } finally {
            setLoading(false); // Desactivar la carga en cualquier caso
        }
    };

    // --- CAMBIO CLAVE 4: Corregir useFocusEffect ---
    useFocusEffect(
        React.useCallback(() => {
            // Llama a handleFilterChange para que use el filtro actual y el estado de carga
            handleFilterChange(filter);
        }, [])
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EmployeeDetails', { waiter: item })}>
            <Image
                source={item.foto ? { uri: item.foto } : require('../assets/default-avatar.png')}
                style={styles.image}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>{item.nombre}</Text>
                <Text style={styles.presentation} numberOfLines={3}>{item.presentacion}</Text>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => navigation.navigate('EditEmployee', { item })}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button3}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // --- CAMBIO CLAVE 5: Crear un renderizador para el cuerpo ---
    const renderBody = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#BACA16" />
                    <Text style={{ marginTop: 10, color: theme.textColor }}>Cargando...</Text>
                </View>
            );
        }

        if (filteredWaiters.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="account" size={rw(20)} color="#BACA16" />
                    <Text style={[styles.emptyText, { color: theme.textColor }]}>
                        {search ? 'No se encontraron resultados' : 'No hay meseros disponibles'}
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredWaiters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                numColumns={2}
                showsVerticalScrollIndicator={false}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <LinearGradient colors={theme.headerGradient} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Meseros</Text>
                </View>
            </LinearGradient>

            <View style={styles.sectionContainer}>
                <View style={styles.btns}>
                    <View style={[styles.searchBarContainer, { backgroundColor: theme.cardBackground }]}>
                        <Ionicons name="search" size={20} color="#416FDF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Buscar mesero..."
                            placeholderTextColor="#999"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEmployee')}>
                        <MaterialCommunityIcons name='plus' size={24} color="#fff" />
                        <Text style={styles.btnText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

                {/* Filtros */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'activos' && styles.filterButtonActive]}
                        onPress={() => handleFilterChange('activos')}
                        disabled={loading} // Deshabilitar mientras carga
                    >
                        <Text style={styles.filterButtonText}>Activos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'inactivos' && styles.filterButtonActive]}
                        onPress={() => handleFilterChange('inactivos')}
                        disabled={loading} // Deshabilitar mientras carga
                    >
                        <Text style={styles.filterButtonText}>Inactivos</Text>
                    </TouchableOpacity>
                    {filter !== 'todos' && (
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => handleFilterChange('todos')}
                            disabled={loading} // Deshabilitar mientras carga
                        >
                            <Text style={styles.filterButtonText}>Borrar</Text>
                            <MaterialCommunityIcons name='close' size={18} color="#333" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.bodyContainer}>
                {renderBody()}
            </View>
        </View>
    );
};

export default AdminEmployeesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    title: {
        fontSize: rf(3),
        fontWeight: 'bold',
        marginBottom: rh(2),
        textAlign: 'center',
        color: '#fff',
        height: rh(4),
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: rh(20),
        paddingTop: Platform.OS === "ios" ? rh(6) : rh(5),
        paddingHorizontal: rw(3),
    },
    headerContent: {
        width: '100%',
        flexDirection: 'column',
        marginTop: 0,
    },
    sectionContainer: {
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    bodyContainer: {
        width: '100%',
        flex: 1,
        paddingHorizontal: rw(2),
        backgroundColor: "#fcfcfc",
        borderTopLeftRadius: rw(6),
        borderTopRightRadius: rw(6),
        marginTop: -rh(6),
        paddingTop: Platform.OS === 'ios' ? rh(8) : rh(8.5),
    },
    list: {
        paddingBottom: rh(1),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: rw(3),
        padding: rw(2.5),
        margin: rw(2),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        maxWidth: rw(45),
        justifyContent: 'space-between'
    },
    image: {
        width: '100%',
        height: rh(18),
        borderRadius: rw(2),
        marginBottom: rh(1),
    },
    infoContainer: {
        flex: 1,
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: rh(1),
    },
    name: {
        fontSize: rf(2),
        fontWeight: 'bold',
        color: '#333',
    },
    presentation: {
        fontSize: rf(1.5),
        color: '#666',
        marginTop: rh(0.5),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 'auto',
    },
    button2: {
        backgroundColor: '#f6c80d',
        padding: rw(2),
        borderRadius: 50,
    },
    button3: {
        backgroundColor: '#597cff',
        padding: rw(2),
        borderRadius: 50,
    },
    addButton: {
        flexDirection: 'row',
        height: rh(5),
        width: rw(30),
        backgroundColor: '#BACA16',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: rw(3),
        paddingHorizontal: rw(3),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    btns: {
        height: rh(5),
        width: '90%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: rh(11),
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    btnText: {
        textAlign: 'center',
        fontSize: rf(2),
        color: '#fff',
        marginHorizontal: rw(1),
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: rw(3),
        paddingHorizontal: rw(4),
        paddingVertical: Platform.OS === 'android' ? rh(0) : rh(0.6),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        minHeight: rh(5),
        maxHeight: rh(6),
        marginRight: rw(3),
        marginBottom: rh(4),
    },
    searchIcon: {
        marginRight: rw(2),
    },
    searchBar: {
        flex: 1,
        fontSize: rf(2),
        color: '#333',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: rh(1),
        paddingHorizontal: rw(2),
        top: rh(16),
        left: rw(2),
        right: 0,
    },
    filterButton: {
        paddingVertical: rh(1.2),
        paddingHorizontal: rw(4),
        backgroundColor: '#fcedb1',
        borderColor: 'rgba(187, 202, 22, 0.48)',
        borderWidth: 1,
        borderRadius: rw(10),
        marginHorizontal: rw(1.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#BACA16',
    },
    filterButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: Platform.OS === 'ios' ? rf(1.8) : rf(1.5),
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: rw(5),
    },
    emptyText: {
        fontSize: rf(2.5),
        color: "#666",
        textAlign: "center",
        marginTop: rh(2),
        fontWeight: "600",
    },
});