import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { styles } from "../styles/checklistStyles";

type TaskView = "inspection" | "action";
type InspectionStatus = "점검 대기" | "점검 완료";
type ActionStatus = "조치 대기" | "조치 완료" | string;

type InspectionTask = {
  id: string | number;
  taskKey: string;
  text: string;
  location: string;
  date: string;
  inspectionStatus: InspectionStatus | string;
  category: string;
  categoryId: number;
  inspector: string;
  movedToAction: boolean;
  completed: boolean;
  content: string;
};

type ActionPhoto = {
  id: string;
  uri: string;
  name: string;
  mimeType?: string;
  isLocal?: boolean;
};

type ActionTask = {
  id: string | number;
  taskKey: string;
  inspectionRef: string;
  category: string;
  text: string;
  location: string;
  date: string;
  status: ActionStatus;
  content: string;
  completed: boolean;
  photos: ActionPhoto[];
};

type ChecklistTask = InspectionTask | ActionTask;

/**
 * 실제 휴대폰 Expo Go에서는 127.0.0.1을 사용하면 안 됩니다.
 *
 * iOS 시뮬레이터:
 * http://127.0.0.1:8000
 *
 * Android 에뮬레이터:
 * http://10.0.2.2:8000
 *
 * 실제 휴대폰:
 * http://맥북IP주소:8000
 */
const API_BASE_URL = "http://172.20.10.3:8000";

function createKey(prefix: string, id: string | number) {
  return `${prefix}-${id}`;
}

