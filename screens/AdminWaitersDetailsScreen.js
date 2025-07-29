import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRoute, useNavigation } from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { eliminarMesero, cambiarEstadoMesero } from "../api/waiters"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const AdminWaitersDetailsScreen = () => {
  const { user, userData } = useContext(AuthContext)
  const route = useRoute()
  const { waiter } = route.params
  const navigation = useNavigation()
  const [waiterStatus, setWaiterStatus] = useState(waiter?.estado || true)
  const { theme } = useTheme()

  console.log("Admin waiter details:", waiter)

  const handleEdit = () => {
    navigation.navigate("EditEmployee", { item: waiter })
  }

  const handleDelete = () => {
    Alert.alert("Confirmar eliminación", `¿Estás seguro de que quieres eliminar a "${waiter.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarMesero(waiter.id)
            Alert.alert("Éxito", "Mesero eliminado correctamente", [{ text: "OK", onPress: () => navigation.goBack() }])
          } catch (error) {
            console.error("Error al eliminar mesero:", error)
            Alert.alert("Error", "No se pudo eliminar el mesero")
          }
        },
      },
    ])
  }

  const handleToggleStatus = () => {
    const newStatus = !waiterStatus
    const statusText = newStatus ? "activar" : "desactivar"

    Alert.alert("Cambiar estado", `¿Estás seguro de que quieres ${statusText} a "${waiter.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            await cambiarEstadoMesero(waiter.id, newStatus)
            setWaiterStatus(newStatus)
            Alert.alert("Éxito", `Mesero ${newStatus ? "activado" : "desactivado"} correctamente`)
          } catch (error) {
            console.error("Error al cambiar estado:", error)
            Alert.alert("Error", "No se pudo cambiar el estado del mesero")
          }
        },
      },
    ])
  }

  const getStatusColor = () => {
    return waiterStatus ? "#4CAF50" : "#FF5722"
  }

  const getStatusText = () => {
    return waiterStatus ? "Activo" : "Inactivo"
  }

  const getDisabilityIcon = (condicionId) => {
    switch (condicionId) {
      case 1:
        return "ear-hearing-off" // Sordera
      case 2:
        return "eye-off" // Ceguera
      case 3:
        return "brain" // Discapacidad cognitiva
      default:
        return "account-heart"
    }
  }

  const getDisabilityName = (condicionId) => {
    switch (condicionId) {
      case 1:
        return "Sordera"
      case 2:
        return "Ceguera"
      case 3:
        return "Discapacidad intelectual"
      default:
        return "Otra condición"
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#BACA16" />
        </TouchableOpacity>
        <Image
          source={waiter?.foto ? { uri: waiter.foto } : require("../assets/default-avatar.png")}
          style={styles.foto}
          resizeMode="cover"
        />
        {/* Badge de estado */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <ScrollView style={[styles.detallesContainer, { backgroundColor: theme.cardBackground }]}>
        {/* Información básica del mesero */}
        <View style={styles.basicInfo}>
          <Text style={[styles.waiterName, { color: theme.textColor }]}>{waiter?.nombre}</Text>
          <Text style={[styles.presentation, { color: theme.textColor }]}>{waiter?.presentacion}</Text>
          {waiter?.email && <Text style={[styles.email, { color: theme.textColor }]}>📧 {waiter.email}</Text>}
          {waiter?.telefono && <Text style={[styles.phone, { color: theme.textColor }]}>📱 {waiter.telefono}</Text>}
        </View>

        {/* Información de la condición/discapacidad */}
        {waiter?.condicion && (
          <View style={styles.conditionInfo}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Discapacidad:</Text>
            <Text style={[styles.description, { color: theme.textColor }]}>{waiter.condicion.nombre}: {waiter.condicion.descripcion}</Text>
            {/* <View style={styles.conditionCard}>
              <MaterialCommunityIcons name={getDisabilityIcon(waiter.condicion.id)} size={rw(8)} color="#BACA16" />
              <View style={styles.conditionDetails}>
                <Text style={[styles.conditionName, { color: theme.textColor }]}>
                  {getDisabilityName(waiter.condicion.id)}
                </Text>
                <Text style={[styles.conditionDescription, { color: theme.textColor }]}>
                  {waiter.condicion.descripcion}
                </Text>
              </View>
            </View> */}
          </View>
        )}

        {/* Información adicional */}
        {waiter?.descripcion && (
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Información adicional:</Text>
            <Text style={[styles.description, { color: theme.textColor }]}>{waiter.descripcion}</Text>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {/* Botón de editar */}
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#f6c80d" }]} onPress={handleEdit}>
            <MaterialCommunityIcons name="pencil" size={rw(6)} color="#fff" />
            <Text style={styles.actionButtonText}>Editar Mesero</Text>
          </TouchableOpacity>

          {/* Botón de eliminar */}
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF5722" }]} onPress={handleDelete}>
            <MaterialCommunityIcons name="delete" size={rw(6)} color="#fff" />
            <Text style={styles.actionButtonText}>Eliminar Mesero</Text>
          </TouchableOpacity>
        </View>
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
    position: "relative",
  },
  foto: {
    width: "100%",
    height: "90%",
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
  statusBadge: {
    position: "absolute",
    top: rh(5),
    right: rw(5),
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(4),
    zIndex: 1,
  },
  statusText: {
    color: "#fff",
    fontSize: rf(1.6),
    fontWeight: "bold",
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
  basicInfo: {
    marginBottom: rh(3),
  },
  waiterName: {
    fontSize: rf(3.5),
    fontWeight: "bold",
    marginTop: rh(2),
    marginBottom: rh(1),
  },
  presentation: {
    fontSize: rf(2.2),
    color: "#666",
    marginBottom: rh(1),
    fontStyle: "italic",
  },
  email: {
    fontSize: rf(1.8),
    color: "#888",
    marginBottom: rh(0.5),
  },
  phone: {
    fontSize: rf(1.8),
    color: "#888",
    marginBottom: rh(0.5),
  },
  conditionInfo: {
    marginBottom: rh(3),
  },
  conditionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: rw(3),
    padding: rw(4),
    borderLeftWidth: 4,
    borderLeftColor: "#BACA16",
  },
  conditionDetails: {
    marginLeft: rw(3),
    flex: 1,
  },
  conditionName: {
    fontSize: rf(2),
    fontWeight: "bold",
    marginBottom: rh(1),
  },
  conditionDescription: {
    fontSize: rf(1.8),
    color: "#666",
  },
  sectionTitle: {
    fontSize: rf(2.5),
    fontWeight: "bold",
    marginBottom: rh(2),
  },
  descriptionSection: {
    marginBottom: rh(3),
  },
  description: {
    fontSize: rf(2),
    lineHeight: rf(2.8),
  },
  statsSection: {
    marginBottom: rh(3),
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: rw(4),
    borderRadius: rw(3),
    marginHorizontal: rw(1),
  },
  statLabel: {
    color: "#fff",
    fontSize: rf(1.6),
    fontWeight: "600",
    marginTop: rh(1),
    textAlign: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: rf(1.4),
    marginTop: rh(0.5),
    fontWeight: "bold",
  },
  adminInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: rw(3),
    padding: rw(4),
    marginBottom: rh(3),
    borderLeftWidth: 4,
    borderLeftColor: "#597cff",
  },
  adminText: {
    marginLeft: rw(3),
  },
  adminLabel: {
    fontSize: rf(1.8),
    fontWeight: "600",
    marginBottom: rh(0.5),
  },
  adminName: {
    fontSize: rf(2.2),
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "column",
    gap: rh(2),
    marginTop: rh(2),
    marginBottom: rh(5),
  },
  actionButton: {
    backgroundColor: "#BACA16",
    padding: rw(4),
    borderRadius: rw(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: rh(7),
  },
  actionButtonText: {
    color: "white",
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginLeft: rw(2),
  },
})

export default AdminWaitersDetailsScreen
