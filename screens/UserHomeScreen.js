import { useContext, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Platform,
} from "react-native"
import Carousel from "react-native-reanimated-carousel"
import { Video, ResizeMode } from "expo-av"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from "../context/AuthContext"
import { useUserHome } from "../context/UserHomeContext"
import { useNavigation } from "@react-navigation/native"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const { width } = Dimensions.get("window")

const UserHomeScreen = () => {
  const { user } = useContext(AuthContext)
  const { carouselData, cardText, cardTitle, lsmVideo } = useUserHome()
  const navigation = useNavigation()
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const isAdmin = user === "ADMIN"

  const handleEditPress = () => {
    if (isAdmin) {
      navigation.navigate("EditUserHome")
    }
  }

  const handleOrderPress = () => {
    if (isAdmin) {
      // Para admin, solo mostrar mensaje
      alert("Vista previa: El usuario sería redirigido a seleccionar mesero")
    } else {
      navigation.navigate("Order")
    }
  }

  const renderCarouselItem = ({ item, index }) => {
    const imageSource = item.isDefault ? item.image : { uri: item.image }
    return (
      <View style={styles.carouselItemContainer}>
        <Image source={imageSource} style={styles.carouselImage} />
        <View style={styles.imageOverlay}>
          {/* <View style={styles.imageNumber}>
            <Text style={styles.imageNumberText}>{index + 1}</Text>
          </View> */}
        </View>
      </View>
    )
  }

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con botón de edición para admin */}
        {isAdmin && (
          <View style={styles.adminHeader}>
            <Text style={styles.adminTitle}>Vista de Usuario</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.welcomeTitle}>¡Bienvenido a Resiliente!</Text>

        {/* Carrusel mejorado para imágenes cuadradas */}
        <View style={styles.carouselSection}>
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={rw(95)}
              height={rw(85)}
              style={styles.carousel}
              pagingEnabled={true}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              autoPlay={true}
              autoPlayInterval={5000}
              data={carouselData}
              scrollAnimationDuration={800}
              renderItem={renderCarouselItem}
              onSnapToItem={(index) => setCurrentIndex(index)}
            />
          </View>

          {/* Indicadores de paginación */}
          {renderPaginationDots()}
        </View>

        {/* Card con contenido editable - Ahora adaptable */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{cardTitle}</Text>
            {/* Video LSM */}
            {lsmVideo && (
              <TouchableOpacity style={styles.lsmButton} onPress={() => setVideoModalVisible(true)}>
                <MaterialCommunityIcons name="hand-clap" size={20} color="#BACA16" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.cardText}>{cardText}</Text>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={handleOrderPress}>
          <Text style={styles.orderButtonText}>{isAdmin ? "Vista previa: ¡Ordena ahora!" : "¡Ordena ahora!"}</Text>
        </TouchableOpacity>

        {/* Espaciado adicional para evitar que el botón quede muy pegado al final */}
        <View style={styles.bottomSpacing} />

        {/* Modal para video LSM */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={videoModalVisible}
          onRequestClose={() => setVideoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setVideoModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={40} color="#BACA16" />
              </TouchableOpacity>
              {lsmVideo && (
                <Video
                  source={{ uri: lsmVideo }}
                  style={styles.modalVideo}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={true}
                />
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: rh(2),
    paddingBottom: rh(5),
  },
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: rw(5),
    marginBottom: rh(2),
  },
  adminTitle: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    color: "#666",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#BACA16",
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    borderRadius: rw(5),
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    marginLeft: rw(2),
    fontSize: rf(2),
    fontWeight: "600",
  },
  welcomeTitle: {
    fontSize: rf(3),
    fontWeight: "bold",
    marginBottom: rh(3),
    textAlign: "center",
    paddingHorizontal: rw(5),
    marginTop: Platform.OS === 'ios' ? 0 : rh(2),
  },
  carouselSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: rh(4),
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  carousel: {
    marginBottom: 0,
  },
  carouselItemContainer: {
    position: "relative",
    borderRadius: rw(4),
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: rw(3),
  },
  imageNumber: {
    backgroundColor: "rgba(186, 202, 22, 0.9)",
    borderRadius: rw(4),
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
  },
  imageNumberText: {
    color: "#fff",
    fontSize: rf(1.8),
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: rh(2),
    paddingHorizontal: rw(5),
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
  card: {
    backgroundColor: "#fff",
    marginBottom: rh(3),
    borderRadius: rw(3),
    padding: rw(5),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: rh(2),
  },
  cardTitle: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    flex: 1,
    marginRight: rw(2),
    lineHeight: rf(3),
  },
  lsmButton: {
    backgroundColor: "#f0f8ff",
    padding: rw(2),
    borderRadius: rw(5),
    borderWidth: 1,
    borderColor: "#BACA16",
    flexShrink: 0,
  },
  cardText: {
    fontSize: rf(2),
    color: "#555",
    lineHeight: rf(2.8),
    textAlign: "left",
  },
  orderButton: {
    backgroundColor: "#BACA16",
    paddingHorizontal: rw(6),
    paddingVertical: rh(2),
    borderRadius: rw(3),
    alignItems: "center",
    width: "80%",
    marginTop: rh(2),
  },
  orderButtonText: {
    color: "#fff",
    fontSize: rf(2.2),
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomSpacing: {
    height: rh(1),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "transparent",
    borderRadius: rw(5),
    padding: rw(5),
    width: "90%",
    maxHeight: "80%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: rh(3),
    right: rw(7),
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: rw(20),
  },
  modalVideo: {
    width: "100%",
    height: rh(60),
    borderRadius: rw(3),
  },
})

export default UserHomeScreen
