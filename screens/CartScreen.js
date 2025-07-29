import React, { useState, useEffect, useContext } from "react"
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
import { useFocusEffect } from "@react-navigation/native"


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
useFocusEffect(
    React.useCallback(() => {    loadWaiterInfo()
    getProductVideos()
    console.log("Carrito actualizado:", cart);
  }, [cart]),
)

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

  // Modificar el renderVideoCarouselItem para centrar mejor los videos
const renderVideoCarouselItem = ({ item, index }) => {
  const videos = getProductVideos()
  const currentItem = videos[index]

  return (
    <View style={styles.videoCarouselItem}>
      <Text style={styles.videoItemTitle}>{currentItem.nombre}</Text>
      <Text style={styles.videoItemQuantity}>Cantidad: {currentItem.cantidad}</Text>
      <View style={styles.videoWrapper}>
        <Video
          source={{ uri: currentItem.video }}
          style={styles.carouselVideo}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay={index === currentVideoIndex}
          isMuted={true}
        />
      </View>
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
            <Ionicons name="trash" size={rw(6)} color="#fff" />
          </TouchableOpacity>
          {waiterInfo &&waiterInfo.condicion?.id === 1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleModal(item.sena?.video)}
            >
              <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
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
              <Ionicons name="remove" size={rw(5)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.cantidad}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={() => increaseQuantity(item)}>
              <Ionicons name="add" size={rw(5)} color="#fff" />
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
            <MaterialCommunityIcons name="play-circle" size={rw(6)} color="#fff" />
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
                <MaterialCommunityIcons name="close" size={rw(7.5)} color="#BACA16" />
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
    padding: rw(4), // Changed to responsive width
  },
  title: {
    fontSize: rf(3), // Changed to responsive font size
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: rh(2), // Changed to responsive height
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
    paddingBottom: rh(2), // Changed to responsive height
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: rw(3), // Changed to responsive width
    padding: rw(2.5), // Changed to responsive width
    margin: rw(2), // Changed to responsive width
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: rh(0.6), // Changed to responsive height
    elevation: 2,
    justifyContent: "space-between",
  },
  infoSection: {
    flex: 1,
    marginLeft: rw(3), // Changed to responsive width
    justifyContent: "center",
    paddingVertical: rh(1), // Changed to responsive height
    flexDirection: "column",
  },
  image: {
    width: rw(22.5), // Changed to responsive width
    height: rw(22.5), // Changed to responsive width
    borderRadius: rw(2), // Changed to responsive width
    marginLeft: rw(2), // Changed to responsive width
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  name: {
    fontSize: rf(2), // Changed to responsive font size
    fontWeight: "bold",
    color: "#333",
    width: "50%",
  },
  price: {
    fontSize: rf(2.2), // Changed to responsive font size
    fontWeight: "bold",
    marginVertical: rh(0.5), // Changed to responsive height
  },
  category: {
    fontSize: rf(2), // Changed to responsive font size
    color: "#777",
    marginBottom: rh(0.5), // Changed to responsive height
  },
  counterRowPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: rh(0.8), // Changed to responsive height
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: rh(0.8), // Changed to responsive height
    justifyContent: "flex-end",
    flex: 1,
  },
  counterButton: {
    backgroundColor: "#BACA16",
    borderRadius: rw(5), // Changed to responsive width
    padding: rw(1), // Changed to responsive width
    marginHorizontal: rw(1.1), // Changed to responsive width
  },
  counterText: {
    fontSize: rf(2.2), // Changed to responsive font size
    minWidth: rw(8), // Changed to responsive width
    textAlign: "center",
    fontWeight: "500",
    color: "#333",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: rh(0.8), // Changed to responsive height
  },
  removeButton: {
    backgroundColor: "#f6c80d",
    paddingVertical: rh(0.8), // Changed to responsive height
    paddingHorizontal: rw(1.5), // Changed to responsive width
    borderRadius: rw(12.5), // Changed to responsive width
    marginRight: rw(2.5), // Changed to responsive width
  },
  button: {
    backgroundColor: "#597cff",
    paddingVertical: rh(0.8), // Changed to responsive height
    paddingHorizontal: rw(1.5), // Changed to responsive width
    borderRadius: rw(12.5), // Changed to responsive width
  },
  totalContainer: {
    paddingTop: rh(1.5), // Changed to responsive height
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: rf(2.2), // Changed to responsive font size
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
  },
  emptyText: {
    fontSize: rf(2), // Changed to responsive font size
    color: "#666",
    textAlign: "center",
    marginTop: rh(4), // Changed to responsive height
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  signCarouselModal: {
    backgroundColor: "white",
    padding: rw(5),
    maxHeight: '95%',
    minHeight: '80%',
    bottom: 0,
    position: "absolute",
    paddingVertical: rh(3), 
    paddingHorizontal: rw(0), 
    backgroundColor: "white",
    borderTopLeftRadius: rw(12.5), 
    borderTopRightRadius: rw(12.5), 
    alignItems: "center",
    paddingBottom: rh(4), 
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
    width: width,
    alignItems: "center",
    justifyContent: "center",
    //paddingHorizontal: 20,
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
    height: "100%",
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
    transition: "all 0.3s ease",
  },
  paginationDotActive: {
    backgroundColor: "#BACA16",
    width: rw(6),
    borderRadius: rw(3),
  },
  videoWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 9/16,
    maxHeight: rh(50),
  },
})
