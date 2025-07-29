import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { CartContext } from "../context/CartContext"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import CustomModal from "../components/CustomModal"
import InstructionsModal from "../components/InstructionsModal"
import { useTheme } from "../context/ThemeContext"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const ProductDetailsScreen = () => {
  const { logout } = useContext(AuthContext)
  const route = useRoute()
  const { item, waiter } = route.params
  const navigation = useNavigation()
  const { addToCart } = useContext(CartContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false)
  const [videoUri, setVideoUri] = useState(null)
  const { theme } = useTheme()

  console.log("product", item)
  console.log("waiter in details", waiter)

  const handleModal = (video) => {
    setModalVisible(true)
    setVideoUri(video)
  }

  const handleInstructionsModal = () => {
    setInstructionsModalVisible(true)
  }

  const renderActionButton = () => {
    // Si la condición del mesero es 1, mostrar botón de señas
    if (waiter?.condicion?.id === 1) {
      return (
        <TouchableOpacity style={styles.button} onPress={() => handleModal(item?.sena?.video)}>
          <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
          <Text style={styles.buttonText}>Ver Señas</Text>
        </TouchableOpacity>
      )
    }
    // Si la condición del mesero es 2, mostrar botón de instrucciones
    else if (waiter?.condicion?.id === 2) {
      return (
        <TouchableOpacity style={[styles.button, { backgroundColor: "#597cff" }]} onPress={handleInstructionsModal}>
          <MaterialCommunityIcons name="format-list-bulleted" size={rw(6)} color="#fff" />
          <Text style={styles.buttonText}>Ver Instrucciones</Text>
        </TouchableOpacity>
      )
    }
    // Por defecto, mostrar botón de señas
    return (
      <TouchableOpacity style={styles.button} onPress={() => handleModal(item?.sena?.video)}>
        <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
        <Text style={styles.buttonText}>Ver Señas</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#BACA16" />
        </TouchableOpacity>
        <Image
          source={item?.foto ? { uri: item.foto } : require("../assets/default-food.png")}
          style={styles.foto}
          resizeMode="cover"
          onLoad={(e) => {
            const { width, height } = e.nativeEvent.source
            console.log(`Imagen original: ${width}x${height}`)
          }}
        />
      </View>

      <ScrollView style={[styles.detallesContainer, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.productName, { color: theme.textColor }]}>{item?.nombre}</Text>
        <Text style={[styles.category, { color: theme.textColor }]}>{item?.categoria}</Text>
        <Text style={styles.price}>${item?.precio.toFixed(2)}</Text>

        {waiter && (
          <View style={styles.waiterInfo}>
            <Text style={[styles.waiterLabel, { color: theme.textColor }]}>Mesero asignado:</Text>
            <Text style={[styles.waiterName, { color: theme.textColor }]}>{waiter.nombre}</Text>
            <Text style={styles.conditionText}>{waiter.condicion?.nombre || "Sin condición especificada"}</Text>
          </View>
        )}

        <Text style={[styles.descriptionTitle, { color: theme.textColor }]}>Descripción:</Text>
        <Text style={[styles.description, { color: theme.textColor }]}>{item?.descripcion}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#f6c80d" }]} onPress={() => addToCart(item)}>
            <MaterialCommunityIcons name="cart-plus" size={rw(6)} color="#fff" />
            <Text style={styles.buttonText}>Agregar al carrito</Text>
          </TouchableOpacity>

          {renderActionButton()}
        </View>

        <CustomModal visible={modalVisible} videoUri={videoUri} onClose={() => setModalVisible(false)} />

        <InstructionsModal
          visible={instructionsModalVisible}
          product={item}
          onClose={() => setInstructionsModalVisible(false)}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    height: rh(50),
    top: 0,
  },
  foto: {
    width: "100%",
    height: "90%",
    //aspectRatio: 6/12,
  },
  backButton: {
    position: "absolute",
    top: rh(5),
    left: rw(5),
    zIndex: 1,
    borderRadius: rw(12.5),
    padding: rw(2),
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  detallesContainer: {
    flex: 1,
    padding: rw(5),
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(8),
  },
  productName: {
    fontSize: rf(3.5),
    fontWeight: "bold",
    marginTop: rh(2),
    marginBottom: rh(1),
  },
  category: {
    fontSize: rf(2.2),
    color: "#666",
    marginBottom: rh(1),
  },
  price: {
    fontSize: rf(3),
    color: "#BACA16",
    fontWeight: "700",
    marginBottom: rh(2),
  },
  waiterInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: rw(3),
    padding: rw(4),
    marginBottom: rh(3),
    borderLeftWidth: 4,
    borderLeftColor: "#BACA16",
  },
  waiterLabel: {
    fontSize: rf(1.8),
    fontWeight: "600",
    marginBottom: rh(0.5),
  },
  waiterName: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginBottom: rh(0.5),
  },
  conditionText: {
    fontSize: rf(1.8),
    color: "#597cff",
    fontWeight: "500",
  },
  descriptionTitle: {
    fontSize: rf(2.5),
    color: "#000",
    fontWeight: "bold",
    marginTop: rh(2),
    marginBottom: rh(1),
  },
  description: {
    fontSize: rf(2),
    lineHeight: rf(2.8),
    marginBottom: rh(3),
  },
  buttonsContainer: {
    flexDirection: "column",
    gap: rh(2),
    marginTop: rh(2),
    marginBottom: rh(5),
  },
  button: {
    backgroundColor: "#BACA16",
    padding: rw(4),
    borderRadius: rw(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: rh(7),
  },
  buttonText: {
    color: "white",
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginLeft: rw(2),
  },
})

export default ProductDetailsScreen
