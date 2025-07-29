import { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { obtenerTodosLosProductos } from "../api/menu"
import { LinearGradient } from "expo-linear-gradient"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const EmployeeHomeScreen = () => {
  const navigation = useNavigation()
  const { user, logout, userData } = useContext(AuthContext)
  const { theme } = useTheme()
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    recentProducts: [],
  })
  const [loading, setLoading] = useState(true)

  const menuItems = [
    {
      title: "Ver Menú",
      icon: "food",
      screen: "MenuList",
      color: theme.secondaryColor,
      description: "Consultar productos",
    },
    {
      title: "Agregar Producto",
      icon: "plus-circle",
      screen: "AddProduct",
      color: theme.primaryColor,
      description: "Nuevo platillo",
    },
  ]

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const productsRes = await obtenerTodosLosProductos()

      if (productsRes.data.datos) {
        const products = productsRes.data.datos
        const activeProducts = products.filter((product) => product.status === true)

        // Obtener los últimos 5 productos (ordenados por ID descendente)
        const recentProducts = products.sort((a, b) => b.id - a.id).slice(0, 5)

        setStats({
          totalProducts: products.length,
          activeProducts: activeProducts.length,
          recentProducts: recentProducts,
        })
      }
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
    <TouchableOpacity
      style={[styles.recentProductCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => navigation.navigate("Menu")}
    >
      <Image
        source={item.foto ? { uri: item.foto } : require("../assets/default-food.png")}
        style={styles.recentProductImage}
      />
      <View style={styles.recentProductInfo}>
        <Text style={[styles.recentProductName, { color: theme.textColor }]} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={[styles.recentProductCategory, { color: theme.textColor }]}>{item.categoria}</Text>
        <Text style={styles.recentProductPrice}>${item.precio.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <LinearGradient colors={theme.headerGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#fff" />
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userName}>{userData?.nombre || "Empleado"}</Text>
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
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.secondaryColor }]}>
              <MaterialCommunityIcons name="food" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Total Productos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.tertiaryColor }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
              <Text style={styles.statNumber}>{stats.activeProducts}</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
          </View>

          {/* Últimos platillos agregados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Últimos Platillos Agregados</Text>
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
                contentContainerStyle={styles.recentProductsList}
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
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Acciones Rápidas</Text>
            </View>

            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vista rápida del menú */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="eye-outline" size={24} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Vista Rápida del Menú</Text>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("MenuList")}>
                <Text style={styles.viewAllText}>Ver todo</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={theme.primaryColor} />
              </TouchableOpacity>
            </View>

            <View style={[styles.quickMenuCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.quickMenuRow}>
                <View style={styles.quickMenuStat}>
                  <Text style={[styles.quickMenuNumber, { color: theme.primaryColor }]}>{stats.totalProducts}</Text>
                  <Text style={[styles.quickMenuLabel, { color: theme.textColor }]}>Total</Text>
                </View>
                <View style={styles.quickMenuStat}>
                  <Text style={[styles.quickMenuNumber, { color: theme.secondaryColor }]}>{stats.activeProducts}</Text>
                  <Text style={[styles.quickMenuLabel, { color: theme.textColor }]}>Activos</Text>
                </View>
                <View style={styles.quickMenuStat}>
                  <Text style={[styles.quickMenuNumber, { color: theme.tertiaryColor }]}>
                    {stats.totalProducts - stats.activeProducts}
                  </Text>
                  <Text style={[styles.quickMenuLabel, { color: theme.textColor }]}>Inactivos</Text>
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
    paddingVertical: rh(1),
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
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: rw(5),
    marginTop: rh(3),
  },
  statCard: {
    padding: rw(5),
    borderRadius: rw(4),
    width: rw(40),
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    marginTop: rh(4),
    paddingHorizontal: rw(5),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rh(2),
  },
  sectionTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginLeft: rw(2),
    flex: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: rf(1.8),
    color: "#597cff",
    marginRight: rw(1),
  },
  recentProductsList: {
    paddingVertical: rh(1),
  },
  recentProductCard: {
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
  recentProductImage: {
    width: "100%",
    height: rh(12),
    borderRadius: rw(2),
    marginBottom: rh(1),
  },
  recentProductInfo: {
    flex: 1,
  },
  recentProductName: {
    fontSize: rf(1.8),
    fontWeight: "bold",
    marginBottom: rh(0.5),
  },
  recentProductCategory: {
    fontSize: rf(1.4),
    opacity: 0.7,
    marginBottom: rh(0.5),
  },
  recentProductPrice: {
    fontSize: rf(1.6),
    color: "#BACA16",
    fontWeight: "bold",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItem: {
    width: rw(40),
    aspectRatio: 1,
    borderRadius: rw(4),
    padding: rw(4),
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
  quickMenuCard: {
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    bottom: rh(2),
  },
  quickMenuRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickMenuStat: {
    alignItems: "center",
  },
  quickMenuNumber: {
    fontSize: rf(2.5),
    fontWeight: "bold",
  },
  quickMenuLabel: {
    fontSize: rf(1.6),
    marginTop: rh(0.5),
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
})

export default EmployeeHomeScreen
