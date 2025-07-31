import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from "react-native"
import { useContext, useState, useEffect, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRoute, useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { actualizarProducto, crearProducto } from "../api/menu"
import { actualizarMesero, crearMesero } from "../api/waiters"
import { actualizarSena, crearSena } from "../api/sign"
import { actualizarJuego, crearJuego } from "../api/learn"
import { uploadImageToWasabi, uploadVideoToWasabi } from "../services/wasabi"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import DropDownPicker from "react-native-dropdown-picker"
import { obtenerTodasLasSenas } from "../api/sign"
import { obtenerTodasLasCondiciones } from "../api/disability"
import { ResizeMode, Video } from "expo-av"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from 'expo-linear-gradient';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const FormScreen = () => {
  const { logout } = useContext(AuthContext)
  const route = useRoute()
  const navigation = useNavigation()
  const scrollViewRef = useRef(null)
  const { theme } = useTheme()

  // Parámetros de la ruta
  const {
    formType, // 'product', 'waiter', 'sign', 'game'
    isEdit = false,
    item = null,
  } = route.params || {}

  console.log("FormScreen params:", { formType, isEdit, item })

  // Estados comunes
  const [uploading, setUploading] = useState(false)
  const [keyBoardVisible, setKeyBoardVisible] = useState(false)

  // Estados para productos
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoria, setCategoria] = useState("")
  const [codigo, setCodigo] = useState("")
  const [foto, setFoto] = useState("")

  // Estados para meseros
  const [edad, setEdad] = useState("")
  const [presentacion, setPresentacion] = useState("")

  // Estados para señas y juegos
  const [video, setVideo] = useState("")

  // Estados comunes
  const [status, setStatus] = useState(true)

  // Estados para dropdowns
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [items, setItems] = useState([])

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

  useEffect(() => {
    // Cargar datos si es edición
    if (isEdit && item) {
      loadItemData()
    }

    // Cargar opciones para dropdowns
    loadDropdownOptions()
  }, [isEdit, item, formType])

  const loadItemData = () => {
    setNombre(item.nombre || "")
    setStatus(item.status ?? true)

    if (formType === "product") {
      setDescripcion(item.descripcion || "")
      setPrecio(item.precio?.toString() || "")
      setCategoria(item.categoria || "")
      setCodigo(item.codigo || "")
      setFoto(item.foto || "")
      setValue(item.sena?.id || null)
    } else if (formType === "waiter") {
      setEdad(item.edad?.toString() || "")
      setPresentacion(item.presentacion || "")
      setFoto(item.foto || "")
      setValue(item.condicion?.id || null)
    } else if (formType === "sign") {
      setVideo(item.video || "")
    } else if (formType === "game") {
      setDescripcion(item.descripcion || "")
      setCategoria(item.categoria || "Juego educativo")
      setVideo(item.foto || "") // En juegos, el video se guarda en 'foto'
    }
  }

  const loadDropdownOptions = async () => {
    try {
      if (formType === "product") {
        const response = await obtenerTodasLasSenas()
        const opciones = response.data.datos.map((sign) => ({
          label: sign.nombre,
          value: sign.id,
        }))
        setItems(opciones)
      } else if (formType === "waiter") {
        const response = await obtenerTodasLasCondiciones()
        const opciones = response.data.datos.map((cond) => ({
          label: cond.nombre,
          value: cond.id,
        }))
        setItems(opciones)
      }
    } catch (error) {
      console.error("Error al cargar opciones del dropdown", error)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setUploading(true)

      if (formType === "product") {
        await handleProductSave()
      } else if (formType === "waiter") {
        await handleWaiterSave()
      } else if (formType === "sign") {
        await handleSignSave()
      } else if (formType === "game") {
        await handleGameSave()
      }

      const action = isEdit ? "actualizado" : "guardado"
      const itemType = getItemTypeName()

      Alert.alert("Éxito", `${itemType} ${action} correctamente`, [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      setUploading(false)
      console.error(`Error al ${isEdit ? "actualizar" : "guardar"} ${formType}:`, error)
      Alert.alert("Error", `No se pudo ${isEdit ? "actualizar" : "guardar"} el ${getItemTypeName().toLowerCase()}`)
    }
  }

  const validateForm = () => {
    if (!nombre) {
      Alert.alert("Campo requerido", "El nombre es obligatorio")
      return false
    }

    if (formType === "product") {
      if (!descripcion || !precio || !categoria || !codigo) {
        Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios")
        return false
      }
    } else if (formType === "waiter") {
      if (!edad || !presentacion || !value) {
        Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios")
        return false
      }
    } else if (formType === "sign" || formType === "game") {
      /* if (!video) {
        Alert.alert("Campo requerido", "El video es obligatorio")
        return false
      } */
    }

    return true
  }

  const getFolderForType = (formType) => {
    if (formType === "waiter") return "meseros";
    if (formType === "sign" || formType === "game") return "sena";
    return "producto";
  };

  const handleProductSave = async () => {
    const folder = getFolderForType("product");
    let fotoUrl = foto;
    if (foto && !foto.startsWith("http")) {
      fotoUrl = await uploadImageToWasabi(foto, folder);
    }

    const productoDto = {
      nombre,
      descripcion,
      precio: Number.parseFloat(precio),
      categoria,
      codigo,
      status,
      idSena: value,
      foto: fotoUrl,
    };

    if (isEdit) {
      productoDto.id = item.id;
      await actualizarProducto(item.id, productoDto);
    } else {
      await crearProducto(productoDto);
    }
  };

  const handleWaiterSave = async () => {
    const folder = getFolderForType("waiter");
    let fotoUrl = foto;
    if (foto && !foto.startsWith("http")) {
      fotoUrl = await uploadImageToWasabi(foto, folder);
    }

    const meseroDto = {
      condicionId: Number.parseInt(value),
      edad: Number.parseInt(edad),
      foto: fotoUrl,
      nombre,
      presentacion,
      status,
    };

    if (isEdit) {
      await actualizarMesero(item.id, meseroDto);
    } else {
      await crearMesero(meseroDto);
    }
  };

  const handleSignSave = async () => {
    const folder = getFolderForType("sign");
    let videoUrl = video;
    if (video && !video.startsWith("http")) {
      videoUrl = await uploadVideoToWasabi(video, folder);
    }

    const senaDto = {
      video: videoUrl,
      nombre,
      status,
    };

    if (isEdit) {
      await actualizarSena(item.id, senaDto);
    } else {
      await crearSena(senaDto);
    }
  };

  const handleGameSave = async () => {
    const folder = getFolderForType("game");
    let videoUrl = video;
    if (video && !video.startsWith("http")) {
      videoUrl = await uploadVideoToWasabi(video, folder);
    }

    const juegoDto = {
      nombre,
      foto: videoUrl, // En juegos, el video se guarda en 'foto'
      status,
    };

    if (isEdit) {
      const gameId = item.idJuego || item.id;
      await actualizarJuego(gameId, juegoDto);
    } else {
      await crearJuego(juegoDto);
    }
  };

  const handleSelectMedia = async () => {
    const mediaType =
      formType === "sign" || formType === "game"
        ? ["videos"]
        : ImagePicker.MediaTypeOptions.Images

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: formType === "sign" || formType === "game" ? [9, 16] : [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (formType === "sign" || formType === "game") {
        setVideo(result.assets[0].uri)
      } else {
        setFoto(result.assets[0].uri)
      }
    }
  }

  const handleDropdownOpen = (isOpen) => {
    if (isOpen && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const getTitle = () => {
    const action = isEdit ? "Editar" : "Agregar"
    const itemType = getItemTypeName()
    return `${action} ${itemType.toLowerCase()}`
  }

  const getItemTypeName = () => {
    switch (formType) {
      case "product":
        return "Producto"
      case "waiter":
        return "Mesero"
      case "sign":
        return "Seña"
      case "game":
        return "Juego"
      default:
        return "Elemento"
    }
  }

  const renderProductFields = () => (
    <>
      <Text style={[styles.label, { color: theme.textColor }]}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Categoría</Text>
      <TextInput style={styles.input} placeholder="Categoría" value={categoria} onChangeText={setCategoria} />

      <Text style={[styles.label, { color: theme.textColor }]}>Código</Text>
      <TextInput style={styles.input} placeholder="Código" value={codigo} onChangeText={setCodigo} />

      <Text style={[styles.label, { color: theme.textColor }]}>Agregar seña (opcional)</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={(isOpen) => {
          setOpen(isOpen)
          handleDropdownOpen(isOpen)
        }}
        setValue={setValue}
        setItems={setItems}
        placeholder="Selecciona..."
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        listMode="SCROLLVIEW"
        modalProps={{ animationType: "slide" }}
        ArrowDownIconComponent={(props) => (
          <MaterialCommunityIcons name="chevron-down" size={rw(7)} color="#BACA16" {...props} />
        )}
        ArrowUpIconComponent={(props) => (
          <MaterialCommunityIcons name="chevron-up" size={rw(7)} color="#BACA16" {...props} />
        )}
        searchable={true}
        searchPlaceholder="Buscar..."
        searchPlaceholderTextColor="#888"
      />
    </>
  )

  const renderWaiterFields = () => (
    <>
      <Text style={[styles.label, { color: theme.textColor }]}>Edad</Text>
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="number-pad"
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Presentación</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Presentación"
        value={presentacion}
        onChangeText={setPresentacion}
        multiline
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Condición</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={(isOpen) => {
          setOpen(isOpen)
          handleDropdownOpen(isOpen)
        }}
        setValue={setValue}
        setItems={setItems}
        placeholder="Selecciona..."
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        listMode="SCROLLVIEW"
        modalProps={{ animationType: "slide" }}
      />
    </>
  )

  const renderGameFields = () => (
    <>
      <Text style={[styles.label, { color: theme.textColor }]}>Video del juego</Text>
      <TouchableOpacity style={[styles.input, styles.mediaButton]} onPress={handleSelectMedia}>
        <Text style={styles.mediaButtonText}>{video ? "Cambiar video" : "Seleccionar video"}</Text>
      </TouchableOpacity>
      {video && (
        <Video source={{ uri: video }} style={styles.videoPreview} resizeMode={ResizeMode.COVER} useNativeControls />
      )}
    </>
  )

  const renderSignFields = () => (
    
    
    <>
      <Text style={[styles.label, { color: theme.textColor }]}>Video</Text>
      <TouchableOpacity style={[styles.input, styles.mediaButton]} onPress={handleSelectMedia}>
        <Text style={styles.mediaButtonText}>{video ? "Cambiar video" : "Seleccionar video"}</Text>
      </TouchableOpacity>
      {video && (
        <Video source={{ uri: video }} style={styles.videoPreview} resizeMode={ResizeMode.COVER} useNativeControls />
      )}
    </>
  )

  const renderMediaSection = () => {
    if (formType === "sign" || formType === "game") return null // Ya se renderiza en sus respectivos campos

    return (
      <>
        <Text style={[styles.label, { color: theme.textColor }]}>Foto</Text>
        <TouchableOpacity style={[styles.input, styles.mediaButton]} onPress={handleSelectMedia}>
          <Text style={styles.mediaButtonText}>{foto ? "Cambiar foto" : "Seleccionar foto"}</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}
      </>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <LinearGradient colors={theme.headerGradient} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#BACA16" />
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>
          {isEdit ? "Modifica" : "Completa"} los campos para {isEdit ? "actualizar" : "agregar"}{" "}
          {getItemTypeName().toLowerCase()}.
        </Text>
      </LinearGradient>

      <View style={[styles.bodyContainer, { backgroundColor: theme.cardBackground }]}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={[styles.label, { color: theme.textColor }]}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder={`Nombre ${getItemTypeName().toLowerCase()}`}
                value={nombre}
                onChangeText={setNombre}
              />

              

              {isEdit && (
                <View style={styles.switchContainer}>
                  <Text style={[styles.label, { color: theme.textColor }]}>Estado </Text>
                  <Switch
                    value={status}
                    onValueChange={setStatus}
                    trackColor={{ false: "#ccc", true: "#BACA16" }}
                    thumbColor="#fff"
                  />
                  <Text style={[styles.switchText, { color: theme.textColor }]}>{status ? "Activo" : "Inactivo"}</Text>
                </View>
              )}
{formType === "product" && renderProductFields()}
              {formType === "waiter" && renderWaiterFields()}
              {formType === "sign" && renderSignFields()}
              {formType === "game" && renderGameFields()}
              {renderMediaSection()}

              <TouchableOpacity
                style={[styles.button, uploading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={uploading}
              >
                <Text style={styles.buttonText}>
                  {uploading ? (isEdit ? "Actualizando..." : "Guardando...") : isEdit ? "Actualizar" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
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
    minHeight: rh(25),
    paddingTop: rh(6),
    paddingHorizontal: rw(3),
    paddingBottom: rh(2),
    backgroundColor: "#51BBF5",
  },
  bodyContainer: {
    width: "100%",
    flex: 1,
    paddingHorizontal: rw(5),
    paddingTop: rh(3),
    backgroundColor: "#fff",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(3),
  },
  scrollContent: {
    paddingBottom: rh(10),
  },
  title: {
    fontSize: rf(3.2),
    fontWeight: "bold",
    marginBottom: rh(1),
    textAlign: "center",
    color: "#fff",
    top:rh(1.2)
  },
  subtitle: {
    fontSize: rf(2),
    marginBottom: rh(2),
    textAlign: "center",
    paddingHorizontal: rw(3),
    color: "#fff",
    opacity: 0.9,
    top:rh(2)
  },
  label: {
    fontSize: rf(2.2),
    fontWeight: "600",
    marginBottom: rh(0.8),
    marginTop: rh(2),
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: rw(3),
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.5),
    fontSize: rf(2),
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: rh(6),
  },
  textArea: {
    height: rh(10),
    textAlignVertical: "top",
  },
  mediaButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  mediaButtonText: {
    color: "#888",
    fontSize: rf(2),
  },
  button: {
    backgroundColor: "#BACA16",
    padding: rh(2),
    borderRadius: rw(3),
    marginTop: rh(4),
    alignItems: "center",
    minHeight: rh(7),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: rf(2.2),
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: rh(6),
    left: rw(5),
    zIndex: 1,
    borderRadius: rw(12.5),
    padding: rw(2),
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: rh(2),
  },
  switchText: {
    marginLeft: rw(3),
    fontSize: rf(2),
  },
  imagePreview: {
    width: rw(30),
    height: rw(30),
    borderRadius: rw(3),
    marginTop: rh(2),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  videoPreview: {
    width: "60%",
    maxWidth: rw(90),
    borderRadius: rw(3),
    marginTop: rh(2),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    aspectRatio: 9 / 16,
    marginBottom: rh(3),
  },
  dropdown: {
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
    minHeight: rh(6),
    borderRadius: rw(3),
    paddingHorizontal: rw(4),
  },
  dropdownContainer: {
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
    maxHeight: rh(40),
  },
  dropdownText: {
    fontSize: rf(2),
    color: "#000",
  },
})

export default FormScreen
