import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  headerIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#eaf2ff",
  },

  headerTextArea: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    color: "#172033",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  headerDescription: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#cfe0f8",
    borderRadius: 12,
    backgroundColor: "#f5f9ff",
  },

  infoText: {
    flex: 1,
    marginLeft: 9,
    color: "#42526a",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
  },

  formCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#dce6f2",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  formSection: {
    marginBottom: 19,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    color: "#344258",
    fontSize: 14,
    fontWeight: "900",
  },

  required: {
    marginLeft: 3,
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "900",
  },

  selectButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d7e0eb",
    borderRadius: 10,
    backgroundColor: "#f9fbfd",
  },

  selectText: {
    color: "#243247",
    fontSize: 14,
    fontWeight: "800",
  },

  placeholderText: {
    color: "#9aa5b5",
  },

  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d7e0eb",
    borderRadius: 10,
    color: "#243247",
    backgroundColor: "#f9fbfd",
    fontSize: 14,
    fontWeight: "700",
  },

  inputWithIcon: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d7e0eb",
    borderRadius: 10,
    backgroundColor: "#f9fbfd",
  },

  iconInput: {
    flex: 1,
    marginLeft: 9,
    paddingVertical: 0,
    color: "#243247",
    fontSize: 14,
    fontWeight: "700",
  },

  textArea: {
    minHeight: 145,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    borderWidth: 1,
    borderColor: "#d7e0eb",
    borderRadius: 10,
    color: "#243247",
    backgroundColor: "#f9fbfd",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },

  characterCount: {
    marginTop: 6,
    color: "#94a0b1",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },

  photoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  photoCountBadge: {
    minWidth: 26,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: "#eaf2ff",
  },

  photoCountText: {
    color: "#2f64b7",
    fontSize: 12,
    fontWeight: "900",
  },

  photoUploadButton: {
    minHeight: 138,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#b7cff6",
    borderRadius: 12,
    backgroundColor: "#f8fbff",
  },

  photoUploadIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
    borderRadius: 16,
    backgroundColor: "#eaf2ff",
  },

  photoUploadTitle: {
    color: "#2f64b7",
    fontSize: 14,
    fontWeight: "900",
  },

  photoUploadDescription: {
    marginTop: 5,
    color: "#8290a4",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",
  },

  photoPreviewArea: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#dce6f2",
    borderRadius: 12,
    backgroundColor: "#f9fbfd",
  },

  photoPreview: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#eef2f7",
  },

  photoImage: {
    width: "100%",
    height: "100%",
  },

  deletePhotoButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.76)",
  },

  photoFileName: {
    marginTop: 9,
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },

  submitButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#2f64b7",
    ...Platform.select({
      ios: {
        shadowColor: "#2f64b7",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.24,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  submitButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  submitButtonDisabled: {
    opacity: 0.55,
  },

  submitButtonText: {
    marginLeft: 8,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.46)",
  },

  selectModal: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#ffffff",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e7edf5",
  },

  modalTitle: {
    color: "#172033",
    fontSize: 18,
    fontWeight: "900",
  },

  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#eef3f8",
  },

  optionList: {
    paddingTop: 8,
  },

  optionItem: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 11,
    backgroundColor: "#ffffff",
  },

  optionItemSelected: {
    borderColor: "#8bb2e8",
    backgroundColor: "#f5f9ff",
  },

  optionText: {
    color: "#42526a",
    fontSize: 14,
    fontWeight: "800",
  },

  optionTextSelected: {
    color: "#2f64b7",
    fontWeight: "900",
  },

  riskOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  riskDot: {
    width: 10,
    height: 10,
    marginRight: 10,
    borderRadius: 999,
  },

  riskDotHigh: {
    backgroundColor: "#ef4444",
  },

  riskDotMedium: {
    backgroundColor: "#f59e0b",
  },

  riskDotLow: {
    backgroundColor: "#22c55e",
  },
});