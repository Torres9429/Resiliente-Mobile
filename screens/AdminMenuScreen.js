import React, { useState, useEffect, useContext } from "react"
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert } from "react-native"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"
import { eliminarProducto, obtenerTodosLosProductos, productosActivos, productosInactivos } from "../api/menu"
import { CartContext } from "../context/CartContext"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import CustomModal from "../components/CustomModal"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../context/ThemeContext"

const AdminMenuScreen = () => {
  const navigation = useNavigation()
  const [menuItems, setMenuItems] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const { addToCart } = useContext(CartContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const [search, setSearch] = useState("")
  const [keyBoardVisible, setKeyBoardVisible] = useState()
  const { theme } = useTheme()
  const [filter, setFilter] = useState("todos")

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyBoardVisible(true)
    })

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyBoardVisible(false)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // filtros de búsqueda
  const productsFiltered = menuItems.filter((product) => product.nombre.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id) => {
    try {
      await eliminarProducto(id)
      Alert.alert("Éxito", "Producto eliminado correctamente", [{ text: "OK" }])
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      Alert.alert("Error", "No se pudo eliminar el producto")
    }
  }

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter)
    try {
      let response
      if (newFilter === "activos") {
        response = await productosActivos()
      } else if (newFilter === "inactivos") {
        response = await productosInactivos()
      } else {
        response = await obtenerTodosLosProductos()
      }
      if (response.data.tipo === "SUCCESS") {
        setMenuItems(response.data.datos)
      }
    } catch (error) {
      console.error("Error al filtrar productos:", error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchMenu = async () => {
        try {
          const response = await obtenerTodosLosProductos()
          if (response.data.tipo === "SUCCESS") {
            setMenuItems(response.data.datos)
            console.log("Respuesta completa:", response.data)
          } else {
            console.error("Error en la respuesta:", response.data.mensaje)
          }
        } catch (error) {
          console.error("Error al obtener los productos:", error)
        }
      }
      fetchMenu()
      return () => {
        // Opcional: limpiar estado
      }
    }, []),
  )

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index)
  }
  const handleModal = (video) => {
    setModalVisible(true)
    setVideoUri(video)
    console.log(video)
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
    >
      <Image source={item.foto ? { uri: item.foto } : require("../assets/default-food.png")} style={styles.image} />
      <Text style={[styles.name, { color: theme.textColor }]}>{item.nombre}</Text>
      <Text style={[styles.category, { color: theme.textColor }]}>{item.categoria}</Text>
      <Text style={[styles.price]}>${item.precio.toFixed(2)}</Text>

      {expandedIndex === index && (
        <View style={styles.detailsContainer}>
          <Text style={styles.description}>{item.descripcion}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("EditProduct", { item })}>
          <MaterialCommunityIcons name="pencil" size={rw(6)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleModal(item?.sena?.video)}>
          <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={rw(6)} color="#fff" />
        </TouchableOpacity>
      </View>
      <CustomModal visible={modalVisible} videoUri={videoUri} onClose={() => setModalVisible(false)} />
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <LinearGradient colors={theme.headerGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Menú</Text>
        </View>
      </LinearGradient>

      {menuItems.length === 0 ? (
        <>
          <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
            <Text style={{ textAlign: "center", marginTop: rh(3), color: theme.textColor }}>
              No hay productos disponibles
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.sectionContainer}>
            <View style={styles.btns}>
              <View style={[styles.searchBarContainer, { backgroundColor: theme.cardBackground }]}>
                <Ionicons name="search" size={rw(5)} color="#416FDF" style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchBar, { color: theme.textColor }]}
                  placeholder="Buscar producto..."
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddProduct")}>
                <MaterialCommunityIcons name="plus" size={rw(6)} color="#fff" style={{ marginLeft: 0 }} />
                <Text style={styles.btnText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {/* Filtros */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, filter === "activos" && styles.filterButtonActive]}
                onPress={() => handleFilterChange("activos")}
              >
                <Text style={styles.filterButtonText}>Activos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === "inactivos" && styles.filterButtonActive]}
                onPress={() => handleFilterChange("inactivos")}
              >
                <Text style={styles.filterButtonText}>Inactivos</Text>
              </TouchableOpacity>
              {filter !== "todos" && (
                <TouchableOpacity
                  style={[styles.filterButton, filter === "todos" && styles.filterButtonActive]}
                  onPress={() => handleFilterChange("todos")}
                >
                  <Text style={styles.filterButtonText}>Borrar filtros</Text>
                  <MaterialCommunityIcons name="close" size={rw(4.5)} color="#333" style={{ marginLeft: rw(1) }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Fin Filtros */}
          <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
            <FlatList
              data={productsFiltered}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              key={`${rw(100)}-${rh(100)}`} // Force re-render on orientation change
            />
          </View>
        </>
      )}
    </View>
  )
}

export default AdminMenuScreen

/* const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#000',
        height: 30,
    },
    header: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: 'flex-start',
        height: '20%',
        paddingTop: 50,
        paddingHorizontal: 10,
        //experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
        //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
    },
    headerContent: {
        width: '100%',
        //justifyContent: 'space-between',
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
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#fcfcfc",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -45,
        paddingTop: 80,
    },
    list: {
        paddingBottom: 10,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        margin: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        maxWidth: '45%',

    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        aspectRatio: 1.5,
        alignSelf: 'center',
        //resizeMode: 'center',
    },
    name: {
        fontSize: 16,
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
        marginTop: 10,
    },
    addButton: {
        flexDirection: 'row',
        height: 40,
        width: '30%',
        backgroundColor: '#BACA16',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    btns: {
        height: 40,
        width: '90%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: 90,
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    btnText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 5
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        minHeight: 40,
        maxHeight: 45,
        marginRight: 10,
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
    // --- Filtros ---
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
        paddingHorizontal: 5,
        //zIndex: 1,
        top: 130,
        left: 10,
        right: 0,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fcedb1', // Color de fondo amarillo claro
        //backgroundColor: 'rgba(246, 199, 13, 0.2)', //amarillo transparente F6C80D
        borderColor: 'rgba(187, 202, 22, 0.48)',//'#BACA16' transparente,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 5,
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
    },
}); */
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
      fontSize: rf(1.5),
      color: '#777',
      marginBottom: rh(0.5),
    },
    price: {
      fontSize: rf(1.8),
      fontWeight: 'bold',
      color: '#BACA16',
      marginBottom: rh(1),
    },
    description: {
      fontSize: rf(1.5),
      color: '#555',
      marginTop: rh(1),
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#BACA16',
      paddingVertical: rh(0.8),
      paddingHorizontal: rw(2),
      borderRadius: rw(5),
      marginTop: rh(1),
      width: rw(10),
    },
    button2: {
      backgroundColor: '#f6c80d',
      paddingVertical: rh(0.8),
      paddingHorizontal: rw(2),
      borderRadius: rw(5),
      marginTop: rh(1),
      width: rw(10),
    },
    button3: {
      backgroundColor: '#597cff',
      paddingVertical: rh(0.8),
      paddingHorizontal: rw(2),
      borderRadius: rw(5),
      marginTop: rh(1),
      width: rw(10),
    },
    detailsContainer: {
      alignItems: 'center',
    },
    gif: {
      width: rw(20),
      height: rh(10),
      marginTop: rh(1),
    },
    video: {
      width: rw(40),
      height: rh(25),
      marginTop: rh(1),
      borderRadius: rw(2),
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