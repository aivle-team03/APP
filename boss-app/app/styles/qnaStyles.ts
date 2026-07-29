import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe7f2",
    backgroundColor: "#ffffff",
  },

  headerIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#2f64b7",
  },

  headerTextArea: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  headerDescription: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },

  recommendSection: {
    paddingTop: 15,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe7f2",
    backgroundColor: "#eef6ff",
  },

  recommendTitle: {
    paddingHorizontal: 20,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },

  recommendDescription: {
    marginTop: 4,
    paddingHorizontal: 20,
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
  },

  recommendList: {
    gap: 9,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 2,
  },

  recommendButton: {
    maxWidth: 230,
    minHeight: 43,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },

  recommendButtonPressed: {
    borderColor: "#9bbcf1",
    backgroundColor: "#f8fbff",
    opacity: 0.86,
  },

  recommendButtonText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },

  messageList: {
    flex: 1,
  },

  messageListContent: {
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  botRow: {
    justifyContent: "flex-start",
  },

  userRow: {
    justifyContent: "flex-end",
  },

  botAvatar: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    borderRadius: 999,
    backgroundColor: "#2f64b7",
  },

  bubbleWrap: {
    maxWidth: "78%",
    alignItems: "flex-start",
  },

  userBubbleWrap: {
    alignItems: "flex-end",
  },

  chatBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 15,
  },

  botBubble: {
    borderColor: "#dfe7f2",
    borderTopLeftRadius: 5,
    backgroundColor: "#ffffff",
  },

  userBubble: {
    borderColor: "#2f64b7",
    borderTopRightRadius: 5,
    backgroundColor: "#2f64b7",
  },

  messageText: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  userMessageText: {
    color: "#ffffff",
  },

  messageTime: {
    marginTop: 5,
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "700",
  },

  userMessageTime: {
    textAlign: "right",
  },

  typingBubble: {
    minWidth: 64,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#dfe7f2",
    borderRadius: 15,
    borderTopLeftRadius: 5,
    backgroundColor: "#ffffff",
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#94a3b8",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 14,
    borderTopWidth: 1,
    borderTopColor: "#dfe7f2",
    backgroundColor: "#ffffff",
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 110,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 11,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 23,
    color: "#0f172a",
    backgroundColor: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },

  sendButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#2f64b7",
    ...Platform.select({
      ios: {
        shadowColor: "#2f64b7",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 9,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  sendButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },
});