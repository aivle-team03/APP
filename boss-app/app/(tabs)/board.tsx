import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { styles } from "../styles/boardStyles";

type RiskLevel = "high" | "medium" | "low";

type SelectType = "category" | "risk" | null;

type CategoryOption = {
  id: number;
  label: string;
};

type RiskOption = {
  level: RiskLevel;
  label: string;
};

type SelectedPhoto = {
  uri: string;
  fileName: string;
  mimeType: string;
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 1, label: "소방시설" },
  { id: 2, label: "피난시설" },
  { id: 3, label: "전기시설" },
  { id: 4, label: "작업환경" },
  { id: 5, label: "위험행동" },
  { id: 6, label: "기타" },
];

const RISK_OPTIONS: RiskOption[] = [
  { level: "high", label: "높음" },
  { level: "medium", label: "보통" },
  { level: "low", label: "낮음" },
];

export default function BoardScreen() {
  const [category, setCategory] = useState<CategoryOption>(
    CATEGORY_OPTIONS[0]
  );
  const [riskLevel, setRiskLevel] = useState<RiskOption | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [reporter, setReporter] = useState("");
  const [description, setDescription] = useState("");

  const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
  const [selectType, setSelectType] = useState<SelectType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "권한 필요",
        "사진을 첨부하려면 사진 접근 권한이 필요합니다."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];

    setPhoto({
      uri: selectedAsset.uri,
      fileName:
        selectedAsset.fileName ??
        `report-${Date.now()}.jpg`,
      mimeType:
        selectedAsset.mimeType ?? "image/jpeg",
    });
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const resetForm = () => {
    setCategory(CATEGORY_OPTIONS[0]);
    setRiskLevel(null);
    setTitle("");
    setLocation("");
    setReporter("");
    setDescription("");
    setPhoto(null);
  };

  const validateForm = () => {
    if (!riskLevel) {
      Alert.alert("입력 확인", "위험도를 선택해주세요.");
      return false;
    }

    if (!title.trim()) {
      Alert.alert("입력 확인", "신고 제목을 입력해주세요.");
      return false;
    }

    if (!location.trim()) {
      Alert.alert("입력 확인", "위험 발생 장소를 입력해주세요.");
      return false;
    }

    if (!reporter.trim()) {
      Alert.alert("입력 확인", "신고자 이름을 입력해주세요.");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("입력 확인", "위험 상황 내용을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !riskLevel) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      Alert.alert(
        "신고 등록 완료",
        "위험 신고가 정상적으로 접수되었습니다.",
        [
          {
            text: "확인",
            onPress: resetForm,
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "등록 실패",
        "신고 등록 중 문제가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelectOptions = () => {
    if (selectType === "category") {
      return CATEGORY_OPTIONS.map((option) => {
        const isSelected = category.id === option.id;

        return (
          <Pressable
            key={option.id}
            style={[
              styles.optionItem,
              isSelected && styles.optionItemSelected,
            ]}
            onPress={() => {
              setCategory(option);
              setSelectType(null);
            }}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>

            {isSelected && (
              <Ionicons
                name="checkmark"
                size={21}
                color="#2f64b7"
              />
            )}
          </Pressable>
        );
      });
    }

    return RISK_OPTIONS.map((option) => {
      const isSelected =
        riskLevel?.level === option.level;

      return (
        <Pressable
          key={option.level}
          style={[
            styles.optionItem,
            isSelected && styles.optionItemSelected,
          ]}
          onPress={() => {
            setRiskLevel(option);
            setSelectType(null);
          }}
        >
          <View style={styles.riskOptionContent}>
            <View
              style={[
                styles.riskDot,
                option.level === "high" &&
                  styles.riskDotHigh,
                option.level === "medium" &&
                  styles.riskDotMedium,
                option.level === "low" &&
                  styles.riskDotLow,
              ]}
            />

            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </View>

          {isSelected && (
            <Ionicons
              name="checkmark"
              size={21}
              color="#2f64b7"
            />
          )}
        </Pressable>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="warning-outline"
                size={25}
                color="#2f64b7"
              />
            </View>

            <View style={styles.headerTextArea}>
              <Text style={styles.headerTitle}>
                위험 신고
              </Text>

              <Text style={styles.headerDescription}>
                현장에서 발견한 위험 요소를 신고해주세요.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#3974c6"
            />

            <Text style={styles.infoText}>
              등록한 신고는 관리자 확인 후 점검 및 조치
              절차로 전달됩니다.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formSection}>
              <Text style={styles.label}>
                카테고리
              </Text>

              <Pressable
                style={styles.selectButton}
                onPress={() =>
                  setSelectType("category")
                }
              >
                <Text style={styles.selectText}>
                  {category.label}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#64748b"
                />
              </Pressable>
            </View>

            <View style={styles.formSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  위험도
                </Text>
                <Text style={styles.required}>*</Text>
              </View>

              <Pressable
                style={styles.selectButton}
                onPress={() => setSelectType("risk")}
              >
                <Text
                  style={[
                    styles.selectText,
                    !riskLevel &&
                      styles.placeholderText,
                  ]}
                >
                  {riskLevel
                    ? riskLevel.label
                    : "위험도를 선택해주세요"}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#64748b"
                />
              </Pressable>
            </View>

            <View style={styles.formSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>제목</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="신고 제목을 입력해주세요"
                placeholderTextColor="#9aa5b5"
                maxLength={100}
              />

              <Text style={styles.characterCount}>
                {title.length}/100
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  발생 장소
                </Text>
                <Text style={styles.required}>*</Text>
              </View>

              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#64748b"
                />

                <TextInput
                  style={styles.iconInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="예: A동 2층 복도"
                  placeholderTextColor="#9aa5b5"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  신고자
                </Text>
                <Text style={styles.required}>*</Text>
              </View>

              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#64748b"
                />

                <TextInput
                  style={styles.iconInput}
                  value={reporter}
                  onChangeText={setReporter}
                  placeholder="신고자 이름을 입력해주세요"
                  placeholderTextColor="#9aa5b5"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>내용</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="위험 상황과 필요한 조치를 자세히 입력해주세요"
                placeholderTextColor="#9aa5b5"
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />

              <Text style={styles.characterCount}>
                {description.length}/1000
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.photoLabelRow}>
                <Text style={styles.label}>사진</Text>

                <View style={styles.photoCountBadge}>
                  <Text style={styles.photoCountText}>
                    {photo ? 1 : 0}
                  </Text>
                </View>
              </View>

              {photo ? (
                <View style={styles.photoPreviewArea}>
                  <View style={styles.photoPreview}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photoImage}
                      resizeMode="cover"
                    />

                    <Pressable
                      style={styles.deletePhotoButton}
                      onPress={removePhoto}
                    >
                      <Ionicons
                        name="close"
                        size={18}
                        color="#ffffff"
                      />
                    </Pressable>
                  </View>

                  <Text
                    style={styles.photoFileName}
                    numberOfLines={1}
                  >
                    {photo.fileName}
                  </Text>
                </View>
              ) : (
                <Pressable
                  style={styles.photoUploadButton}
                  onPress={openImagePicker}
                >
                  <View style={styles.photoUploadIcon}>
                    <Ionicons
                      name="camera-outline"
                      size={27}
                      color="#2f64b7"
                    />
                  </View>

                  <Text style={styles.photoUploadTitle}>
                    사진 첨부
                  </Text>

                  <Text
                    style={styles.photoUploadDescription}
                  >
                    위험 상황이 잘 보이는 사진을
                    선택해주세요.
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSubmitting &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Ionicons
              name={
                isSubmitting
                  ? "hourglass-outline"
                  : "paper-plane-outline"
              }
              size={20}
              color="#ffffff"
            />

            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? "등록 중..."
                : "위험 신고 등록"}
            </Text>
          </Pressable>
        </ScrollView>

        <Modal
          visible={selectType !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectType(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectType(null)}
          >
            <Pressable
              style={styles.selectModal}
              onPress={(event) =>
                event.stopPropagation()
              }
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectType === "category"
                    ? "카테고리 선택"
                    : "위험도 선택"}
                </Text>

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setSelectType(null)}
                >
                  <Ionicons
                    name="close"
                    size={23}
                    color="#64748b"
                  />
                </Pressable>
              </View>

              <View style={styles.optionList}>
                {renderSelectOptions()}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}