function resolveImageUrl(url?: string | null) {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("file://")
  ) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getAuthHeaders() {
  const token =
    (await SecureStore.getItemAsync("accessToken")) ||
    (await SecureStore.getItemAsync("token"));

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

function sortTasksByCompletion(
  tasks: ChecklistTask[],
  view: TaskView
): ChecklistTask[] {
  return [...tasks].sort((a, b) => {
    const aCompleted =
      view === "inspection"
        ? (a as InspectionTask).inspectionStatus === "점검 완료"
        : (a as ActionTask).status === "조치 완료";

    const bCompleted =
      view === "inspection"
        ? (b as InspectionTask).inspectionStatus === "점검 완료"
        : (b as ActionTask).status === "조치 완료";

    return Number(aCompleted) - Number(bCompleted);
  });
}

export default function ChecklistScreen() {
  const [inspectionTasks, setInspectionTasks] = useState<
    InspectionTask[]
  >([]);

  const [actionTasks, setActionTasks] = useState<ActionTask[]>([]);

  const [activeTaskView, setActiveTaskView] =
    useState<TaskView>("inspection");

  const [selectedTaskKey, setSelectedTaskKey] =
    useState<string | null>(null);

  const [actionContent, setActionContent] = useState("");
  const [actionDetailContent, setActionDetailContent] =
    useState("");

  const [previewPhoto, setPreviewPhoto] =
    useState<ActionPhoto | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 내 점검 이력
   * GET /api/inspection/histories/me
   */
  const fetchMyInspectionHistories = async () => {
    try {
      const headers = await getAuthHeaders();

      console.log("점검 요청 헤더:", headers);

      const response = await axios.get(
        `${API_BASE_URL}/api/inspection/histories/me`,
        {
          headers,
        }
      );

      console.log("점검 응답:", response.data);

      if (!Array.isArray(response.data)) {
        setInspectionTasks([]);
        return;
      }

      const inspections: InspectionTask[] = response.data.map(
        (item: any) => {
          const isCompleted = item.status === "점검 완료";

          return {
            id: item.inspection_history_id,
            taskKey: createKey(
              "inspection",
              item.inspection_history_id
            ),
            text: item.name || "점검 항목",
            location: item.location || "현장 구역",
            date: item.date
              ? String(item.date).slice(0, 10)
              : "",
            inspectionStatus:
              item.status || "점검 대기",
            category:
              item.category ||
              item.category_name ||
              "정기 점검",
            categoryId: item.category_id || 1,
            inspector: item.uid
              ? `User #${item.uid}`
              : "담당자",
            movedToAction: Boolean(
              item.is_action_required
            ),
            completed: isCompleted,
            content: item.content || "",
          };
        }
      );

      setInspectionTasks(inspections);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "점검 이력 조회 실패:",
          error.response?.status
        );

        console.log(
          "점검 이력 에러 전체:",
          JSON.stringify(error.response?.data, null, 2)
        );
      }

      setInspectionTasks([]);
    }
  };

  /**
   * 내 조치 이력
   * GET /api/action-histories/me
   */
  const fetchMyActionHistories = async () => {
    try {
      const headers = await getAuthHeaders();

      const response = await axios.get(
        `${API_BASE_URL}/api/action-histories/me`,
        {
          headers,
        }
      );
      console.log("조치 응답:", response.data);
      const items =
        response.data?.items ||
        (Array.isArray(response.data)
          ? response.data
          : []);

      const actions: ActionTask[] = items.map(
        (item: any) => {
          const isCompleted =
            item.action_status === "조치 완료";

          const imageUrl = resolveImageUrl(
            item.image_url
          );

          return {
            id: item.action_history_id,
            taskKey: createKey(
              "action",
              item.action_history_id
            ),
            inspectionRef:
              item.action_name || "조치 항목",
            text: item.action_name || "조치 항목",
            location: item.location || "현장 구역",
            date: item.created_at
              ? String(item.created_at).slice(0, 10)
              : "",
            status:
              item.action_status || "조치 대기",
            category:
              item.category ||
              item.category_name ||
              "시설 안전",
            content: item.content || "",
            completed: isCompleted,
            photos: imageUrl
              ? [
                  {
                    id: `server-${item.action_history_id}`,
                    uri: imageUrl,
                    name: "조치 사진",
                    isLocal: false,
                  },
                ]
              : [],
          };
        }
      );

      setActionTasks(actions);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "조치 이력 조회 실패:",
          error.response?.status
        );

        console.log(
          "조치 이력 에러:",
          JSON.stringify(error.response?.data, null, 2)
        );
        
      }
      

      setActionTasks([]);
    }
  };

  const fetchChecklistData = async () => {
    setIsLoading(true);

    try {
      await Promise.all([
        fetchMyInspectionHistories(),
        fetchMyActionHistories(),
      ]);
    } catch {
      Alert.alert(
        "조회 실패",
        "점검·조치 목록을 불러오지 못했습니다.\n백엔드 서버와 로그인 상태를 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistData();
  }, []);

  const rawVisibleTasks: ChecklistTask[] =
    activeTaskView === "inspection"
      ? inspectionTasks
      : actionTasks;

  const visibleTasks = sortTasksByCompletion(
    rawVisibleTasks,
    activeTaskView
  );

  const effectiveSelectedTaskKey = visibleTasks.some(
    (task) => task.taskKey === selectedTaskKey
  )
    ? selectedTaskKey
    : visibleTasks[0]?.taskKey ?? null;

  const currentInspectionTask =
    activeTaskView === "inspection"
      ? inspectionTasks.find(
          (task) =>
            task.taskKey === effectiveSelectedTaskKey
        )
      : undefined;

  const currentActionTask =
    activeTaskView === "action"
      ? actionTasks.find(
          (task) =>
            task.taskKey === effectiveSelectedTaskKey
        )
      : undefined;

  useEffect(() => {
    if (!currentActionTask) {
      setActionDetailContent("");
      return;
    }

    setActionDetailContent(
      currentActionTask.content || ""
    );
  }, [currentActionTask?.taskKey]);

  const progress = useMemo(() => {
    if (activeTaskView === "inspection") {
      const done = inspectionTasks.filter(
        (task) =>
          task.inspectionStatus === "점검 완료"
      ).length;

      const total = inspectionTasks.length;

      return {
        done,
        total,
        percent: total
          ? Math.round((done / total) * 100)
          : 0,
      };
    }

    const done = actionTasks.filter(
      (task) => task.status === "조치 완료"
    ).length;

    const total = actionTasks.length;

    return {
      done,
      total,
      percent: total
        ? Math.round((done / total) * 100)
        : 0,
    };
  }, [
    activeTaskView,
    inspectionTasks,
    actionTasks,
  ]);

  const selectTaskView = (view: TaskView) => {
    setActiveTaskView(view);
    setSelectedTaskKey(null);
    setActionContent("");
    setActionDetailContent("");
  };

  const selectTask = (
    task: InspectionTask | ActionTask
  ) => {
    setSelectedTaskKey(task.taskKey);

    if (activeTaskView === "action") {
      setActionDetailContent(
        (task as ActionTask).content || ""
      );
    }
  };

  /**
   * 점검 완료
   * PATCH /api/inspection/histories/{id}
   */
  const completeInspection = async () => {
    if (!currentInspectionTask || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const headers = await getAuthHeaders();

      const content =
        actionContent.trim() ||
        currentInspectionTask.content ||
        undefined;

      await axios.patch(
        `${API_BASE_URL}/api/inspection/histories/${currentInspectionTask.id}`,
        {
          status: "점검 완료",
          is_action_required: false,
          content,
        },
        {
          headers,
        }
      );

      setInspectionTasks((current) =>
        current.map((task) =>
          task.taskKey ===
          currentInspectionTask.taskKey
            ? {
                ...task,
                inspectionStatus: "점검 완료",
                movedToAction: false,
                completed: true,
                content: content || task.content,
              }
            : task
        )
      );

      setActionContent("");
      setSelectedTaskKey(null);

      Alert.alert(
        "점검 완료",
        "선택한 항목의 점검이 완료되었습니다."
      );
    } catch (error) {
      console.error("점검 완료 실패:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : undefined;

      Alert.alert(
        "처리 실패",
        message ||
          "점검 완료 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 조치 필요
   *
   * 1. PATCH 점검 이력
   * 2. POST 조치 이력 생성
   */
  const registerAction = async () => {
    if (!currentInspectionTask || isSubmitting) {
      return;
    }

    const contentText =
      actionContent.trim() ||
      currentInspectionTask.content;

    if (!contentText) {
      Alert.alert(
        "입력 확인",
        "점검 결과 또는 필요한 조치 내용을 입력해주세요."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const headers = await getAuthHeaders();

      await axios.patch(
        `${API_BASE_URL}/api/inspection/histories/${currentInspectionTask.id}`,
        {
          status: "점검 완료",
          is_action_required: true,
          content: contentText,
        },
        {
          headers,
        }
      );

      await axios.post(
        `${API_BASE_URL}/api/action-histories`,
        {
          source_type: "점검이력",
          source_id: currentInspectionTask.id,
          action_name: currentInspectionTask.text,
          category_id:
            currentInspectionTask.categoryId || 1,
          location: currentInspectionTask.location,
          content: contentText,
        },
        {
          headers,
        }
      );

      setInspectionTasks((current) =>
        current.map((task) =>
          task.taskKey ===
          currentInspectionTask.taskKey
            ? {
                ...task,
                inspectionStatus: "점검 완료",
                movedToAction: true,
                completed: true,
                content: contentText,
              }
            : task
        )
      );

      setActionContent("");
      setSelectedTaskKey(null);

      await fetchMyActionHistories();

      Alert.alert(
        "조치 등록 완료",
        "조치가 필요한 항목으로 등록되었습니다."
      );
    } catch (error) {
      console.error("조치 등록 실패:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : undefined;

      Alert.alert(
        "처리 실패",
        message ||
          "조치 필요 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 사진 선택
   */
  const pickActionImages = async () => {
    if (
      !currentActionTask ||
      currentActionTask.completed
    ) {
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "권한 필요",
        "사진을 첨부하려면 사진 접근 권한이 필요합니다."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

    if (result.canceled) {
      return;
    }

    const newPhotos: ActionPhoto[] =
      result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        uri: asset.uri,
        name:
          asset.fileName ||
          `action-${Date.now()}-${index + 1}.jpg`,
        mimeType:
          asset.mimeType || "image/jpeg",
        isLocal: true,
      }));

    setActionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentActionTask.taskKey
          ? {
              ...task,
              photos: [
                ...task.photos,
                ...newPhotos,
              ],
            }
          : task
      )
    );
  };

  const removeActionPhoto = (photoId: string) => {
    if (
      !currentActionTask ||
      currentActionTask.completed
    ) {
      return;
    }

    setActionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentActionTask.taskKey
          ? {
              ...task,
              photos: task.photos.filter(
                (photo) => photo.id !== photoId
              ),
            }
          : task
      )
    );
  };

  /**
   * 조치 완료
   * PATCH /api/action-histories/{id}/complete
   */
  const completeAction = async () => {
    if (!currentActionTask || isSubmitting) {
      return;
    }

    const trimmedContent =
      actionDetailContent.trim();

    if (!trimmedContent) {
      Alert.alert(
        "입력 확인",
        "수행한 조치 내용을 입력해주세요."
      );
      return;
    }

    const localPhoto =
      currentActionTask.photos.find(
        (photo) => photo.isLocal
      );

    if (!localPhoto) {
      Alert.alert(
        "사진 필요",
        "조치 완료 사진을 한 장 이상 첨부해주세요."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const authHeaders = await getAuthHeaders();
      const formData = new FormData();

      formData.append("content", trimmedContent);

      formData.append(
        "image",
        {
          uri: localPhoto.uri,
          name: localPhoto.name,
          type:
            localPhoto.mimeType || "image/jpeg",
        } as any
      );

      const response = await axios.patch(
        `${API_BASE_URL}/api/action-histories/${currentActionTask.id}/complete`,
        formData,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedImageUrl = resolveImageUrl(
        response.data?.image_url
      );

      setActionTasks((current) =>
        current.map((task) =>
          task.taskKey === currentActionTask.taskKey
            ? {
                ...task,
                status: "조치 완료",
                completed: true,
                content:
                  response.data?.content ||
                  trimmedContent,
                photos: uploadedImageUrl
                  ? [
                      {
                        id: `server-${task.id}`,
                        uri: uploadedImageUrl,
                        name: "조치 사진",
                        isLocal: false,
                      },
                    ]
                  : task.photos,
              }
            : task
        )
      );

      setActionDetailContent("");

      Alert.alert(
        "조치 완료",
        "조치가 완료 처리되었습니다. 승인 대기 상태입니다."
      );
    } catch (error) {
      console.error("조치 완료 실패:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : undefined;

      Alert.alert(
        "처리 실패",
        message ||
          "조치 완료 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#3478D4"
          />
          <Text>점검·조치 목록을 불러오는 중입니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={undefined}
      >
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderText}>
            <Text style={styles.pageEyebrow}>
              SAFETY CHECKLIST
            </Text>

            <Text style={styles.pageTitle}>
              점검 · 조치 목록
            </Text>

            <Text style={styles.pageDescription}>
              점검 결과를 확인하고 필요한 조치를 등록하세요.
            </Text>
          </View>

          <View style={styles.totalCountBadge}>
            <Text style={styles.totalCountText}>
              총 {visibleTasks.length}건
            </Text>
          </View>
        </View>

        <View style={styles.taskTabs}>
          <TaskTab
            label="점검 목록"
            count={inspectionTasks.length}
            active={
              activeTaskView === "inspection"
            }
            onPress={() =>
              selectTaskView("inspection")
            }
          />

          <TaskTab
            label="조치 목록"
            count={actionTasks.length}
            active={activeTaskView === "action"}
            onPress={() => selectTaskView("action")}
          />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              전체 진행률
            </Text>

            <Text style={styles.progressValue}>
              {progress.done}/{progress.total} (
              {progress.percent}%)
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress.percent}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {activeTaskView === "inspection"
              ? "오늘의 점검"
              : "담당 조치"}
          </Text>

          <View style={styles.taskList}>
            {visibleTasks.map((task) => {
              const inspectionTask =
                task as InspectionTask;

              const actionTask =
                task as ActionTask;

              const selected =
                task.taskKey ===
                effectiveSelectedTaskKey;

              const completed =
                activeTaskView === "inspection"
                  ? inspectionTask.inspectionStatus ===
                    "점검 완료"
                  : actionTask.status === "조치 완료";

              const status =
                activeTaskView === "inspection"
                  ? inspectionTask.inspectionStatus
                  : actionTask.status;

              return (
                <Pressable
                  key={task.taskKey}
                  style={({ pressed }) => [
                    styles.taskItem,
                    selected &&
                      styles.taskItemSelected,
                    completed &&
                      styles.taskItemCompleted,
                    pressed &&
                      styles.taskItemPressed,
                  ]}
                  onPress={() => selectTask(task)}
                >
                  <View
                    style={[
                      styles.taskCheck,
                      (completed || selected) &&
                        styles.taskCheckActive,
                    ]}
                  >
                    {completed ? (
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color="#FFFFFF"
                      />
                    ) : (
                      <View
                        style={styles.taskCheckDot}
                      />
                    )}
                  </View>

                  <View style={styles.taskTextArea}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.taskTitle,
                        completed &&
                          styles.taskTitleCompleted,
                      ]}
                    >
                      {task.text}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={styles.taskMeta}
                    >
                      {task.location} · {task.date}
                    </Text>

                    <View
                      style={styles.taskStatusRow}
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          completed &&
                            styles.statusBadgeCompleted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            completed &&
                              styles.statusBadgeTextCompleted,
                          ]}
                        >
                          {status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color="#8EA1B7"
                  />
                </Pressable>
              );
            })}

            {!visibleTasks.length && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="clipboard-outline"
                  size={34}
                  color="#9AACBE"
                />
                <Text
                  style={styles.emptyStateText}
                >
                  등록된 항목이 없습니다.
                </Text>
              </View>
            )}
          </View>
        </View>

        {activeTaskView === "inspection" &&
          currentInspectionTask && (
            <View style={styles.card}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailEyebrow}>
                  INSPECTION REGISTRATION
                </Text>

                <Text style={styles.detailTitle}>
                  점검 결과 등록
                </Text>

                <Text
                  style={styles.detailDescription}
                >
                  점검 결과를 입력하고 완료 또는 조치 필요 상태로 설정합니다.
                </Text>
              </View>

              <View style={styles.referenceCard}>
                <InfoItem
                  label="점검명"
                  value={currentInspectionTask.text}
                />

                <InfoItem
                  label="현장 구역"
                  value={
                    currentInspectionTask.location
                  }
                />

                <InfoItem
                  label="카테고리"
                  value={
                    currentInspectionTask.category
                  }
                />

                <InfoItem
                  label="진행 상황"
                  value={
                    currentInspectionTask.inspectionStatus
                  }
                />
              </View>

              {currentInspectionTask.completed ? (
                <View style={styles.completedMessage}>
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#24835E"
                  />

                  <Text
                    style={
                      styles.completedMessageText
                    }
                  >
                    {currentInspectionTask.movedToAction
                      ? "조치 필요 항목으로 등록된 점검입니다."
                      : "완료된 점검 항목입니다."}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.inputLabel}>
                    점검 내용 / 메모
                  </Text>

                  <TextInput
                    style={styles.textArea}
                    value={actionContent}
                    onChangeText={setActionContent}
                    placeholder="점검 결과 또는 필요한 조치 내용을 입력하세요."
                    placeholderTextColor="#9BACBE"
                    multiline
                    textAlignVertical="top"
                    editable={!isSubmitting}
                  />

                  <View
                    style={styles.inspectionButtons}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.primaryButton,
                        pressed &&
                          styles.buttonPressed,
                      ]}
                      onPress={completeInspection}
                      disabled={isSubmitting}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        점검 완료
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.dangerButton,
                        pressed &&
                          styles.buttonPressed,
                      ]}
                      onPress={registerAction}
                      disabled={isSubmitting}
                    >
                      <Ionicons
                        name="warning-outline"
                        size={19}
                        color="#A53636"
                      />

                      <Text
                        style={
                          styles.dangerButtonText
                        }
                      >
                        조치 필요
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}

        {activeTaskView === "action" &&
          currentActionTask && (
            <View style={styles.card}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailEyebrow}>
                  ACTION DETAIL
                </Text>

                <Text style={styles.detailTitle}>
                  조치 내용
                </Text>

                <Text
                  style={styles.detailDescription}
                >
                  점검 이력이 연결된 조치 업무입니다.
                </Text>
              </View>

              <View style={styles.referenceCard}>
                <InfoItem
                  label="이름"
                  value={
                    currentActionTask.inspectionRef
                  }
                />

                <InfoItem
                  label="현장 구역"
                  value={currentActionTask.location}
                />

                <InfoItem
                  label="카테고리"
                  value={currentActionTask.category}
                />

                <InfoItem
                  label="진행 상황"
                  value={currentActionTask.status}
                />
              </View>

              <Text style={styles.inputLabel}>
                조치 내용
              </Text>

              <TextInput
                style={[
                  styles.textArea,
                  currentActionTask.completed &&
                    styles.textAreaDisabled,
                ]}
                value={
                  currentActionTask.completed
                    ? currentActionTask.content
                    : actionDetailContent
                }
                onChangeText={
                  setActionDetailContent
                }
                placeholder="수행한 조치 내용을 입력하세요."
                placeholderTextColor="#9BACBE"
                multiline
                editable={
                  !currentActionTask.completed &&
                  !isSubmitting
                }
                textAlignVertical="top"
              />

              <View style={styles.uploadHeader}>
                <Text style={styles.inputLabel}>
                  사진 첨부
                </Text>

                <View
                  style={styles.photoCountBadge}
                >
                  <Text
                    style={styles.photoCountText}
                  >
                    {
                      currentActionTask.photos
                        .length
                    }
                    장
                  </Text>
                </View>
              </View>

              <View style={styles.photoGrid}>
                {currentActionTask.photos.map(
                  (photo) => (
                    <View
                      key={photo.id}
                      style={styles.photoPreview}
                    >
                      <Pressable
                        style={
                          styles.photoImageButton
                        }
                        onPress={() =>
                          setPreviewPhoto(photo)
                        }
                      >
                        <Image
                          source={{
                            uri: photo.uri,
                          }}
                          style={styles.photoImage}
                        />
                      </Pressable>

                      {!currentActionTask.completed &&
                        photo.isLocal && (
                          <Pressable
                            style={
                              styles.deletePhotoButton
                            }
                            onPress={() =>
                              removeActionPhoto(
                                photo.id
                              )
                            }
                          >
                            <Ionicons
                              name="close"
                              size={15}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        )}
                    </View>
                  )
                )}

                {!currentActionTask.completed && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.addPhotoButton,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={pickActionImages}
                    disabled={isSubmitting}
                  >
                    <Ionicons
                      name="add"
                      size={27}
                      color="#2F64B7"
                    />

                    <Text
                      style={styles.addPhotoText}
                    >
                      사진 추가
                    </Text>
                  </Pressable>
                )}
              </View>

              {!currentActionTask.completed ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.submitActionButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}
                  onPress={completeAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-done-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  )}

                  <Text
                    style={
                      styles.submitActionButtonText
                    }
                  >
                    {isSubmitting
                      ? "처리 중..."
                      : "조치 완료"}
                  </Text>
                </Pressable>
              ) : (
                <View
                  style={styles.completedMessage}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#24835E"
                  />

                  <Text
                    style={
                      styles.completedMessageText
                    }
                  >
                    완료된 조치 항목입니다.
                  </Text>
                </View>
              )}
            </View>
          )}
      </ScrollView>

      <Modal
        visible={Boolean(previewPhoto)}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setPreviewPhoto(null)
        }
      >
        <Pressable
          style={styles.imageModal}
          onPress={() => setPreviewPhoto(null)}
        >
          {previewPhoto && (
            <Image
              source={{
                uri: previewPhoto.uri,
              }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}

          <View
            style={styles.modalCloseButton}
          >
            <Ionicons
              name="close"
              size={23}
              color="#FFFFFF"
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

type TaskTabProps = {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
};

function TaskTab({
  label,
  count,
  active,
  onPress,
}: TaskTabProps) {
  return (
    <Pressable
      style={[
        styles.taskTabButton,
        active &&
          styles.taskTabButtonActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.taskTabText,
          active && styles.taskTabTextActive,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.taskTabCount,
          active &&
            styles.taskTabCountActive,
        ]}
      >
        <Text
          style={[
            styles.taskTabCountText,
            active &&
              styles.taskTabCountTextActive,
          ]}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        numberOfLines={2}
        style={styles.infoValue}
      >
        {value || "-"}
      </Text>
    </View>
  );
}