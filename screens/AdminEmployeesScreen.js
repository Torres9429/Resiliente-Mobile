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
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
  } from "react-native-responsive-dimensions"
import { eliminarMesero, obtenerTodosLosMeseros, meserosActivos, meserosInactivos } from '../api/waiters';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';


const AdminEmployeesScreen = ({ navigation }) => {
    const [waiters, setWaiters] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);  // Estado para manejar el índice expandido
    const [search, setSearch] = useState('');
    const { theme } = useTheme();
    const [filter, setFilter] = useState('todos'); // 'todos', 'activos', 'inactivos'

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

    const handleFilterChange = async (newFilter) => {
        setFilter(newFilter);
        try {
            let response;
            if (newFilter === 'activos') {
                response = await meserosActivos();
            } else if (newFilter === 'inactivos') {
                response = await meserosInactivos();
                console.log("inactivo response: ",response);
                
            } else {
                response = await obtenerTodosLosMeseros();
            }
            if (response.data.tipo === "SUCCESS") {
                setWaiters(response.data.datos);
            }else if (response.data.tipo === "WARNING") {
                setWaiters([]);   
            }
        } catch (error) {
            console.error("Error al filtrar meseros:", error);
        }
    };

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

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <LinearGradient colors={theme.headerGradient} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={[styles.title]}>Meseros</Text>

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
                                <MaterialCommunityIcons name='plus' size={24} color="#fff" style={{ marginLeft: 0 }} />
                                <Text style={styles.btnText}>Agregar</Text>
                            </TouchableOpacity>

                        </View>
                        {/* Filtros */}
                        <View style={styles.filterContainer}>
                            <TouchableOpacity
                                style={[styles.filterButton, filter === 'activos' && styles.filterButtonActive]}
                                onPress={() => handleFilterChange('activos')}
                            >
                                <Text style={styles.filterButtonText}>Activos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filter === 'inactivos' && styles.filterButtonActive]}
                                onPress={() => handleFilterChange('inactivos')}
                            >
                                <Text style={styles.filterButtonText}>Inactivos</Text>
                            </TouchableOpacity>
                            {filter !== 'todos' && (
                                <TouchableOpacity
                                    style={[styles.filterButton, filter === 'todos' && styles.filterButtonActive]}
                                    onPress={() => handleFilterChange('todos')}
                                >
                                    <Text style={styles.filterButtonText}>Borrar filtros</Text>
                                    <MaterialCommunityIcons name='close' size={18} color="#333" style={{ marginLeft: 5 }} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    {/* Fin Filtros */}
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
    paddingTop: rh(6),
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
    paddingTop: rh(8),
    },
    list: {
    paddingBottom: rh(1),
    },
    card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: rw(3),
    padding: rw(2),
    margin: rw(2),
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    maxWidth: rw(45),
    },
    image: {
        width: rw(40),
        height: rh(18),
        borderRadius: rw(2),
        marginBottom: rh(1),
        //aspectRatio: 1.5,
        alignSelf: 'center',
    },
    name: {
        fontSize: rf(2),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    category: {
        fontSize: 12,
        color: '#777',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#BACA16',
        marginBottom: 8,
    },
    description: {
        fontSize: 12,
        color: '#555',
        marginTop: 8,
        textAlign: 'center',
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
    button2: {
        backgroundColor: '#f6c80d',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    button3: {
        backgroundColor: '#597cff',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 50,
        marginTop: 10,
    },
    detailsContainer: {
        alignItems: 'center',
    },
    gif: {
        width: 80,
        height: 80,
        marginTop: 10,
    },
    video: {
        width: 150,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: rh(1),
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
        // Sombra para Android
        elevation: 4,
        // Sombra para iOS
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
        paddingVertical: rh(0.6),
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
        fontSize: rf(1.8),
      },
});
