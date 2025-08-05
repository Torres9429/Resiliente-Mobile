"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from "react-native"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { obtenerTodosLosProductos } from "../api/menu"
import { obtenerTodosLosMeseros } from "../api/waiters"
import { obtenerTodasLasSenas } from "../api/sign"
import { obtenerTodosLosJuegos } from "../api/learn"
import { LinearGradient } from "expo-linear-gradient"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"
import { Video } from "expo-av"
import { ResizeMode } from "react-native-video"

const AdminHomeScreen = () => {
  const navigation = useNavigation()
  const { user, logout, userData } = useContext(AuthContext)
  const { theme } = useTheme()
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalWaiters: 0,
    activeWaiters: 0,
    totalSigns: 0,
    activeSigns: 0,
    totalGames: 0,
    activeGames: 0,
    recentProducts: [],
    recentWaiters: [],
    recentSigns: [],
    recentGames: [],
  })
  const [loading, setLoading] = useState(true)

  const menuItems = [
    {
      title: "Gestionar Menú",
      icon: "food",
      screen: "Menu",
      color: theme.secondaryColor,
      description: "Productos y platillos",
    },
    {
      title: "Gestionar Empleados",
      icon: "account-group",
      screen: "Employees",
      color: theme.primaryColor,
      description: "Meseros del restaurante",
    },
    {
      title: "Gestionar Señas",
      icon: "hand-clap",
      screen: "Signs",
      color: theme.accentColor,
      description: "Videos en LSM",
    },
    {
      title: "Gestionar Juegos",
      icon: "game-controller",
      screen: "Games",
      color: theme.tertiaryColor,
      description: "Contenido educativo",
    },
  ]

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [productsRes, waitersRes, signsRes, gamesRes] = await Promise.all([
        obtenerTodosLosProductos(),
        obtenerTodosLosMeseros(),
        obtenerTodasLasSenas(),
        obtenerTodosLosJuegos(),
      ])

      // Procesar productos
      const products = productsRes.data.datos || []
      const activeProducts = products.filter((product) => product.status === true)
      const recentProducts = products.sort((a, b) => b.id - a.id).slice(0, 5)

      // Procesar meseros
      const waiters = waitersRes.data.datos || []
      const activeWaiters = waiters.filter((waiter) => waiter.status === true)
      const recentWaiters = waiters.sort((a, b) => b.id - a.id).slice(0, 5)

      // Procesar señas
      const signs = signsRes.data.datos || []
      const activeSigns = signs.filter((sign) => sign.status === true)
      const recentSigns = signs.sort((a, b) => b.id - a.id).slice(0, 5)

      // Procesar juegos
      const games = gamesRes.data.datos || []
      const activeGames = games.filter((game) => game.status === true)
      const recentGames = games.sort((a, b) => b.id - a.id).slice(0, 5)

      setStats({
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        totalWaiters: waiters.length,
        activeWaiters: activeWaiters.length,
        totalSigns: signs.length,
        activeSigns: activeSigns.length,
        totalGames: games.length,
        activeGames: activeGames.length,
        recentProducts: recentProducts,
        recentWaiters: recentWaiters,
        recentSigns: recentSigns,
        recentGames: recentGames,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const renderRecentProduct = ({ item }) => (
    <View
      style={[styles.recentItemCard, { backgroundColor: theme.cardBackground }]}
    >
      <Image
        source={item.foto ? { uri: item.foto } : require("../assets/default-food.png")}
        style={styles.recentItemImage}
      />
      <View style={styles.recentItemInfo}>
        <Text style={[styles.recentItemName, { color: theme.textColor }]} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={[styles.recentItemCategory, { color: theme.textColor }]}>{item.categoria}</Text>
        <Text style={styles.recentItemPrice}>${item.precio.toFixed(2)}</Text>
      </View>
    </View>
  )

  const renderRecentSign = ({ item }) => (
    <View
      style={[styles.recentItemCard, { backgroundColor: theme.cardBackground }]}
    >
      {item.video && item.video !== "" ? (
                <Video
                    source={{ uri: item.video }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    useNativeControls
                />
            ) : (
                <View style={styles.videoOff}>
                    <MaterialCommunityIcons name="video-off" size={rw(10)} color="#ccc" />
                    <Text style={[styles.noVideoText, { color: theme.textColor }]}>Video no disponible</Text>
                </View>
            )}
      <View style={styles.recentItemInfo}>
        <Text style={[styles.recentItemName, { color: theme.textColor }]} numberOfLines={2}>
          {item.nombre}
        </Text>
      </View>
    </View>
  )
  const renderRecentWaiter = ({ item }) => (
    <View
      style={[styles.recentItemCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => navigation.navigate("Employees")}
    >
      <Image
        source={item.foto ? { uri: item.foto } : require("../assets/default-avatar.png")}
        style={styles.recentItemImage}
      />
      <View style={styles.recentItemInfo}>
        <Text style={[styles.recentItemName, { color: theme.textColor }]} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={[styles.recentItemCategory, { color: theme.textColor }]}>
          {item.condicion?.nombre || "Sin condición"}
        </Text>
        <Text style={[styles.recentItemAge, { color: theme.primaryColor }]}>{item.edad} años</Text>
      </View>
    </View>
  )
const renderRecentGame = ({ item }) => (
    <View
      style={[styles.recentItemCard, { backgroundColor: theme.cardBackground }]}
    >
      {item.video && item.video !== "" ? (
                <Video
                    source={{ uri: item.video }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    useNativeControls
                />
            ) : (
                <View style={styles.videoOff}>
                    <MaterialCommunityIcons name="video-off" size={rw(10)} color="#ccc" />
                    <Text style={[styles.noVideoText, { color: theme.textColor }]}>Video no disponible</Text>
                </View>
            )}
      <View style={styles.recentItemInfo}>
        <Text style={[styles.recentItemName, { color: theme.textColor }]} numberOfLines={2}>
          {item.nombre}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <LinearGradient colors={theme.headerGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#fff" />
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userName}>{userData?.nombre || "Administrador"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={[styles.bodyContainer, { backgroundColor: theme.backgroundColor }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Panel de estadísticas */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.secondaryColor }]}>
              <MaterialCommunityIcons name="food" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Total Productos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.primaryColor }]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalWaiters}</Text>
              <Text style={styles.statLabel}>Total Meseros</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.tertiaryColor }]}>
              <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalSigns}</Text>
              <Text style={styles.statLabel}>Total Señas</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.accentColor }]}>
              <Ionicons name="game-controller" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalGames}</Text>
              <Text style={styles.statLabel}>Total Juegos</Text>
            </View>
          </ScrollView>

          {/* Últimos productos agregados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimos Productos Agregados</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Cargando productos...</Text>
              </View>
            ) : stats.recentProducts.length > 0 ? (
              <FlatList
                data={stats.recentProducts}
                renderItem={renderRecentProduct}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentItemsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="food-off" size={48} color="#ccc" />
                <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay productos recientes</Text>
              </View>
            )}
          </View>

          {/* Últimos meseros agregados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-clock" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimos Meseros Agregados</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Cargando meseros...</Text>
              </View>
            ) : stats.recentWaiters.length > 0 ? (
              <FlatList
                data={stats.recentWaiters}
                renderItem={renderRecentWaiter}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentItemsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="account-off" size={48} color="#ccc" />
                <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay meseros recientes</Text>
              </View>
            )}
          </View>

          {/* Últimas señas agregadas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="hand-clap" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimas Señas Agregadas</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Cargando señas...</Text>
              </View>
            ) : stats.recentSigns.length > 0 ? (
              <FlatList
                data={stats.recentSigns}
                renderItem={renderRecentSign}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentItemsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="hand-clap-off" size={48} color="#ccc" />
                <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay señas recientes</Text>
              </View>
            )}
          </View>

          {/* Últimos juegos agregados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimos Juegos Agregados</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Cargando juegos...</Text>
              </View>
            ) : stats.recentGames.length > 0 ? (
              <FlatList
                data={stats.recentGames}
                renderItem={renderRecentGame}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentItemsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="food-off" size={48} color="#ccc" />
                <Text style={[styles.emptyText, { color: theme.textColor }]}>No hay productos recientes</Text>
              </View>
            )}
          </View>

          {/* Acciones rápidas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Gestión Rápida</Text>
            </View>

            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  {item.title === "Gestionar Juegos" ? (
                    <Ionicons name={item.icon} size={32} color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
                  )}
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Resumen general */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-box" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Resumen General</Text>
            </View>
              <View style={styles.paddingContainer}>
            <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryNumber, { color: theme.secondaryColor }]}>{stats.activeProducts}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Productos Activos</Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryNumber, { color: theme.primaryColor }]}>{stats.activeWaiters}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Meseros Activos</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryNumber, { color: theme.accentColor }]}>{stats.activeSigns}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Señas Activas</Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryNumber, { color: theme.tertiaryColor }]}>{stats.activeGames}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Juegos Activos</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-end",
    height: rh(18),
    paddingBottom: rh(6),
    paddingHorizontal: rw(3),
  },
  bodyContainer: {
    flex: 1,
    paddingTop: rh(1),
    paddingHorizontal: rw(1),
    width: "100%",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(4),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rw(5),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    marginLeft: rw(3),
  },
  welcomeText: {
    color: "#fff",
    fontSize: rf(1.8),
  },
  userName: {
    color: "#fff",
    fontSize: rf(2.2),
    fontWeight: "bold",
  },
  logoutButton: {
    padding: rw(2),
  },
  statsContainer: {
    paddingHorizontal: rw(5),
    marginTop: rh(3),
  },
  statCard: {
    padding: rw(5),
    borderRadius: rw(4),
    marginRight: rw(4),
    width: rw(40),
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: rh(2),
  },
  statNumber: {
    color: "#fff",
    fontSize: rf(3),
    fontWeight: "bold",
    marginTop: rh(0.5),
  },
  statLabel: {
    color: "#fff",
    fontSize: rf(1.6),
    marginTop: rh(0.5),
    textAlign: "center",
  },
  section: {
    marginTop: rh(1),
    paddingHorizontal: rw(0.5),
    paddingBottom: rh(2),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rh(2),
    marginLeft: rw(5),
  },
  sectionTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginLeft: rw(2),
    flex: 1,
  },
  recentItemsList: {
    paddingVertical: rh(1),
  },
  recentItemCard: {
    width: rw(35),
    marginRight: rw(3),
    borderRadius: rw(3),
    padding: rw(2),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  recentItemImage: {
    width: "100%",
    height: rh(12),
    borderRadius: rw(2),
    marginBottom: rh(1),
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    fontSize: rf(1.8),
    fontWeight: "bold",
    marginBottom: rh(0.5),
  },
  recentItemCategory: {
    fontSize: rf(1.4),
    opacity: 0.7,
    marginBottom: rh(0.5),
  },
  recentItemPrice: {
    fontSize: rf(1.6),
    color: "#BACA16",
    fontWeight: "bold",
  },
  recentItemAge: {
    fontSize: rf(1.6),
    fontWeight: "bold",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  menuItem: {
    width: rw(40),
    aspectRatio: 1,
    borderRadius: rw(4),
    padding: rw(4),
    marginBottom: rh(2),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemText: {
    color: "#fff",
    fontSize: rf(2),
    fontWeight: "bold",
    marginTop: rh(1),
    textAlign: "center",
  },
  menuItemDescription: {
    color: "#fff",
    fontSize: rf(1.4),
    marginTop: rh(0.5),
    textAlign: "center",
    opacity: 0.9,
  },
  summaryCard: {
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: rh(2),
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: rf(2.5),
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: rf(1.6),
    marginTop: rh(0.5),
    textAlign: "center",
  },
  loadingContainer: {
    padding: rw(5),
    alignItems: "center",
  },
  loadingText: {
    fontSize: rf(1.8),
  },
  emptyContainer: {
    padding: rw(5),
    alignItems: "center",
  },
  emptyText: {
    fontSize: rf(1.8),
    marginTop: rh(1),
    textAlign: "center",
  },
  video: {
    width: rw(20),
    height: rh(25),
    marginTop: rh(0),
    borderRadius: rw(2),
    aspectRatio: 9/16,
    marginBottom: rh(1),
  },
  videoOff: {
    width: rw(20),
    height: rh(25),
    marginTop: rh(0),
    marginBottom: rh(1),
    borderRadius: rw(2),
    backgroundColor: "#f5f5f5",
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 9/16,
  },
  noVideoText: {
    fontSize: rf(1.3),
    color: "#666",
    marginTop: rh(1),
  },
  paddingContainer: {
    paddingHorizontal: rw(5),
  },
})

export default AdminHomeScreen