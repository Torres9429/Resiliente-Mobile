"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { uploadImageToWasabi, uploadVideoToWasabi } from "../services/wasabi"

const UserHomeContext = createContext()

const defaultCarouselData = [
  { id: 1, image: require("../assets/Rectangle 9.png"), isDefault: true },
  { id: 2, image: require("../assets/waiter1.jpg"), isDefault: true },
  { id: 3, image: require("../assets/Rectangle 8.png"), isDefault: true },
]

const defaultCardText = `Sigue estos sencillos pasos.
1. Selecciona el mesero que te atiende.
2. Revisa sus características para tener una mejor comunicación con quien te atiende.
3. Selecciona el platillo que deseas ordenar.
4. Sigue las instrucciones para pedir tu platillo.
5. ¡Listo!`

const defaultInstructionsText = "¡Sigue las señas para comunicarte con tu mesero y realizar tu pedido correctamente!"
const defaultGeneralInstructionsText =
  "Aquí puedes encontrar instrucciones generales para interactuar con tu mesero. Por favor, lee atentamente para una mejor comunicación."

export const UserHomeProvider = ({ children }) => {
  const [carouselData, setCarouselData] = useState(defaultCarouselData)
  const [cardText, setCardText] = useState(defaultCardText)
  const [cardTitle, setCardTitle] = useState("¿Listo para ordenar?")
  const [lsmVideo, setLsmVideo] = useState(null)
  const [instructionsText, setInstructionsText] = useState(defaultInstructionsText)
  const [generalInstructionsText, setGeneralInstructionsText] = useState(defaultGeneralInstructionsText)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadUserHomeData()
  }, [])

  const loadUserHomeData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("userHomeData")
      if (savedData) {
        const data = JSON.parse(savedData)
        setCarouselData(data.carouselData || defaultCarouselData)
        setCardText(data.cardText || defaultCardText)
        setCardTitle(data.cardTitle || "¿Listo para ordenar?")
        setLsmVideo(data.lsmVideo || null)
        setInstructionsText(data.instructionsText || defaultInstructionsText)
        setGeneralInstructionsText(data.generalInstructionsText || defaultGeneralInstructionsText)
      }
    } catch (error) {
      console.error("Error loading user home data:", error)
    }
  }

  const saveUserHomeData = async () => {
    try {
      const dataToSave = {
        carouselData,
        cardText,
        cardTitle,
        lsmVideo,
        instructionsText,
        generalInstructionsText,
      }
      await AsyncStorage.setItem("userHomeData", JSON.stringify(dataToSave))
      console.log("User home data saved successfully")
    } catch (error) {
      console.error("Error saving user home data:", error)
    }
  }

  const updateCarouselData = async (newCarouselData) => {
    setIsLoading(true)
    try {
      // Subir nuevas imágenes a Wasabi
      const updatedCarousel = await Promise.all(
        newCarouselData.map(async (item) => {
          if (item.image && typeof item.image === "string" && !item.image.startsWith("http") && !item.isDefault) {
            const imageUrl = await uploadImageToWasabi(item.image, "carousel")
            return { ...item, image: imageUrl }
          }
          return item
        }),
      )
      setCarouselData(updatedCarousel)
    } catch (error) {
      console.error("Error updating carousel data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCardContent = (title, text) => {
    setCardTitle(title)
    setCardText(text)
  }

  const updateLsmVideo = async (videoUri) => {
    if (!videoUri) {
      setLsmVideo(null)
      return
    }

    setIsLoading(true)
    try {
      let videoUrl = videoUri
      if (!videoUri.startsWith("http")) {
        videoUrl = await uploadVideoToWasabi(videoUri, "lsm")
      }
      setLsmVideo(videoUrl)
    } catch (error) {
      console.error("Error updating LSM video:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateInstructionsText = (text) => {
    setInstructionsText(text)
  }

  const updateGeneralInstructionsText = (text) => {
    setGeneralInstructionsText(text)
  }

  return (
    <UserHomeContext.Provider
      value={{
        carouselData,
        cardText,
        cardTitle,
        lsmVideo,
        instructionsText,
        generalInstructionsText,
        isLoading,
        updateCarouselData,
        updateCardContent,
        updateLsmVideo,
        updateInstructionsText,
        updateGeneralInstructionsText,
        saveUserHomeData,
      }}
    >
      {children}
    </UserHomeContext.Provider>
  )
}

export const useUserHome = () => {
  const context = useContext(UserHomeContext)
  if (context === undefined) {
    throw new Error("useUserHome must be used within a UserHomeProvider")
  }
  return context
}
