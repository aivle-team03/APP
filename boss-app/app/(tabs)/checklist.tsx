import { useMemo, useState } from "react";
import {
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

import { TODAY_INSPECTION_MOCK_DATA } from "../mocks/mockData";
import { styles } from "../styles/checklistStyles";

type TaskView = "inspection" | "action";
type InspectionStatus = "점검 대기" | "점검 완료" | "조치 등록 완료";
type ActionStatus = "조치 대기" | "조치 완료";

type InspectionTask = {
  id: string | number;
  taskKey: string;
  text: string;
  type: string;
  status: string;
  inspectionStatus: InspectionStatus;
  location: string;
  date: string;
  imageUrl?: string;
  completed: boolean;
  category: string;
  inspector: string;
  movedToAction: boolean;
};

type ActionPhoto = {
  id: string;
  uri: string;
  name: string;
};

type ActionTask = {
  id: string | number;
  taskKey: string;
  inspectionRef: string;
  inspectionLocation: string;
  inspectionDate: string;
  inspector: string;
  category: string;
  text: string;
  location: string;
  risk: string;
  date: string;
  status: ActionStatus;
  assignee: string;
  inspectionContent: string;
  content: string;
  completed: boolean;
  photos: ActionPhoto[];
};

type ChecklistTask = InspectionTask | ActionTask;

const TODAY = "2026-07-25";

const ACTION_MOCK_DATA: ActionTask[] = [
  {
    id: "action-1",
    taskKey: "action-action-1",
    inspectionRef: "비상구 앞 적치물 제거",
    inspectionLocation: "B동 1층 현관",
    inspectionDate: TODAY,
    inspector: "이안전",
    category: "시설 안전",
    text: "비상구 앞 적치물 제거",
    location: "B동 1층 현관",
    risk: "높음",
    date: TODAY,
    status: "조치 대기",
    assignee: "박지훈",
    inspectionContent: "피난 동선을 막는 박스와 자재를 이동해야 합니다.",
    content: "",
    completed: false,
    photos: [],
  },
  {
    id: "action-2",
    taskKey: "action-action-2",
    inspectionRef: "방화문 폐쇄 상태 점검",
    inspectionLocation: "A동 2층 복도",
    inspectionDate: TODAY,
    inspector: "이안전",
    category: "소방 안전",
    text: "방화문 폐쇄 상태 개선",
    location: "A동 2층 복도",
    risk: "중",
    date: TODAY,
    status: "조치 완료",
    assignee: "박동준",
    inspectionContent:
      "방화문 주변 장애물이 있어 자동 폐쇄 상태 확인이 필요합니다.",
    content:
      "방화문 주변 장애물을 제거하고 자동 폐쇄 상태를 확인했습니다.",
    completed: true,
    photos: [],
  },
];

function createKey(prefix: string, id: string | number) {
  return `${prefix}-${id}`;
}

function sortTasksByCompletion(
  tasks: ChecklistTask[],
  view: TaskView
): ChecklistTask[] {
  return [...tasks].sort((a, b) => {
    const aCompleted =
      view === "inspection"
        ? (a as InspectionTask).inspectionStatus === "점검 완료" ||
          (a as InspectionTask).movedToAction
        : (a as ActionTask).status === "조치 완료";

    const bCompleted =
      view === "inspection"
        ? (b as InspectionTask).inspectionStatus === "점검 완료" ||
          (b as InspectionTask).movedToAction
        : (b as ActionTask).status === "조치 완료";

    return Number(aCompleted) - Number(bCompleted);
  });
}

export default function ChecklistScreen() {
  const [inspectionTasks, setInspectionTasks] = useState<InspectionTask[]>(() =>
    TODAY_INSPECTION_MOCK_DATA.map((task) => ({
      ...task,
      taskKey: createKey("inspection", task.id),
      category: "소방 안전",
      inspectionStatus: task.status as InspectionStatus,
      inspector: "이안전",
      movedToAction: false,
    }))
  );

  const [actionTasks, setActionTasks] =
    useState<ActionTask[]>(ACTION_MOCK_DATA);
  const [activeTaskView, setActiveTaskView] =
    useState<TaskView>("inspection");
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | null>(null);
  const [actionContent, setActionContent] = useState("");
  const [actionDetailContent, setActionDetailContent] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<ActionPhoto | null>(null);

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
          (task) => task.taskKey === effectiveSelectedTaskKey
        )
      : undefined;

  const currentActionTask =
    activeTaskView === "action"
      ? actionTasks.find(
          (task) => task.taskKey === effectiveSelectedTaskKey
        )
      : undefined;

  const progress = useMemo(() => {
    if (activeTaskView === "inspection") {
      const done = inspectionTasks.filter(
        (task) =>
          task.inspectionStatus === "점검 완료" || task.movedToAction
      ).length;
      const total = inspectionTasks.length;

      return {
        done,
        total,
        percent: total ? Math.round((done / total) * 100) : 0,
      };
    }

    const done = actionTasks.filter(
      (task) => task.status === "조치 완료"
    ).length;
    const total = actionTasks.length;

    return {
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  }, [activeTaskView, inspectionTasks, actionTasks]);

  const selectTaskView = (view: TaskView) => {
    setActiveTaskView(view);
    setSelectedTaskKey(null);
    setActionContent("");
    setActionDetailContent("");
  };

  const selectTask = (task: InspectionTask | ActionTask) => {
    const isLocked =
      activeTaskView === "inspection" &&
      ((task as InspectionTask).inspectionStatus === "점검 완료" ||
        (task as InspectionTask).movedToAction);

    if (isLocked) return;

    setSelectedTaskKey(task.taskKey);

    if (activeTaskView === "action") {
      setActionDetailContent((task as ActionTask).content ?? "");
    }
  };

  const completeInspection = () => {
    if (!currentInspectionTask) return;

    setInspectionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentInspectionTask.taskKey
          ? {
              ...task,
              inspectionStatus: "점검 완료",
              completed: true,
            }
          : task
      )
    );

    setSelectedTaskKey(null);
    Alert.alert("점검 완료", "선택한 항목의 점검이 완료되었습니다.");
  };

  const registerAction = () => {
    if (!currentInspectionTask) return;

    if (!actionContent.trim()) {
      Alert.alert(
        "입력 확인",
        "점검 결과 또는 필요한 조치 내용을 입력해주세요."
      );
      return;
    }

    const actionId = Date.now();

    const newAction: ActionTask = {
      id: actionId,
      taskKey: createKey("action", actionId),
      inspectionRef: currentInspectionTask.text,
      inspectionLocation: currentInspectionTask.location,
      inspectionDate: currentInspectionTask.date,
      inspector: currentInspectionTask.inspector,
      category: currentInspectionTask.category,
      text: currentInspectionTask.text,
      location: currentInspectionTask.location,
      risk: "미산정",
      date: TODAY,
      status: "조치 대기",
      assignee: "이안전",
      inspectionContent: actionContent.trim(),
      content: "",
      completed: false,
      photos: [],
    };

    setActionTasks((current) => [newAction, ...current]);

    setInspectionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentInspectionTask.taskKey
          ? {
              ...task,
              inspectionStatus: "조치 등록 완료",
              movedToAction: true,
            }
          : task
      )
    );

    setActionContent("");
    setSelectedTaskKey(null);
    Alert.alert("조치 등록 완료", "조치 대기 항목으로 등록되었습니다.");
  };

  const pickActionImages = async () => {
    if (!currentActionTask || currentActionTask.completed) return;

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
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const newPhotos: ActionPhoto[] = result.assets.map((asset, index) => ({
      id: `${Date.now()}-${index}`,
      uri: asset.uri,
      name:
        asset.fileName ??
        `조치사진-${Date.now()}-${index + 1}.jpg`,
    }));

    setActionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentActionTask.taskKey
          ? { ...task, photos: [...task.photos, ...newPhotos] }
          : task
      )
    );
  };

  const removeActionPhoto = (photoId: string) => {
    if (!currentActionTask || currentActionTask.completed) return;

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

  const completeAction = () => {
    if (!currentActionTask) return;

    if (!actionDetailContent.trim()) {
      Alert.alert("입력 확인", "수행한 조치 내용을 입력해주세요.");
      return;
    }

    if (!currentActionTask.photos.length) {
      Alert.alert(
        "사진 필요",
        "조치 완료를 위해 사진을 한 장 이상 첨부해주세요."
      );
      return;
    }

    setActionTasks((current) =>
      current.map((task) =>
        task.taskKey === currentActionTask.taskKey
          ? {
              ...task,
              content: actionDetailContent.trim(),
              status: "조치 완료",
              completed: true,
            }
          : task
      )
    );

    setActionDetailContent("");
    setSelectedTaskKey(null);
    Alert.alert("조치 완료", "선택한 항목의 조치가 완료되었습니다.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderText}>
            <Text style={styles.pageEyebrow}>SAFETY CHECKLIST</Text>
            <Text style={styles.pageTitle}>점검 · 조치 목록</Text>
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
            active={activeTaskView === "inspection"}
            onPress={() => selectTaskView("inspection")}
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
            <Text style={styles.progressLabel}>전체 진행률</Text>
            <Text style={styles.progressValue}>
              {progress.done}/{progress.total} ({progress.percent}%)
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${progress.percent}%` },
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
              const inspectionTask = task as InspectionTask;
              const actionTask = task as ActionTask;
              const selected =
                task.taskKey === effectiveSelectedTaskKey;

              const completed =
                activeTaskView === "inspection"
                  ? inspectionTask.inspectionStatus === "점검 완료" ||
                    inspectionTask.movedToAction
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
                    selected && styles.taskItemSelected,
                    completed && styles.taskItemCompleted,
                    pressed &&
                      !completed &&
                      styles.taskItemPressed,
                  ]}
                  disabled={
                    activeTaskView === "inspection" && completed
                  }
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
                      <View style={styles.taskCheckDot} />
                    )}
                  </View>

                  <View style={styles.taskTextArea}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.taskTitle,
                        completed && styles.taskTitleCompleted,
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

                    <View style={styles.taskStatusRow}>
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

                  {!completed && (
                    <Ionicons
                      name="chevron-forward"
                      size={19}
                      color="#8EA1B7"
                    />
                  )}
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
                <Text style={styles.emptyStateText}>
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
                  ACTION REGISTRATION
                </Text>
                <Text style={styles.detailTitle}>조치 등록</Text>
                <Text style={styles.detailDescription}>
                  점검 결과에 따라 필요한 조치를 등록합니다.
                </Text>
              </View>

              <View style={styles.referenceCard}>
                <InfoItem
                  label="이름"
                  value={currentInspectionTask.text}
                />
                <InfoItem
                  label="현장 구역"
                  value={currentInspectionTask.location}
                />
                <InfoItem
                  label="위험도 카테고리"
                  value={currentInspectionTask.category}
                />
                <InfoItem
                  label="진행 상황"
                  value={currentInspectionTask.inspectionStatus}
                />
              </View>

              <Text style={styles.inputLabel}>
                점검 및 조치 필요 내용
              </Text>

              <TextInput
                style={styles.textArea}
                value={actionContent}
                onChangeText={setActionContent}
                placeholder="점검 결과 또는 필요한 조치 내용을 입력하세요."
                placeholderTextColor="#9BACBE"
                multiline
                textAlignVertical="top"
              />

              <View style={styles.inspectionButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={completeInspection}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color="#FFFFFF"
                  />
                  <Text style={styles.primaryButtonText}>
                    점검 완료
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.dangerButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={registerAction}
                >
                  <Ionicons
                    name="warning-outline"
                    size={19}
                    color="#A53636"
                  />
                  <Text style={styles.dangerButtonText}>
                    조치 필요
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

        {activeTaskView === "action" && currentActionTask && (
          <View style={styles.card}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailEyebrow}>
                ACTION DETAIL
              </Text>
              <Text style={styles.detailTitle}>조치 내용</Text>
              <Text style={styles.detailDescription}>
                점검 이력이 연결된 조치 업무입니다.
              </Text>
            </View>

            <View style={styles.referenceCard}>
              <InfoItem
                label="이름"
                value={currentActionTask.inspectionRef}
              />
              <InfoItem
                label="현장 구역"
                value={currentActionTask.inspectionLocation}
              />
              <InfoItem
                label="위험도 카테고리"
                value={currentActionTask.category}
              />
              <InfoItem
                label="위험도"
                value={currentActionTask.risk}
              />
              <InfoItem
                label="진행 상황"
                value={currentActionTask.status}
              />
              <InfoItem
                label="조치 담당자"
                value={currentActionTask.assignee}
              />

              <View style={styles.infoItemWide}>
                <Text style={styles.infoLabel}>점검 내용</Text>
                <Text style={styles.infoValueMultiline}>
                  {currentActionTask.inspectionContent ||
                    "점검 시 입력한 내용이 없습니다."}
                </Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>조치 내용</Text>

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
              onChangeText={setActionDetailContent}
              placeholder="수행한 조치 내용을 입력하세요."
              placeholderTextColor="#9BACBE"
              multiline
              editable={!currentActionTask.completed}
              textAlignVertical="top"
            />

            <View style={styles.uploadHeader}>
              <Text style={styles.inputLabel}>사진 첨부</Text>
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>
                  {currentActionTask.photos.length}장
                </Text>
              </View>
            </View>

            <View style={styles.photoGrid}>
              {currentActionTask.photos.map((photo) => (
                <View
                  key={photo.id}
                  style={styles.photoPreview}
                >
                  <Pressable
                    style={styles.photoImageButton}
                    onPress={() => setPreviewPhoto(photo)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photoImage}
                    />
                  </Pressable>

                  {!currentActionTask.completed && (
                    <Pressable
                      style={styles.deletePhotoButton}
                      onPress={() =>
                        removeActionPhoto(photo.id)
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
              ))}

              {!currentActionTask.completed && (
                <Pressable
                  style={({ pressed }) => [
                    styles.addPhotoButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={pickActionImages}
                >
                  <Ionicons
                    name="add"
                    size={27}
                    color="#2F64B7"
                  />
                  <Text style={styles.addPhotoText}>
                    사진 추가
                  </Text>
                </Pressable>
              )}
            </View>

            {!currentActionTask.completed ? (
              <Pressable
                style={({ pressed }) => [
                  styles.submitActionButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={completeAction}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitActionButtonText}>
                  조치 완료
                </Text>
              </Pressable>
            ) : (
              <View style={styles.completedMessage}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#24835E"
                />
                <Text style={styles.completedMessageText}>
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
        onRequestClose={() => setPreviewPhoto(null)}
      >
        <Pressable
          style={styles.imageModal}
          onPress={() => setPreviewPhoto(null)}
        >
          {previewPhoto && (
            <Image
              source={{ uri: previewPhoto.uri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.modalCloseButton}>
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
        active && styles.taskTabButtonActive,
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
          active && styles.taskTabCountActive,
        ]}
      >
        <Text
          style={[
            styles.taskTabCountText,
            active && styles.taskTabCountTextActive,
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

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}
