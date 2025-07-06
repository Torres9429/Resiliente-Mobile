"use client"

import { useState, useEffect } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const InstructionsModal = ({ visible, product, onClose }) => {
  const [instructions, setInstructions] = useState([])

  useEffect(() => {
    if (product && visible) {
      // Generar instrucciones específicas basadas en el producto
      const productInstructions = generateInstructions(product)
      setInstructions(productInstructions)
    }
  }, [product, visible])

  const generateInstructions = (product) => {
    // Instrucciones base para todos los productos
    const baseInstructions = [
      {
        id: 1,
        step: 1,
        title: "Llamar la atención",
        description: "Levanta la mano o haz contacto visual con el mesero",
        icon: "hand-wave",
      },
      {
        id: 2,
        step: 2,
        title: "Señalar el producto",
        description: `Apunta hacia ${product?.nombre || "el producto"} en el menú`,
        icon: "hand-pointing-right",
      },
      {
        id: 3,
        step: 3,
        title: "Mostrar cantidad",
        description: "Usa los dedos para indicar cuántos quieres",
        icon: "numeric",
      },
    ]

    // Instrucciones específicas según el tipo de producto
    const specificInstructions = []

    if (product?.categoria?.toLowerCase().includes("bebida")) {
      specificInstructions.push({
        id: 4,
        step: 4,
        title: "Tamaño de bebida",
        description: "Usa gestos con las manos para indicar el tamaño (pequeño, mediano, grande)",
        icon: "cup",
      })
    }

    if (product?.categoria?.toLowerCase().includes("café")) {
      specificInstructions.push({
        id: 5,
        step: 5,
        title: "Temperatura",
        description: "Sopla suavemente para café caliente o haz gesto de frío para bebida fría",
        icon: "thermometer",
      })
    }

    if (product?.precio > 50) {
      specificInstructions.push({
        id: 6,
        step: 6,
        title: "Confirmar precio",
        description: "El mesero puede mostrar el precio en papel o calculadora",
        icon: "currency-usd",
      })
    }

    specificInstructions.push({
      id: 7,
      step: baseInstructions.length + specificInstructions.length + 1,
      title: "Confirmar pedido",
      description: "Asiente con la cabeza cuando el mesero confirme tu orden",
      icon: "check-circle",
    })

    return [...baseInstructions, ...specificInstructions]
  }

  const renderInstruction = ({ item }) => (
    <View style={styles.instructionCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepText}>{item.step}</Text>
      </View>
      <View style={styles.instructionContent}>
        <View style={styles.instructionHeader}>
          <MaterialCommunityIcons name={item.icon} size={rw(6)} color="#BACA16" style={styles.instructionIcon} />
          <Text style={styles.instructionTitle}>{item.title}</Text>
        </View>
        <Text style={styles.instructionDescription}>{item.description}</Text>
      </View>
    </View>
  )

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={rw(7)} color="#BACA16" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Instrucciones para pedir</Text>
            {product && <Text style={styles.productName}>{product.nombre}</Text>}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>Sigue estos pasos para comunicarte efectivamente:</Text>

            <FlatList
              data={instructions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderInstruction}
              scrollEnabled={false}
              contentContainerStyle={styles.instructionsList}
            />

            <View style={styles.tipContainer}>
              <MaterialCommunityIcons name="lightbulb" size={rw(6)} color="#f6c80d" />
              <Text style={styles.tipTitle}>Consejo:</Text>
              <Text style={styles.tipText}>
                Mantén la calma y sé paciente. El mesero está capacitado para ayudarte y entender tus necesidades.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    maxHeight: rh(80),
    minHeight: rh(70),
    bottom: 0,
    position: "absolute",
    paddingBottom: rh(8)
    
  },
  header: {
    padding: rw(5),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: rh(2),
    right: rw(5),
    zIndex: 1,
  },
  modalTitle: {
    fontSize: rf(3),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: rh(1),
  },
  productName: {
    fontSize: rf(2.2),
    color: "#BACA16",
    fontWeight: "600",
    marginTop: rh(0.5),
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 40,
    paddingVertical: 10
  },
  subtitle: {
    fontSize: rf(2),
    color: "#666",
    textAlign: "center",
    marginBottom: rh(3),
    lineHeight: rf(2.5),
  },
  instructionsList: {
    paddingBottom: rh(2),
  },
  instructionCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: rw(3),
    padding: rw(4),
    marginBottom: rh(2),
    alignItems: "flex-start",
  },
  stepNumber: {
    backgroundColor: "#BACA16",
    borderRadius: rw(6),
    width: rw(12),
    height: rw(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: rw(3),
  },
  stepText: {
    color: "white",
    fontSize: rf(2.2),
    fontWeight: "bold",
  },
  instructionContent: {
    flex: 1,
  },
  instructionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rh(0.5),
  },
  instructionIcon: {
    marginRight: rw(2),
  },
  instructionTitle: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  instructionDescription: {
    fontSize: rf(1.8),
    color: "#666",
    lineHeight: rf(2.3),
    marginTop: rh(0.5),
  },
  tipContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: rw(3),
    padding: rw(4),
    marginTop: rh(2),
    borderLeftWidth: 4,
    borderLeftColor: "#f6c80d",
  },
  tipTitle: {
    fontSize: rf(2),
    fontWeight: "bold",
    color: "#856404",
    marginBottom: rh(0.5),
    marginLeft: rw(2),
  },
  tipText: {
    fontSize: rf(1.8),
    color: "#856404",
    lineHeight: rf(2.3),
    marginLeft: rw(2),
  },
})

export default InstructionsModal
