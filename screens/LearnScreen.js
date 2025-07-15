"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
  Animated,
} from "react-native"
import { Video } from "expo-av"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { obtenerTodasLasSenas } from "../api/sign"
import { useNavigation } from "@react-navigation/native"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"
import { obtenerTodosLosJuegos } from "../api/learn"

const { width } = Dimensions.get("window")
const CARD_WIDTH = rw(85)
const CARD_HEIGHT = rh(35)

const LearnScreen = () => {
  const [signs, setSigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [flippedCards, setFlippedCards] = useState({})
  const [playingVideos, setPlayingVideos] = useState({})
  const [score, setScore] = useState(0)
  const [viewedSigns, setViewedSigns] = useState(new Set())
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const { theme } = useTheme()

  useEffect(() => {
    fetchSigns()
  }, [])

  const fetchSigns = async () => {
    try {
      const response = await obtenerTodosLosJuegos()
      if (response.data && response.data.datos) {
        // Filtrar solo señas activas
        const activeSigns = response.data.datos.filter((sign) => sign.status === true)
        setSigns(activeSigns)
        console.log("Señas cargadas:", activeSigns.length)
      }
    } catch (error) {
      console.error("Error fetching signs:", error)
      if (error.response && error.response.status === 401) {
        Alert.alert("Error de autenticación", "Por favor inicia sesión para ver las señas", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ])
      } else {
        Alert.alert("Error", "No se pudieron cargar las señas. Por favor intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleCard = (id) => {
    setFlippedCards((prev) => {
      const newFlipped = { ...prev, [id]: !prev[id] }

      // Si la card se está volteando para mostrar el video
      if (newFlipped[id] && !viewedSigns.has(id)) {
        setViewedSigns((prevViewed) => new Set([...prevViewed, id]))
        setScore((prevScore) => prevScore + 10)
      }

      // Controlar reproducción de video
      if (newFlipped[id]) {
        setPlayingVideos((prev) => ({ ...prev, [id]: true }))
      } else {
        setPlayingVideos((prev) => ({ ...prev, [id]: false }))
      }

      return newFlipped
    })
  }

  const resetGame = () => {
    setFlippedCards({})
    setPlayingVideos({})
    setScore(0)
    setViewedSigns(new Set())
    Alert.alert("¡Juego reiniciado!", "Puedes empezar a aprender las señas nuevamente.")
  }

  const getProgressPercentage = () => {
    if (signs.length === 0) return 0
    return Math.round((viewedSigns.size / signs.length) * 100)
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color="#BACA16" />
        <Text style={[styles.loadingText, { color: theme.textColor }]}>Cargando señas...</Text>
      </View>
    )
  }

  if (signs.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Aprende Señas</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="hand-clap" size={rw(20)} color="#BACA16" />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay señas disponibles</Text>
          <Text style={[styles.emptySubtext, { color: theme.textColor }]}>
            Contacta al administrador para agregar contenido
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Aprende LSM</Text>
        <Text style={styles.subtitle}>Toca las tarjetas para ver las señas</Text>
      </View>

      {/* Panel de estadísticas */}
      <View style={[styles.statsPanel, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="trophy" size={rw(6)} color="#f6c80d" />
          <Text style={[styles.statLabel, { color: theme.textColor }]}>Puntos</Text>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{score}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="progress-check" size={rw(6)} color="#BACA16" />
          <Text style={[styles.statLabel, { color: theme.textColor }]}>Progreso</Text>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{getProgressPercentage()}%</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#597cff" />
          <Text style={[styles.statLabel, { color: theme.textColor }]}>Señas</Text>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {viewedSigns.size}/{signs.length}
          </Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <MaterialCommunityIcons name="refresh" size={rw(5)} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {signs.map((sign) => (
          <SignCard
            key={`sign-${sign.id}`}
            sign={sign}
            isFlipped={flippedCards[sign.id]}
            isPlaying={playingVideos[sign.id]}
            isViewed={viewedSigns.has(sign.id)}
            onToggle={() => toggleCard(sign.id)}
            theme={theme}
          />
        ))}

        {/* Mensaje de felicitación si completó todas */}
        {viewedSigns.size === signs.length && signs.length > 0 && (
          <View style={[styles.completionCard, { backgroundColor: theme.cardBackground }]}>
            <MaterialCommunityIcons name="trophy-award" size={rw(15)} color="#f6c80d" />
            <Text style={[styles.completionTitle, { color: theme.textColor }]}>¡Felicitaciones!</Text>
            <Text style={[styles.completionText, { color: theme.textColor }]}>
              Has completado todas las señas disponibles
            </Text>
            <Text style={[styles.completionScore, { color: "#BACA16" }]}>Puntuación final: {score} puntos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const SignCard = ({ sign, isFlipped, isPlaying, isViewed, onToggle, theme }) => {
  const flipAnimation = new Animated.Value(isFlipped ? 1 : 0)

  React.useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [isFlipped])

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  })

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onToggle} activeOpacity={0.9}>
      <View style={styles.card}>
        {/* Frente de la tarjeta */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            { backgroundColor: theme.cardBackground },
            { transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
          <View style={styles.cardHeader}>
            {isViewed && (
              <View style={styles.viewedBadge}>
                <MaterialCommunityIcons name="check-circle" size={rw(5)} color="#4CAF50" />
              </View>
            )}
          </View>
          <MaterialCommunityIcons name="hand-clap" size={rw(15)} color="#BACA16" style={styles.cardIcon} />
          <Text style={[styles.cardTitle, { color: theme.textColor }]}>{sign.nombre}</Text>
          <Text style={[styles.tapText, { color: theme.textColor }]}>Toca para ver la seña</Text>
          <View style={styles.cardFooter}>
            <MaterialCommunityIcons name="play-circle" size={rw(8)} color="#BACA16" />
          </View>
        </Animated.View>

        {/* Parte trasera de la tarjeta */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            { backgroundColor: theme.cardBackground },
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <View style={styles.videoContainer}>
            {sign.foto ? (
              <Video
                key={`video-${sign.id}-${isPlaying}`}
                source={{ uri: sign.foto }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                isLooping
                shouldPlay={isPlaying}
                onError={(error) => {
                  console.log("Error loading video:", error)
                }}
              />
            ) : (
              <View style={styles.noVideoContainer}>
                <MaterialCommunityIcons name="video-off" size={rw(10)} color="#ccc" />
                <Text style={[styles.noVideoText, { color: theme.textColor }]}>Video no disponible</Text>
              </View>
            )}
          </View>
          <Text style={[styles.cardTitleBack, { color: theme.textColor }]}>{sign.nombre}</Text>
          <TouchableOpacity style={styles.flipBackButton} onPress={onToggle}>
            <MaterialCommunityIcons name="arrow-left" size={rw(5)} color="#BACA16" />
            <Text style={styles.flipBackText}>Volver</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: rh(2),
    fontSize: rf(2.2),
    color: "#666",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: rh(6),
    paddingHorizontal: rw(5),
    paddingBottom: rh(3),
    backgroundColor: "#BACA16",
    borderBottomLeftRadius: rw(6),
    borderBottomRightRadius: rw(6),
  },
  backButton: {
    position: "absolute",
    top: rh(6),
    left: rw(5),
    zIndex: 1,
    borderRadius: rw(12.5),
    padding: rw(2),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: rf(3.5),
    fontWeight: "bold",
    color: "#fff",
    marginTop: rh(2),
  },
  subtitle: {
    fontSize: rf(2),
    color: "#fff",
    opacity: 0.9,
    marginTop: rh(0.5),
  },
  statsPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: rw(5),
    marginTop: rh(2),
    paddingVertical: rh(2),
    borderRadius: rw(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: rf(1.6),
    color: "#666",
    marginTop: rh(0.5),
  },
  statValue: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    color: "#333",
    marginTop: rh(0.2),
  },
  resetButton: {
    backgroundColor: "#597cff",
    borderRadius: rw(6),
    padding: rw(2),
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: rw(5),
    paddingBottom: rh(10),
  },
  cardContainer: {
    marginBottom: rh(3),
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: rw(4),
  },
  cardFace: {
    width: "100%",
    height: "100%",
    borderRadius: rw(4),
    position: "absolute",
    backfaceVisibility: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: rw(4),
  },
  cardFront: {
    backgroundColor: "#fff",
  },
  cardBack: {
    backgroundColor: "#fff",
  },
  cardHeader: {
    position: "absolute",
    top: rw(3),
    right: rw(3),
    zIndex: 1,
  },
  viewedBadge: {
    backgroundColor: "#E8F5E8",
    borderRadius: rw(4),
    padding: rw(1),
  },
  cardIcon: {
    marginBottom: rh(2),
  },
  cardTitle: {
    fontSize: rf(2.8),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: rh(1),
  },
  cardTitleBack: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: rh(1),
  },
  tapText: {
    fontSize: rf(1.8),
    color: "#666",
    textAlign: "center",
    marginBottom: rh(2),
  },
  cardFooter: {
    marginTop: rh(1),
  },
  videoContainer: {
    width: "100%",
    height: "70%",
    borderRadius: rw(3),
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  noVideoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noVideoText: {
    fontSize: rf(1.8),
    color: "#666",
    marginTop: rh(1),
  },
  flipBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: rh(1),
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
  },
  flipBackText: {
    fontSize: rf(1.8),
    color: "#BACA16",
    marginLeft: rw(1),
    fontWeight: "600",
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
  emptySubtext: {
    fontSize: rf(2),
    color: "#999",
    textAlign: "center",
    marginTop: rh(1),
  },
  completionCard: {
    backgroundColor: "#fff",
    borderRadius: rw(4),
    padding: rw(6),
    alignItems: "center",
    marginTop: rh(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  completionTitle: {
    fontSize: rf(3),
    fontWeight: "bold",
    color: "#333",
    marginTop: rh(2),
  },
  completionText: {
    fontSize: rf(2),
    color: "#666",
    textAlign: "center",
    marginTop: rh(1),
    lineHeight: rf(2.5),
  },
  completionScore: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    color: "#BACA16",
    marginTop: rh(2),
  },
})

export default LearnScreen
