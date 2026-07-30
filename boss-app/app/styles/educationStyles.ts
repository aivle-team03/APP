import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  screen: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 110,
    gap: 16,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
  },

  loadingText: {
    color: "#64758A",
    fontSize: 14,
    fontWeight: "600",
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    paddingHorizontal: 4,
    paddingVertical: 7,
  },

  pageHeaderText: {
    flex: 1,
  },

  pageEyebrow: {
    color: "#3974C6",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  pageTitle: {
    marginTop: 5,
    color: "#17243A",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  pageDescription: {
    marginTop: 6,
    color: "#6C7D92",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },

  headerCountBadge: {
    minWidth: 76,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DCE7F4",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  headerCountLabel: {
    color: "#8290A3",
    fontSize: 10,
    fontWeight: "800",
  },

  headerCountValue: {
    marginTop: 2,
    color: "#3974C6",
    fontSize: 23,
    fontWeight: "900",
  },

  summaryGrid: {
    gap: 11,
  },

  summaryCard: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: "#E0E8F2",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#304F77",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 13,
    elevation: 2,
  },

  summaryIcon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },

  summaryIconBlue: {
    backgroundColor: "#E8F2FF",
  },

  summaryIconGreen: {
    backgroundColor: "#E8F8EF",
  },

  summaryIconPurple: {
    backgroundColor: "#F0EDFF",
  },

  summaryTextArea: {
    flex: 1,
  },

  summaryLabel: {
    color: "#718198",
    fontSize: 12,
    fontWeight: "800",
  },

  summaryValue: {
    marginTop: 3,
    color: "#293D58",
    fontSize: 25,
    fontWeight: "900",
  },

  summaryDescription: {
    marginTop: 3,
    color: "#8A98AA",
    fontSize: 11,
    fontWeight: "600",
  },

  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#E0E8F2",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#304F77",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 2,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 15,
  },

  cardHeaderText: {
    flex: 1,
  },

  cardEyebrow: {
    color: "#3974C6",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  cardTitle: {
    marginTop: 5,
    color: "#22354F",
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 26,
  },

  categoryBadge: {
    maxWidth: 110,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EDF5FF",
  },

  categoryBadgeText: {
    color: "#3974C6",
    fontSize: 10,
    fontWeight: "900",
  },

  videoPreview: {
    minHeight: 230,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 17,
    borderRadius: 15,
    backgroundColor: "#3974C6",
  },

  videoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  videoTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  videoTypeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  videoTime: {
    color: "#E5F0FF",
    fontSize: 11,
    fontWeight: "800",
  },

  videoCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  videoPlayButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  videoTitle: {
    marginTop: 13,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 25,
  },

  videoDescription: {
    marginTop: 5,
    color: "#E5EFFF",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  videoBottomLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  progressLabel: {
    color: "#53677E",
    fontSize: 12,
    fontWeight: "900",
  },

  progressValue: {
    color: "#3974C6",
    fontSize: 13,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    overflow: "hidden",
    marginTop: 8,
    borderRadius: 99,
    backgroundColor: "#E5ECF4",
  },

  progressBar: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#3974C6",
  },

  progressDescription: {
    marginTop: 8,
    color: "#91A0B1",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  courseNavigation: {
    flexDirection: "row",
    gap: 9,
    marginTop: 15,
  },

  secondaryButton: {
    minHeight: 44,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#CBD8E9",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  secondaryButtonText: {
    color: "#3D669D",
    fontSize: 12,
    fontWeight: "900",
  },

  buttonDisabled: {
    opacity: 0.4,
    backgroundColor: "#F3F6FA",
  },

  completeButton: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 10,
    borderRadius: 11,
    backgroundColor: "#3974C6",
  },

  completeButtonDisabled: {
    backgroundColor: "#A8B9CE",
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  pressablePressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },

  sectionTitle: {
    marginTop: 5,
    color: "#253A55",
    fontSize: 19,
    fontWeight: "900",
  },

  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EFF3F8",
  },

  countBadgeText: {
    color: "#718198",
    fontSize: 10,
    fontWeight: "900",
  },

  courseList: {
    gap: 9,
  },

  courseItem: {
    minHeight: 103,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E7EDF5",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },

  courseItemSelected: {
    borderColor: "#8CB7EA",
    backgroundColor: "#F1F6FD",
  },

  courseIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    borderRadius: 18,
    backgroundColor: "#E8F2FF",
  },

  courseIconCompleted: {
    paddingLeft: 0,
    backgroundColor: "#2D936C",
  },

  courseItemContent: {
    flex: 1,
    minWidth: 0,
  },

  courseTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  courseItemTitle: {
    flex: 1,
    color: "#30445F",
    fontSize: 13,
    fontWeight: "900",
  },

  courseMeta: {
    marginTop: 5,
    color: "#7A8A9F",
    fontSize: 10,
    fontWeight: "600",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusBadgeComplete: {
    backgroundColor: "#E8F8EF",
  },

  statusBadgeProgress: {
    backgroundColor: "#E7F3FF",
  },

  statusBadgeWaiting: {
    backgroundColor: "#FFF3D6",
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "900",
  },

  statusTextComplete: {
    color: "#25815D",
  },

  statusTextProgress: {
    color: "#2672BC",
  },

  statusTextWaiting: {
    color: "#946D25",
  },

  courseProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 9,
  },

  courseProgressValue: {
    width: 28,
    color: "#62738B",
    fontSize: 9,
    fontWeight: "900",
  },

  courseProgressTrack: {
    height: 6,
    flex: 1,
    overflow: "hidden",
    borderRadius: 9,
    backgroundColor: "#E8EDF4",
  },

  courseProgressBar: {
    height: "100%",
    borderRadius: 9,
    backgroundColor: "#3974C6",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 34,
  },

  emptyText: {
    color: "#8696A9",
    fontSize: 12,
    fontWeight: "700",
  },

  rateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  rateCard: {
    width: "48%",
    minHeight: 145,
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E1E9F3",
    borderRadius: 14,
    backgroundColor: "#FBFDFF",
  },

  rateIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  rateIconBlue: {
    backgroundColor: "#EAF3FF",
  },

  rateIconGreen: {
    backgroundColor: "#E8F7F0",
  },

  rateIconPurple: {
    backgroundColor: "#F0EDFF",
  },

  rateIconOrange: {
    backgroundColor: "#FFF0DF",
  },

  rateLabel: {
    marginTop: 10,
    color: "#52677F",
    fontSize: 11,
    fontWeight: "800",
  },

  rateValue: {
    marginTop: 5,
    color: "#293D58",
    fontSize: 25,
    fontWeight: "900",
  },

  rateTrack: {
    height: 7,
    overflow: "hidden",
    marginTop: 10,
    borderRadius: 99,
    backgroundColor: "#E5ECF4",
  },

  rateBar: {
    height: "100%",
    borderRadius: 99,
  },

  guideCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DAE6F4",
    borderRadius: 18,
    backgroundColor: "#F5F9FF",
  },

  guideIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#E7F1FD",
  },

  guideContent: {
    flex: 1,
  },

  guideTitle: {
    marginTop: 5,
    marginBottom: 12,
    color: "#283D58",
    fontSize: 18,
    fontWeight: "900",
  },

  guideItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8,
  },

  guideDot: {
    width: 6,
    height: 6,
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: "#3974C6",
  },

  guideItemText: {
    flex: 1,
    color: "#596F8A",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 19,
  },

  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(20,34,55,0.48)",
  },

  modalCard: {
    width: "100%",
    maxHeight: "78%",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EDF5",
    backgroundColor: "#F5F9FF",
  },

  modalHeaderText: {
    flex: 1,
  },

  modalEyebrow: {
    color: "#4779BE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  modalTitle: {
    marginTop: 5,
    color: "#243B59",
    fontSize: 21,
    fontWeight: "900",
  },

  modalDescription: {
    marginTop: 5,
    color: "#71839A",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 17,
  },

  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D6E1ED",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  modalCountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F6",
  },

  modalCountValue: {
    color: "#2D70C1",
    fontSize: 26,
    fontWeight: "900",
  },

  modalCountLabel: {
    color: "#7A8A9D",
    fontSize: 11,
    fontWeight: "700",
  },

  modalCourseScroll: {
    flexGrow: 0,
  },

  modalCourseContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  modalCourseItem: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
  },

  modalCourseText: {
    flex: 1,
    minWidth: 0,
  },

  modalCourseTitle: {
    color: "#334B67",
    fontSize: 12,
    fontWeight: "900",
  },

  modalCourseMeta: {
    marginTop: 5,
    color: "#7B8C9E",
    fontSize: 10,
    fontWeight: "600",
  },

  modalCourseProgress: {
    color: "#3974C6",
    fontSize: 11,
    fontWeight: "900",
  },

  modalEmptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingVertical: 42,
  },

  modalEmptyText: {
    color: "#8795A7",
    fontSize: 12,
    fontWeight: "700",
  },
});