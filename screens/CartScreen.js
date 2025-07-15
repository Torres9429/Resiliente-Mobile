"use client"

import React, { useContext, useState } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
  Alert,
} from "react-native"
import { CartContext } from "../context/CartContext"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import CustomModal from "../components/CustomModal"
import GeneralInstructionsModal from "../components/GeneralInstructionsModal" 
import { Video, ResizeMode } from "expo-av"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useUserHome } from "../context/UserHomeContext"
import InstructionsModal from "../components/InstructionsModal"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const { width } = Dimensions.get("window")

const CartScreen = () => {
  const { cart, removeFromCart, addToCart } = useContext(CartContext)
  const { instructionsText, generalInstructionsText } = useUserHome() // Obtener textos del contexto

  const [modalVisible, setModalVisible] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const [signCarouselVisible, setSignCarouselVisible] = useState(false)
  const [generalInstructionsModalVisible, setGeneralInstructionsModalVisible] = useState(false) // Nuevo estado para el modal de instrucciones generales
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [waiterInfo, setWaiterInfo] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false)

  const handleInstructionsModal = (product) => {
    setSelectedProduct(product)
    setInstructionsModalVisible(true)
  }
  // Cargar información del mesero al montar el componente
  React.useEffect(() => {
    loadWaiterInfo()
    getProductVideos()
    console.log("Carrito actualizado:", cart);
  }, [])

  const loadWaiterInfo = async () => {
    try {
      const savedWaiter = await AsyncStorage.getItem("selectedWaiter")
      if (savedWaiter) {
        setWaiterInfo(JSON.parse(savedWaiter))
      }
    } catch (error) {
      console.error("Error loading waiter info:", error)
    }
  }

  // Calcula el total considerando la cantidad de cada producto
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0).toFixed(2)
  }

  const handleModal = (video) => {
    setModalVisible(true)
    setVideoUri(video)
  }

  // Obtener videos de productos con señas
  const getProductVideos = () => {
    return cart
      .filter((item) => item.sena?.video)
      .map((item) => ({
        id: item.id,
        nombre: item.nombre,
        video: item.sena.video,
        cantidad: item.cantidad || 1,
      }))
      
  }

  const handleShowSignCarousel = () => {
    const videos = getProductVideos()
    if (videos.length > 0) {
      setCurrentVideoIndex(0)
      setSignCarouselVisible(true)
    } else {
      Alert.alert("Sin videos", "No hay productos con señas en tu carrito")
    }
  }

  const handleShowGeneralInstructions = () => {
    setGeneralInstructionsModalVisible(true)
  }

  // Nuevo: función para restar cantidad
  const decreaseQuantity = (item) => {
    if (item.cantidad > 1) {
      addToCart({ ...item, cantidad: -1 })
    } else {
      removeFromCart(item.id)
    }
  }

  // Nuevo: función para sumar cantidad
  const increaseQuantity = (item) => {
    addToCart({ ...item, cantidad: 1 })
  }

  const renderVideoCarouselItem = ({ item, index }) => {
    const videos = getProductVideos()
    const currentItem = videos[index]

    return (
      <View style={styles.videoCarouselItem}>
        <Text style={styles.videoItemTitle}>{currentItem.nombre}</Text>
        <Text style={styles.videoItemQuantity}>Cantidad: {currentItem.cantidad}</Text>
        <Video
          source={{ uri: currentItem.video }}
          style={styles.carouselVideo}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={index === currentVideoIndex}
        />
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.foto ? { uri: item.foto } : require("../assets/default-food.png")} style={styles.image} />
      <View style={styles.infoSection}>
        <View style={styles.actionsRow}>
          <Text style={styles.name}>{item.nombre}</Text>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
          {waiterInfo &&waiterInfo.condicion?.id === 1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleModal(item.sena?.video)}
            >
              <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => handleInstructionsModal(item)}>
              <MaterialCommunityIcons name="format-list-bulleted" size={rw(6)} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.category}>{item.categoria}</Text>
        <View style={styles.counterRowPrice}>
          <Text style={styles.price}>${item.precio.toFixed(2)}</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.counterButton} onPress={() => decreaseQuantity(item)}>
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.cantidad}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={() => increaseQuantity(item)}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CustomModal visible={modalVisible} videoUri={videoUri} onClose={() => setModalVisible(false)} />
      <InstructionsModal
        visible={instructionsModalVisible}
        product={selectedProduct}
        onClose={() => setInstructionsModalVisible(false)}
      />
    </View>
  )

  const renderWaiterActionButton = () => {
    if (!waiterInfo) {
      return null // No mostrar nada si no hay mesero seleccionado
    }else{
      console.log("Mesero seleccionado:",waiterInfo);
    }
    if (cart.length === 0) {
      return null // No mostrar botón si el carrito está vacío
      
    }

    if (waiterInfo.condicion?.id === 1 ) {
      // Mesero de Lengua de Señas
      return (
        <View style={styles.signOptionsContainer}>
          <Text style={styles.signOptionsTitle}>Instrucciones en Lengua de Señas</Text>
          <TouchableOpacity style={styles.signOptionButton} onPress={handleShowSignCarousel}>
            <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
            <Text style={styles.signOptionText}>Ver señas de mis productos</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return null
      // Mesero de Instrucciones de Texto
      /* return (
        <View style={styles.signOptionsContainer}>
          <Text style={styles.signOptionsTitle}>Instrucciones de Texto</Text>
          <TouchableOpacity style={styles.signOptionButton} onPress={handleShowGeneralInstructions}>
            <MaterialCommunityIcons name="text-box-outline" size={24} color="#fff" />
            <Text style={styles.signOptionText}>Ver instrucciones generales</Text>
          </TouchableOpacity>
        </View>
      ) */
    }
    return null // Para otras condiciones o si no hay condición
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Carrito</Text>

      

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          {/* Opciones de acción según el mesero */}
          {renderWaiterActionButton()}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${getTotal()}</Text>
          </View>
        </>
      )}

      {/* Modal del carrusel de videos de señas */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={signCarouselVisible}
        onRequestClose={() => setSignCarouselVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.signCarouselModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Señas de tus productos</Text>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setSignCarouselVisible(false)}>
                <MaterialCommunityIcons name="close" size={30} color="#BACA16" />
              </TouchableOpacity>
            </View>

            <Text style={styles.instructionsText}>{instructionsText}</Text>

            <FlatList
              data={getProductVideos()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderVideoCarouselItem}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width)
                setCurrentVideoIndex(index)
              }}
              style={styles.videoCarousel}
            />

            {/* Indicadores de paginación */}
            <View style={styles.paginationContainer}>
              {getProductVideos().map((_, index) => (
                <View
                  key={index}
                  style={[styles.paginationDot, index === currentVideoIndex && styles.paginationDotActive]}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Nuevo: Modal para instrucciones generales */}
      <GeneralInstructionsModal
        visible={generalInstructionsModalVisible}
        onClose={() => setGeneralInstructionsModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  signOptionsContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: rw(3),
    padding: rw(4),
    marginBottom: rh(2),
    borderLeftWidth: 4,
    borderLeftColor: "#BACA16",
    maxWidth: "95%",
    alignSelf: "center",
  },
  signOptionsTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    color: "#333",
    marginBottom: rh(2),
    textAlign: "center",
  },
  signOptionButton: {
    flexDirection: "row",
    backgroundColor: "#BACA16",
    paddingHorizontal: rw(4),
    paddingVertical: rh(2),
    borderRadius: rw(3),
    alignItems: "center",
    justifyContent: "center",
  },
  signOptionText: {
    color: "#fff",
    marginLeft: rw(2),
    fontSize: rf(2),
    fontWeight: "600",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: "space-between",
  },
  infoSection: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    paddingVertical: 8,
    flexDirection: "column",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginLeft: 8,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "50%",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  category: {
    fontSize: 16,
    color: "#777",
    marginBottom: 4,
  },
  counterRowPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    justifyContent: "flex-end",
    flex: 1,
  },
  counterButton: {
    backgroundColor: "#BACA16",
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 4.5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
    minWidth: 32,
    textAlign: "center",
    color: "#333",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  removeButton: {
    backgroundColor: "#f6c80d",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#597cff",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
  },
  totalContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  signCarouselModal: {
    backgroundColor: "white",
    borderRadius: rw(5),
    padding: rw(5),
    maxHeight: '95%',
    minHeight: '80%',
    bottom: 0,
    position: "absolute",
    paddingVertical: 30,
    paddingHorizontal: 0,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: rw(8),
    marginBottom: rh(2),
  },
  modalTitle: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  closeModalButton: {
    padding: rw(1),
  },
  instructionsText: {
    fontSize: rf(2),
    color: "#555",
    textAlign: "center",
    marginBottom: rh(3),
    lineHeight: rf(2.5),
    paddingHorizontal: rw(2),
  },
  videoCarousel: {
    flexGrow: 0,
  },
  videoCarouselItem: {
    width: width - rw(20),
    alignItems: "center",
    paddingHorizontal: rw(2),
  },
  videoItemTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    color: "#333",
    marginBottom: rh(0.5),
    textAlign: "center",
  },
  videoItemQuantity: {
    fontSize: rf(1.8),
    color: "#666",
    marginBottom: rh(2),
    textAlign: "center",
  },
  carouselVideo: {
    width: "100%",
    height: rh(50),
    aspectRatio: 9 / 16,
    borderRadius: rw(3),
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: rh(2),
  },
  paginationDot: {
    width: rw(2.5),
    height: rw(2.5),
    borderRadius: rw(1.25),
    backgroundColor: "#ddd",
    marginHorizontal: rw(1),
  },
  paginationDotActive: {
    backgroundColor: "#BACA16",
    width: rw(6),
    borderRadius: rw(3),
  },
})
