"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Alert, FlatList } from "react-native"
import { Video, ResizeMode } from "expo-av"
import * as ImagePicker from "expo-image-picker"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useUserHome } from "../context/UserHomeContext"
import { useTheme } from "../context/ThemeContext"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const EditUserHomeScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const {
    carouselData,
    cardText,
    cardTitle,
    lsmVideo,
    instructionsText,
    generalInstructionsText, // Nuevo: texto de instrucciones generales
    isLoading,
    updateCarouselData,
    updateCardContent,
    updateLsmVideo,
    updateInstructionsText,
    updateGeneralInstructionsText, // Nuevo: función para actualizar texto de instrucciones generales
    saveUserHomeData,
  } = useUserHome()

  const [editableCarousel, setEditableCarousel] = useState([...carouselData])
  const [editableTitle, setEditableTitle] = useState(cardTitle)
  const [editableText, setEditableText] = useState(cardText)
  const [editableVideo, setEditableVideo] = useState(lsmVideo)
  const [editableInstructions, setEditableInstructions] = useState(instructionsText)
  const [editableGeneralInstructions, setEditableGeneralInstructions] = useState(generalInstructionsText) // Nuevo estado

  const handleSave = async () => {
    try {
      await updateCarouselData(editableCarousel)
      updateCardContent(editableTitle, editableText)
      await updateLsmVideo(editableVideo)
      updateInstructionsText(editableInstructions)
      updateGeneralInstructionsText(editableGeneralInstructions) // Guardar el nuevo texto
      await saveUserHomeData()

      Alert.alert("Éxito", "Cambios guardados correctamente", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Error saving changes:", error)
      Alert.alert("Error", "No se pudieron guardar los cambios")
    }
  }

  const handleAddCarouselImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const newImage = {
        id: Date.now(),
        image: result.assets[0].uri,
        isDefault: false,
      }
      setEditableCarousel([...editableCarousel, newImage])
    }
  }

  const handleRemoveCarouselImage = (id) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta imagen?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setEditableCarousel(editableCarousel.filter((item) => item.id !== id))
        },
      },
    ])
  }

  const handleSelectVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    })

    if (!result.canceled) {
      setEditableVideo(result.assets[0].uri)
    }
  }

  const renderCarouselItem = ({ item, index }) => {
    const imageSource = item.isDefault ? item.image : { uri: item.image }

    return (
      <View style={styles.carouselItemContainer}>
        <Image source={imageSource} style={styles.carouselItemImage} />
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveCarouselImage(item.id)}>
          <MaterialCommunityIcons name="close-circle" size={24} color="#ff4444" />
        </TouchableOpacity>
        <Text style={styles.imageIndex}>{index + 1}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={rw(10)} color="#BACA16" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración de Usuario</Text>
        <Text style={styles.subtitle}>Personaliza el contenido y las instrucciones para los usuarios.</Text>
      </View>

      <View style={[styles.bodyContainer, { backgroundColor: theme.cardBackground }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Editar Carrusel */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Carrusel de Imágenes</Text>

            <FlatList
              data={editableCarousel}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCarouselItem}
              contentContainerStyle={styles.carouselList}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddCarouselImage}>
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Agregar Imagen</Text>
            </TouchableOpacity>
          </View>

          {/* Editar Título de la Card */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Título de la Tarjeta</Text>
            <TextInput
              style={styles.titleInput}
              value={editableTitle}
              onChangeText={setEditableTitle}
              placeholder="Título de la tarjeta"
              multiline
            />
          </View>

          {/* Editar Texto de la Card */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Contenido de la Tarjeta</Text>
            <TextInput
              style={[styles.textInput]}
              value={editableText}
              onChangeText={setEditableText}
              placeholder="Contenido de la tarjeta"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <Text style={styles.helperText}>💡 La tarjeta se ajustará automáticamente al tamaño del contenido</Text>
          </View>

          {/* Editar Texto de Instrucciones del Carrusel de Señas */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Instrucciones Carrusel de Señas</Text>
            <TextInput
              style={[styles.textInput]}
              value={editableInstructions}
              onChangeText={setEditableInstructions}
              placeholder="Instrucciones que aparecerán en el carrusel de señas..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.helperText}>
              ℹ️ Este texto aparecerá en el carrusel de señas cuando los usuarios vean sus productos
            </Text>
          </View>

          {/* Nuevo: Editar Texto de Instrucciones Generales del Carrito */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Instrucciones Generales del Carrito</Text>
            <TextInput
              style={[styles.textInput]}
              value={editableGeneralInstructions}
              onChangeText={setEditableGeneralInstructions}
              placeholder="Instrucciones generales para el mesero de texto..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.helperText}>
              ℹ️ Este texto aparecerá cuando el mesero seleccionado sea de "Instrucciones de Texto"
            </Text>
          </View>

          {/* Editar Video LSM */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Video en LSM</Text>

            {editableVideo && (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: editableVideo }}
                  style={styles.videoPreview}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
                <TouchableOpacity style={styles.removeVideoButton} onPress={() => setEditableVideo(null)}>
                  <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.videoButton} onPress={handleSelectVideo}>
              <MaterialCommunityIcons name="video-plus" size={24} color="#fff" />
              <Text style={styles.addButtonText}>{editableVideo ? "Cambiar Video" : "Agregar Video LSM"}</Text>
            </TouchableOpacity>
          </View>

          {/* Vista Previa Mejorada */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Vista Previa</Text>
            <ScrollView style={styles.previewScrollContainer} nestedScrollEnabled={true}>
              <View style={[styles.previewCard, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.previewHeader}>
                  <Text style={[styles.previewTitle, { color: theme.textColor }]} numberOfLines={0}>
                    {editableTitle}
                  </Text>
                  {editableVideo && (
                    <View style={styles.previewLsmButton}>
                      <MaterialCommunityIcons name="hand-clap" size={20} color="#BACA16" />
                    </View>
                  )}
                </View>
                <Text style={[styles.previewText, { color: theme.textColor }]} numberOfLines={0}>
                  {editableText}
                </Text>
              </View>
            </ScrollView>
            <Text style={styles.previewNote}>
              ℹ️ Esta es una vista previa de cómo se verá la tarjeta. Se ajustará automáticamente al contenido.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>{isLoading ? "Guardando..." : "Guardar Cambios"}</Text>
          </TouchableOpacity>
        </ScrollView>
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
    fontSize: rf(3.2),
    fontWeight: "bold",
    marginBottom: rh(1),
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: rf(2),
    marginBottom: rh(2),
    textAlign: "center",
    paddingHorizontal: rw(3),
    color: "#fff",
    opacity: 0.9,
  },
  bodyContainer: {
    width: "100%",
    flex: 1,
    padding: rw(5),
    backgroundColor: "#fff",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    marginTop: -rh(3),
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: rh(4),
  },
  sectionTitle: {
    fontSize: rf(2.2),
    fontWeight: "600",
    marginBottom: rh(2),
    color: "#333",
  },
  carouselList: {
    paddingVertical: rh(1),
  },
  carouselItemContainer: {
    marginRight: rw(3),
    position: "relative",
  },
  carouselItemImage: {
    width: rw(30),
    height: rh(15),
    borderRadius: rw(3),
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: -rh(1),
    right: -rw(2),
    backgroundColor: "#fff",
    borderRadius: rw(3),
  },
  imageIndex: {
    position: "absolute",
    bottom: rh(0.5),
    left: rw(1),
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.2),
    borderRadius: rw(2),
    fontSize: rf(1.5),
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#BACA16",
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.5),
    borderRadius: rw(3),
    alignItems: "center",
    justifyContent: "center",
    marginTop: rh(2),
  },
  addButtonText: {
    color: "#fff",
    marginLeft: rw(2),
    fontSize: rf(2),
    fontWeight: "600",
  },
  titleInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: rw(3),
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.5),
    fontSize: rf(2),
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: rh(6),
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: rw(3),
    paddingHorizontal: rw(4),
    paddingVertical: rh(2),
    fontSize: rf(2),
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: rh(15),
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: rf(1.6),
    color: "#666",
    marginTop: rh(1),
    fontStyle: "italic",
  },
  videoContainer: {
    position: "relative",
    marginBottom: rh(2),
  },
  videoPreview: {
    width: "100%",
    height: rh(25),
    borderRadius: rw(3),
  },
  removeVideoButton: {
    position: "absolute",
    top: rh(1),
    right: rw(3),
    backgroundColor: "#fff",
    borderRadius: rw(5),
    padding: rw(1),
  },
  videoButton: {
    flexDirection: "row",
    backgroundColor: "#597cff",
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.5),
    borderRadius: rw(3),
    alignItems: "center",
    justifyContent: "center",
  },
  previewScrollContainer: {
    maxHeight: rh(30),
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: rw(3),
    padding: rw(4),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: rh(1),
  },
  previewTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    flex: 1,
    marginRight: rw(2),
    lineHeight: rf(2.8),
  },
  previewLsmButton: {
    backgroundColor: "#f0f8ff",
    padding: rw(2),
    borderRadius: rw(5),
    borderWidth: 1,
    borderColor: "#BACA16",
    flexShrink: 0,
  },
  previewText: {
    fontSize: rf(1.8),
    lineHeight: rf(2.5),
    color: "#555",
  },
  previewNote: {
    fontSize: rf(1.6),
    color: "#666",
    marginTop: rh(1),
    fontStyle: "italic",
    textAlign: "center",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingHorizontal: rw(6),
    paddingVertical: rh(2),
    borderRadius: rw(3),
    alignItems: "center",
    justifyContent: "center",
    marginTop: rh(3),
    marginBottom: rh(5),
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    marginLeft: rw(2),
    fontSize: rf(2.2),
    fontWeight: "bold",
  },
})

export default EditUserHomeScreen
