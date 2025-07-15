import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useUserHome } from "../context/UserHomeContext"
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions"

const GeneralInstructionsModal = ({ visible, onClose }) => {
  const { generalInstructionsText } = useUserHome()

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={rw(7)} color="#BACA16" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Instrucciones Generales</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.instructionsText}>{generalInstructionsText}</Text>

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
    borderRadius: rw(6),
    maxHeight: rh(80),
    minHeight: rh(50),
    width: "90%",
    paddingBottom: rh(4),
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
  content: {
    flex: 1,
    padding: rw(5),
  },
  instructionsText: {
    fontSize: rf(2),
    color: "#555",
    textAlign: "center",
    marginBottom: rh(3),
    lineHeight: rf(2.8),
  },
  tipContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: rw(3),
    padding: rw(4),
    marginTop: rh(2),
    borderLeftWidth: 4,
    borderLeftColor: "#f6c80d",
    flexDirection: "row",
    alignItems: "flex-start",
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
    flex: 1,
  },
})

export default GeneralInstructionsModal
