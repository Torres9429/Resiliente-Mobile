import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRoute, useNavigation } from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import CustomModal from "../components/CustomModal"
import { useTheme } from "../context/ThemeContext"
import { eliminarProducto, cambiarEstadoProducto } from "../api/menu"
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const AdminProductDetailsScreen = () => {
    const { user, userData } = useContext(AuthContext)
    const route = useRoute()
    const { product } = route.params
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const [videoUri, setVideoUri] = useState(null)
    const [productStatus, setProductStatus] = useState(product?.status)
    const { theme } = useTheme()

    const isAdmin = user === "ADMIN"
    const isEmployee = user === "EMPLEADO"

    console.log("Admin/Employee product details:", product)

    const handleModal = (video) => {
        setModalVisible(true)
        setVideoUri(video)
    }

    const handleEdit = () => {
        navigation.navigate("EditProduct", { product })
    }

    const handleDelete = () => {
        Alert.alert("Confirmar eliminación", `¿Estás seguro de que quieres eliminar "${product.nombre}"?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await eliminarProducto(product.id)
                        Alert.alert("Éxito", "Producto eliminado correctamente", [
                            { text: "OK", onPress: () => navigation.goBack() },
                        ])
                    } catch (error) {
                        console.error("Error al eliminar producto:", error)
                        Alert.alert("Error", "No se pudo eliminar el producto")
                    }
                },
            },
        ])
    }

    const handleToggleStatus = () => {
        const newStatus = !productStatus
        const statusText = newStatus ? "activar" : "desactivar"

        Alert.alert("Cambiar estado", `¿Estás seguro de que quieres ${statusText} "${product.nombre}"?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Confirmar",
                onPress: async () => {
                    try {
                        await cambiarEstadoProducto(product.id, newStatus)
                        setProductStatus(newStatus)
                        Alert.alert("Éxito", `Producto ${newStatus ? "activado" : "desactivado"} correctamente`)
                    } catch (error) {
                        console.error("Error al cambiar estado:", error)
                        Alert.alert("Error", "No se pudo cambiar el estado del producto")
                    }
                },
            },
        ])
    }

    const getStatusColor = () => {
        return productStatus ? "#4CAF50" : "#FF5722"
    }

    const getStatusText = () => {
        return productStatus ? "Activo" : "Inactivo"
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#BACA16" />
                </TouchableOpacity>
                <Image
                    source={product?.foto ? { uri: product.foto } : require("../assets/default-food.png")}
                    style={styles.foto}
                    resizeMode="cover"
                />

                {/* Badge de estado */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </View>

            <ScrollView style={[styles.detallesContainer, { backgroundColor: theme.cardBackground }]}>
                {/* Información básica del producto */}
                <View style={styles.basicInfo}>
                    <Text style={[styles.productName, { color: theme.textColor }]}>{product?.nombre}</Text>
                    <Text style={[styles.category, { color: theme.textColor }]}>{product?.categoria}</Text>
                    <Text style={styles.price}>${product?.precio.toFixed(2)}</Text>
                    <Text style={[styles.code, { color: theme.textColor }]}>Código: {product?.codigo}</Text>
                </View>

                {/* Información de la seña */}
                {product?.sena && (
                    <View style={styles.signInfo}>
                        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Seña asociada:</Text>
                        <View style={styles.signCard}>
                            <MaterialCommunityIcons name="hand-clap" size={rw(8)} color="#BACA16" />
                            <View style={styles.signDetails}>
                                <Text style={[styles.signName, { color: theme.textColor }]}>{product.sena.nombre}</Text>
                                <TouchableOpacity style={styles.viewSignButton} onPress={() => handleModal(product.sena.video)}>
                                    <MaterialCommunityIcons name="play-circle" size={rw(5)} color="#fff" />
                                    <Text style={styles.viewSignText}>Ver seña</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Descripción */}
                <View style={styles.descriptionSection}>
                    <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Descripción:</Text>
                    <Text style={[styles.description, { color: theme.textColor }]}>{product?.descripcion}</Text>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionsContainer}>
                    {/* Botón para ver seña (siempre disponible si existe) */}
                    {product?.sena?.video && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: "#BACA16" }]}
                            onPress={() => handleModal(product.sena.video)}
                        >
                            <MaterialCommunityIcons name="hand-clap" size={rw(6)} color="#fff" />
                            <Text style={styles.actionButtonText}>Ver Seña</Text>
                        </TouchableOpacity>
                    )}

                    {/* Botón de editar (admin y empleado) */}
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#f6c80d" }]} onPress={handleEdit}>
                        <MaterialCommunityIcons name="pencil" size={rw(6)} color="#fff" />
                        <Text style={styles.actionButtonText}>Editar Producto</Text>
                    </TouchableOpacity>



                    {/* Botón de eliminar (solo admin) */}

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF5722" }]} onPress={handleDelete}>
                        <MaterialCommunityIcons name="delete" size={rw(6)} color="#fff" />
                        <Text style={styles.actionButtonText}>Eliminar Producto</Text>
                    </TouchableOpacity>

                </View>

                <CustomModal visible={modalVisible} videoUri={videoUri} onClose={() => setModalVisible(false)} />
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
        marginBottom: rh(1),
    },
    code: {
        fontSize: rf(1.8),
        color: "#888",
        fontStyle: "italic",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: rw(3),
        padding: rw(4),
        marginBottom: rh(3),
        borderLeftWidth: 4,
        borderLeftColor: "#597cff",
    },
    userText: {
        marginLeft: rw(3),
    },
    userLabel: {
        fontSize: rf(1.8),
        fontWeight: "600",
        marginBottom: rh(0.5),
    },
    userName: {
        fontSize: rf(2.2),
        fontWeight: "bold",
    },
    signInfo: {
        marginBottom: rh(3),
    },
    signCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f8ff",
        borderRadius: rw(3),
        padding: rw(4),
        borderLeftWidth: 4,
        borderLeftColor: "#BACA16",
    },
    signDetails: {
        marginLeft: rw(3),
        flex: 1,
    },
    signName: {
        fontSize: rf(2),
        fontWeight: "bold",
        marginBottom: rh(1),
    },
    viewSignButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#BACA16",
        paddingHorizontal: rw(3),
        paddingVertical: rh(1),
        borderRadius: rw(5),
        alignSelf: "flex-start",
    },
    viewSignText: {
        color: "#fff",
        fontSize: rf(1.8),
        fontWeight: "600",
        marginLeft: rw(1),
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
    },
    statValue: {
        color: "#fff",
        fontSize: rf(1.4),
        marginTop: rh(0.5),
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

export default AdminProductDetailsScreen
