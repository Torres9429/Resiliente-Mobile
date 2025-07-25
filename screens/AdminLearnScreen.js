"use client"

import React, { useState, useEffect, useContext } from "react"
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert } from "react-native"
import { eliminarJuego, juegosActivos, juegosInactivos, obtenerTodosLosJuegos } from "../api/learn"
import { CartContext } from "../context/CartContext"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import CustomModal from "../components/CustomModal"
import { useNavigation } from "@react-navigation/native"
import { ResizeMode, Video } from "expo-av"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const AdminLearnScreen = () => {
  const navigation = useNavigation()
  const [gameItems, setGameItems] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const { addToCart } = useContext(CartContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const [search, setSearch] = useState("")
  const [keyBoardVisible, setKeyBoardVisible] = useState()
  const [filter, setFilter] = useState('todos'); // 'todos', 'activos', 'inactivos'
  const { theme } = useTheme()

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
  const gamesFiltered = gameItems.filter((game) => game.nombre.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id) => {
    try {
      await eliminarJuego(id)
      Alert.alert("Éxito", "Juego eliminado correctamente", [{ text: "OK" }])
      // Recargar la lista
      fetchGames()
    } catch (error) {
      console.error("Error al eliminar juego:", error)
      Alert.alert("Error", "No se pudo eliminar el juego, por favor intente nuevamente.")
    }
  }

  const fetchGames = async () => {
    try {
      const response = await obtenerTodosLosJuegos()
      if (response.data.tipo === "SUCCESS") {
        setGameItems(response.data.datos)
        console.log("Respuesta completa juegos:", response.data)
      } else {
        console.error("Error en la respuesta:", response.data.mensaje)
      }
    } catch (error) {
      console.error("Error al obtener los juegos:", error)
    }
  }
  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    try {
      let response;
      if (newFilter === 'activas') {
        response = await juegosActivos();
      } else if (newFilter === 'inactivas') {
        response = await juegosInactivos();
      } else {
        response = await obtenerTodosLosJuegos();
      }
      if (response.data.tipo === "SUCCESS") {
        setGameItems(response.data.datos);
      } else if (response.data.tipo === "WARNING") {
        setGameItems([]);
      }
    } catch (error) {
      console.error("Error al filtrar juegos:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFilterChange(filter)
      return () => {
        // Opcional: limpiar estado
      }
    }, [filter]),
  )

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index)
  }

  const handleModal = (video) => {
    setModalVisible(true)
    setVideoUri(video)
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
      onPress={() => navigation.navigate("#", { item })}
    >
      {item.foto ? (
        <Video
          source={{ uri: item.foto }}
          style={styles.image}
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          shouldPlay={false}
        />
      ) : (
        <Image source={require("../assets/default-food.png")} style={styles.image} />
      )}
      <Text style={[styles.name, { color: theme.textColor }]}>{item.nombre}</Text>
      <Text style={[styles.category, { color: theme.textColor }]}>{item.categoria || "Juego educativo"}</Text>

      {expandedIndex === index && (
        <View style={styles.detailsContainer}>
          <Text style={[styles.description, { color: theme.textColor }]}>{item.descripcion}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("EditGame", { formType: "game", isEdit: true, item })}
        >
          <MaterialCommunityIcons name="pencil" size={rw(6)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleModal(item.foto)}>
          <MaterialCommunityIcons name="play" size={rw(6)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={() => handleDelete(item.idJuego || item.id)}>
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
          <Text style={styles.title}>Juegos de Aprendizaje</Text>
        </View>
      </LinearGradient>
      <View style={styles.sectionContainer}>
        <View style={styles.btns}>
          <View style={[styles.searchBarContainer, { backgroundColor: theme.cardBackground }]}>
            <Ionicons name="search" size={rw(5)} color="#416FDF" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchBar, { color: theme.textColor }]}
              placeholder="Buscar juego..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddGame", { formType: "game", isEdit: false })}
          >
            <MaterialCommunityIcons name="plus" size={rw(6)} color="#fff" style={{ marginLeft: 0 }} />
            <Text style={styles.btnText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        {/* Filtros */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'activas' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('activas')}
          >
            <Text style={styles.filterButtonText}>Activos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'inactivas' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('inactivas')}
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


      {gameItems.length === 0 ? (
        <>
          <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="gamepad-variant" size={rw(20)} color="#BACA16" />
              <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay juegos disponibles</Text>
              <Text style={[styles.emptySubtext, { color: theme.textColor }]}>
                Agrega juegos educativos para que los usuarios puedan aprender
              </Text>
            </View>
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
                  placeholder="Buscar juego..."
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddGame", { formType: "game", isEdit: false })}
              >
                <MaterialCommunityIcons name="plus" size={rw(6)} color="#fff" style={{ marginLeft: 0 }} />
                <Text style={styles.btnText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
            <FlatList
              data={gamesFiltered}
              keyExtractor={(item) => (item.idJuego || item.id).toString()}
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

export default AdminLearnScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  title: {
    fontSize: rf(3.2),
    fontWeight: "bold",
    marginBottom: rh(2),
    textAlign: "center",
    color: "#fff",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    height: rh(20),
    paddingTop: rh(6),
    paddingHorizontal: rw(3),
  },
  headerContent: {
    width: "100%",
    flexDirection: "column",
    marginTop: 0,
  },
  sectionContainer: {
    width: "100%",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  bodyContainer: {
    width: "100%",
    flex: 1,
    paddingVertical: rh(1),
    paddingHorizontal: rw(1),
    backgroundColor: "#fcfcfc",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(6),
    paddingTop: rh(8),
  },
  list: {
    paddingBottom: rh(10),
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: rw(3),
    padding: rw(2),
    margin: rw(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignContent: "flex-start",
    alignItems: "flex-start",
    maxWidth: rw(45),
    minHeight: rh(35),
  },
  image: {
    width: "100%",
    borderRadius: rw(2),
    marginBottom: rh(1),
    aspectRatio: 9 / 16,
    alignSelf: "center",
  },
  name: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  category: {
    fontSize: rf(1.6),
    color: "#777",
    marginBottom: rh(0.5),
  },
  price: {
    fontSize: rf(2),
    fontWeight: "bold",
    color: "#BACA16",
    marginBottom: rh(1),
  },
  description: {
    fontSize: rf(1.5),
    color: "#555",
    marginTop: rh(1),
    textAlign: "center",
  },
  button: {
    backgroundColor: "#BACA16",
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    backgroundColor: "#f6c80d",
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
    justifyContent: "center",
    alignItems: "center",
  },
  button3: {
    backgroundColor: "#597cff",
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(2),
    borderRadius: rw(5),
    marginTop: rh(1),
    width: rw(10),
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    alignItems: "center",
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
    shadowRadius: 4,
  },
  btns: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: rh(11),
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    paddingHorizontal: rw(5),
  },
  btnText: {
    textAlign: "center",
    fontSize: rf(2),
    color: "#fff",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: rw(5),
    top: -rh(5)
  },
  emptyText: {
    fontSize: rf(2.5),
    color: "#666",
    textAlign: "center",
    marginTop: rh(2),
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: rf(2),
    color: "#999",
    textAlign: "center",
    marginTop: rh(1),
    lineHeight: rf(2.5),
  },
})
