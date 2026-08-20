import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { styles } from "../styles/educationStyles";

const API_BASE_URL = "http://172.20.10.3:8000";

type EducationStatus =
  | "미이수"
  | "진행중"
  | "이수"
  | "완료"
  | string;

type EducationCourse = {
  id: string;
  contentId: string;
  educationId: number;
  title: string;
  role: string;
  deadline: string;
  status: EducationStatus;
  category: string;
  duration: string;
  videoUrl: string;
  progress: number;
};

type EducationSummary = {
  due_this_week_count?: number;
  in_progress_count?: number;
  completed_count?: number;
};

type EducationRates = {
  essential_rate?: number;
  regular_rate?: number;
  special_rate?: number;
  total_rate?: number;
};

type SummaryType = "due" | "progress" | "complete";

type SummaryModalData = {
  type: SummaryType;
  label: string;
  description: string;
  courses: EducationCourse[];
};

const fallbackCourses: EducationCourse[] = [
  {
    id: "fallback-1",
    contentId: "forklift-basics",
    educationId: 0,
    title: "지게차 작업 안전 기본교육",
    role: "현장 작업자",
    deadline: "이번 주",
    status: "진행중",
    category: "필수 교육",
    duration: "20분",
    videoUrl: "",
    progress: 86,
  },
  {
    id: "fallback-2",
    contentId: "fire-response",
    educationId: 0,
    title: "화재 발생 시 초기 대응교육",
    role: "전체 근로자",
    deadline: "오늘",
    status: "진행중",
    category: "정기 교육",
    duration: "15분",
    videoUrl: "",
    progress: 35,
  },
  {
    id: "fallback-3",
    contentId: "ppe-basics",
    educationId: 0,
    title: "개인보호구 착용 교육",
    role: "현장 작업자",
    deadline: "완료",
    status: "이수",
    category: "필수 교육",
    duration: "12분",
    videoUrl: "",
    progress: 100,
  },
];

function normalizeStatus(status?: string): EducationStatus {
  if (!status) return "미이수";

  if (status === "완료") return "이수";
  return status;
}

function getProgressFromStatus(status: EducationStatus) {
  if (status === "이수" || status === "완료") {
    return 100;
  }

  if (status === "진행중") {
    return 40;
  }

  return 0;
}

function getStatusLabel(status: EducationStatus) {
  if (status === "완료") return "이수";
  return status || "미이수";
}

function getStatusTone(status: EducationStatus) {
  if (status === "이수" || status === "완료") {
    return "complete";
  }

  if (status === "진행중") {
    return "progress";
  }

  return "waiting";
}

function getDeadlineLabel(value?: string | null) {
  if (!value) return "-";
  return String(value).slice(0, 10);
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

export default function EducationScreen() {
  const [courses, setCourses] = useState<EducationCourse[]>([]);
  const [summary, setSummary] =
    useState<EducationSummary | null>(null);
  const [rates, setRates] =
    useState<EducationRates | null>(null);

  const [selectedCourseId, setSelectedCourseId] =
    useState<string | null>(null);

  const [summaryModal, setSummaryModal] =
    useState<SummaryModalData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [isCompleting, setIsCompleting] =
    useState(false);

  const fetchEducationData = async (
    useRefreshIndicator = false
  ) => {
    if (useRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const headers = await getAuthHeaders();

      const [
        summaryResult,
        statusResult,
        ratesResult,
      ] = await Promise.allSettled([
        axios.get(
          `${API_BASE_URL}/api/education/summary`,
          { headers }
        ),
        axios.get(
          `${API_BASE_URL}/api/education/status`,
          { headers }
        ),
        axios.get(
          `${API_BASE_URL}/api/education/completion-rates`,
          { headers }
        ),
      ]);

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value.data ?? {});
      } else {
        console.log(
          "교육 요약 조회 실패:",
          summaryResult.reason
        );
      }

      if (ratesResult.status === "fulfilled") {
        setRates(ratesResult.value.data ?? {});
      } else {
        console.log(
          "교육 이수율 조회 실패:",
          ratesResult.reason
        );
      }

      if (statusResult.status === "fulfilled") {
        const responseData = statusResult.value.data;

        const items = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.items)
            ? responseData.items
            : [];

        const mappedCourses: EducationCourse[] =
          items.map((item: any) => {
            const status = normalizeStatus(
              item.status
            );

            const serverProgress = Number(
              item.progress ??
                item.progress_rate ??
                item.completion_rate
            );

            const progress = Number.isFinite(
              serverProgress
            )
              ? Math.max(
                  0,
                  Math.min(100, serverProgress)
                )
              : getProgressFromStatus(status);

            return {
              id: `api-${item.education_id}`,
              contentId: `api-content-${item.education_id}`,
              educationId: item.education_id,
              title:
                item.title || "안전 교육",
              role:
                item.role ||
                item.target ||
                "전체 근로자",
              deadline: getDeadlineLabel(
                item.due_date
              ),
              status,
              category:
                item.category || "안전 교육",
              duration:
                item.duration ||
                item.type ||
                "교육 영상",
              videoUrl: item.video_url || "",
              progress,
            };
          });

        setCourses(
          mappedCourses.length
            ? mappedCourses
            : fallbackCourses
        );

        setSelectedCourseId((current) => {
          if (
            current &&
            mappedCourses.some(
              (course) => course.id === current
            )
          ) {
            return current;
          }

          return (
            mappedCourses[0]?.id ??
            fallbackCourses[0]?.id ??
            null
          );
        });
      } else {
        console.log(
          "교육 상태 조회 실패:",
          statusResult.reason
        );

        setCourses((current) =>
          current.length ? current : fallbackCourses
        );

        setSelectedCourseId((current) =>
          current ??
          fallbackCourses[0]?.id ??
          null
        );
      }
    } catch (error) {
      console.log("교육 데이터 조회 오류:", error);

      setCourses((current) =>
        current.length ? current : fallbackCourses
      );

      setSelectedCourseId((current) =>
        current ?? fallbackCourses[0]?.id ?? null
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const currentCourse =
    courses.find(
      (course) => course.id === selectedCourseId
    ) ??
    courses[0] ??
    null;

  const currentCourseIndex = currentCourse
    ? courses.findIndex(
        (course) =>
          course.id === currentCourse.id
      )
    : -1;

  const dueCourses = useMemo(
    () =>
      courses.filter((course) => {
        const isIncomplete =
          course.status !== "이수" &&
          course.status !== "완료";

        const deadlineText =
          course.deadline || "";

        return (
          isIncomplete &&
          (deadlineText.includes("오늘") ||
            deadlineText.includes("내일") ||
            deadlineText.includes("이번 주") ||
            deadlineText !== "-")
        );
      }),
    [courses]
  );

  const inProgressCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.progress > 0 &&
          course.progress < 100 &&
          course.status !== "이수" &&
          course.status !== "완료"
      ),
    [courses]
  );

  const completedCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.progress >= 100 ||
          course.status === "이수" ||
          course.status === "완료"
      ),
    [courses]
  );

  const summaryCards = useMemo(
    () => [
      {
        type: "due" as SummaryType,
        label: "이번 주 마감",
        value:
          summary?.due_this_week_count ??
          dueCourses.length,
        description:
          "마감 전 교육을 확인하세요.",
        icon: "book-outline" as const,
        tone: "blue" as const,
        courses: dueCourses,
      },
      {
        type: "progress" as SummaryType,
        label: "진행 중",
        value:
          summary?.in_progress_count ??
          inProgressCourses.length,
        description:
          "수강 중인 교육이 있습니다.",
        icon: "play-circle-outline" as const,
        tone: "green" as const,
        courses: inProgressCourses,
      },
      {
        type: "complete" as SummaryType,
        label: "이수 완료",
        value:
          summary?.completed_count ??
          completedCourses.length,
        description:
          "완료한 교육을 확인하세요.",
        icon: "checkmark-circle-outline" as const,
        tone: "purple" as const,
        courses: completedCourses,
      },
    ],
    [
      completedCourses,
      dueCourses,
      inProgressCourses,
      summary,
    ]
  );

  const rateItems = useMemo(
    () => [
      {
        label: "필수 교육",
        value:
          rates?.essential_rate ??
          calculateCompletionRate(
            courses.filter((course) =>
              course.category.includes("필수")
            )
          ),
      },
      {
        label: "정기 교육",
        value:
          rates?.regular_rate ??
          calculateCompletionRate(
            courses.filter((course) =>
              course.category.includes("정기")
            )
          ),
      },
      {
        label: "특별 교육",
        value:
          rates?.special_rate ??
          calculateCompletionRate(
            courses.filter((course) =>
              course.category.includes("특별")
            )
          ),
      },
      {
        label: "전체",
        value:
          rates?.total_rate ??
          calculateCompletionRate(courses),
      },
    ],
    [courses, rates]
  );

  const openCurrentVideo = async () => {
    if (!currentCourse?.videoUrl) {
      Alert.alert(
        "영상 없음",
        "등록된 교육 영상이 없습니다."
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(
        currentCourse.videoUrl
      );

      if (!supported) {
        Alert.alert(
          "재생 실패",
          "해당 영상 주소를 열 수 없습니다."
        );
        return;
      }

      await Linking.openURL(currentCourse.videoUrl);
    } catch (error) {
      console.log("영상 실행 실패:", error);

      Alert.alert(
        "재생 실패",
        "교육 영상을 실행하지 못했습니다."
      );
    }
  };

  const completeCurrentCourse = async () => {
    if (
      !currentCourse ||
      isCompleting ||
      currentCourse.status === "이수" ||
      currentCourse.status === "완료"
    ) {
      return;
    }

    if (currentCourse.progress < 80) {
      Alert.alert(
        "진도율 확인",
        "영상의 80% 이상을 수강해야 이수 완료할 수 있습니다."
      );
      return;
    }

    if (!currentCourse.educationId) {
      Alert.alert(
        "처리 불가",
        "서버에 등록된 교육만 이수 완료 처리할 수 있습니다."
      );
      return;
    }

    setIsCompleting(true);

    try {
      const headers = await getAuthHeaders();

      await axios.post(
        `${API_BASE_URL}/api/education/${currentCourse.educationId}/complete`,
        {},
        { headers }
      );

      setCourses((current) =>
        current.map((course) =>
          course.id === currentCourse.id
            ? {
                ...course,
                status: "이수",
                progress: 100,
              }
            : course
        )
      );

      Alert.alert(
        "이수 완료",
        "교육이 이수 완료 처리되었습니다."
      );

      await fetchEducationData(true);
    } catch (error) {
      console.log("교육 이수 처리 실패:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.error?.message
        : undefined;

      Alert.alert(
        "처리 실패",
        message ||
          "교육 이수 완료 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const showPreviousCourse = () => {
    if (currentCourseIndex <= 0) return;

    setSelectedCourseId(
      courses[currentCourseIndex - 1].id
    );
  };

  const showNextCourse = () => {
    if (
      currentCourseIndex < 0 ||
      currentCourseIndex >= courses.length - 1
    ) {
      return;
    }

    setSelectedCourseId(
      courses[currentCourseIndex + 1].id
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#3974C6"
          />

          <Text style={styles.loadingText}>
            교육 정보를 불러오는 중입니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() =>
              fetchEducationData(true)
            }
            tintColor="#3974C6"
          />
        }
      >
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderText}>
            <Text style={styles.pageEyebrow}>
              SAFETY EDUCATION
            </Text>

            <Text style={styles.pageTitle}>
              안전 교육
            </Text>

            <Text style={styles.pageDescription}>
              배정된 안전 교육을 확인하고 이수 현황을 관리하세요.
            </Text>
          </View>

          <View style={styles.headerCountBadge}>
            <Text style={styles.headerCountLabel}>
              전체 교육
            </Text>

            <Text style={styles.headerCountValue}>
              {courses.length}
            </Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.type}
              label={card.label}
              value={card.value}
              description={card.description}
              icon={card.icon}
              tone={card.tone}
              onPress={() =>
                setSummaryModal({
                  type: card.type,
                  label: card.label,
                  description:
                    card.description,
                  courses: card.courses,
                })
              }
            />
          ))}
        </View>

        {currentCourse && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardEyebrow}>
                  교육 영상
                </Text>

                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}
                >
                  {currentCourse.title}
                </Text>
              </View>

              <View style={styles.categoryBadge}>
                <Text
                  style={styles.categoryBadgeText}
                >
                  {currentCourse.category}
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.videoPreview,
                pressed &&
                  styles.pressablePressed,
              ]}
              onPress={openCurrentVideo}
            >
              <View style={styles.videoTopRow}>
                <View
                  style={styles.videoTypeBadge}
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.videoTypeText
                    }
                  >
                    교육 영상
                  </Text>
                </View>

                <Text style={styles.videoTime}>
                  {currentCourse.duration}
                </Text>
              </View>

              <View style={styles.videoCenter}>
                <View
                  style={styles.videoPlayButton}
                >
                  <Ionicons
                    name="play"
                    size={35}
                    color="#FFFFFF"
                  />
                </View>

                <Text
                  style={styles.videoTitle}
                  numberOfLines={2}
                >
                  {currentCourse.title}
                </Text>

                <Text
                  style={styles.videoDescription}
                >
                  눌러서 교육 영상을 재생하세요.
                </Text>
              </View>

              <View style={styles.videoBottomLine} />
            </Pressable>

            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                진행률
              </Text>

              <Text style={styles.progressValue}>
                {currentCourse.progress}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${currentCourse.progress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={styles.progressDescription}
            >
              영상의 80% 이상을 수강하면 이수 완료할 수 있습니다.
            </Text>

            <View
              style={styles.courseNavigation}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  currentCourseIndex <= 0 &&
                    styles.buttonDisabled,
                  pressed &&
                    currentCourseIndex > 0 &&
                    styles.pressablePressed,
                ]}
                onPress={showPreviousCourse}
                disabled={currentCourseIndex <= 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color="#3D669D"
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  이전 강의
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  currentCourseIndex >=
                    courses.length - 1 &&
                    styles.buttonDisabled,
                  pressed &&
                    currentCourseIndex <
                      courses.length - 1 &&
                    styles.pressablePressed,
                ]}
                onPress={showNextCourse}
                disabled={
                  currentCourseIndex >=
                  courses.length - 1
                }
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  다음 강의
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#3D669D"
                />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.completeButton,
                (currentCourse.progress < 80 ||
                  currentCourse.status ===
                    "이수" ||
                  currentCourse.status ===
                    "완료" ||
                  isCompleting) &&
                  styles.completeButtonDisabled,
                pressed &&
                  currentCourse.progress >= 80 &&
                  styles.pressablePressed,
              ]}
              onPress={completeCurrentCourse}
              disabled={
                currentCourse.progress < 80 ||
                currentCourse.status === "이수" ||
                currentCourse.status === "완료" ||
                isCompleting
              }
            >
              {isCompleting ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text
                style={
                  styles.completeButtonText
                }
              >
                {isCompleting
                  ? "처리 중..."
                  : currentCourse.status ===
                        "이수" ||
                      currentCourse.status ===
                        "완료"
                    ? "이수 완료됨"
                    : currentCourse.progress < 80
                      ? "진도율 80% 이상 필요"
                      : "이수 완료"}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.cardEyebrow}>
                나의 수강 현황
              </Text>

              <Text style={styles.sectionTitle}>
                내 교육 리스트
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {courses.length}개 과정
              </Text>
            </View>
          </View>

          <View style={styles.courseList}>
            {courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                selected={
                  currentCourse?.id === course.id
                }
                onPress={() =>
                  setSelectedCourseId(course.id)
                }
              />
            ))}

            {!courses.length && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="school-outline"
                  size={36}
                  color="#9AABBD"
                />

                <Text style={styles.emptyText}>
                  배정된 교육이 없습니다.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.cardEyebrow}>
                나의 학습 현황
              </Text>

              <Text style={styles.sectionTitle}>
                교육 이수 현황
              </Text>
            </View>
          </View>

          <View style={styles.rateGrid}>
            {rateItems.map((item, index) => (
              <CompletionRateCard
                key={item.label}
                label={item.label}
                value={item.value}
                toneIndex={index}
              />
            ))}
          </View>
        </View>

        <View style={styles.guideCard}>
          <View style={styles.guideIcon}>
            <Ionicons
              name="school-outline"
              size={32}
              color="#3974C6"
            />
          </View>

          <View style={styles.guideContent}>
            <Text style={styles.cardEyebrow}>
              학습 안내
            </Text>

            <Text style={styles.guideTitle}>
              수강 전 확인하세요
            </Text>

            <GuideItem text="영상의 80% 이상을 시청하면 이수 완료 버튼이 활성화됩니다." />
            <GuideItem text="필수 교육은 정해진 마감일까지 반드시 수강해야 합니다." />
            <GuideItem text="진도율 저장 기능은 백엔드 진도 저장 API와 연결해야 합니다." />
          </View>
        </View>
      </ScrollView>

      <EducationSummaryModal
        data={summaryModal}
        onClose={() => setSummaryModal(null)}
        onSelectCourse={(course) => {
          setSelectedCourseId(course.id);
          setSummaryModal(null);
        }}
      />
    </SafeAreaView>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "blue" | "green" | "purple";
  onPress: () => void;
};

function SummaryCard({
  label,
  value,
  description,
  icon,
  tone,
  onPress,
}: SummaryCardProps) {
  const toneStyle =
    tone === "green"
      ? styles.summaryIconGreen
      : tone === "purple"
        ? styles.summaryIconPurple
        : styles.summaryIconBlue;

  const toneColor =
    tone === "green"
      ? "#25875A"
      : tone === "purple"
        ? "#725BD0"
        : "#3974C6";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.summaryCard,
        pressed && styles.pressablePressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.summaryIcon,
          toneStyle,
        ]}
      >
        <Ionicons
          name={icon}
          size={25}
          color={toneColor}
        />
      </View>

      <View style={styles.summaryTextArea}>
        <Text style={styles.summaryLabel}>
          {label}
        </Text>

        <Text style={styles.summaryValue}>
          {value}건
        </Text>

        <Text
          style={styles.summaryDescription}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color="#8292A7"
      />
    </Pressable>
  );
}

type CourseListItemProps = {
  course: EducationCourse;
  selected: boolean;
  onPress: () => void;
};

function CourseListItem({
  course,
  selected,
  onPress,
}: CourseListItemProps) {
  const tone = getStatusTone(course.status);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.courseItem,
        selected && styles.courseItemSelected,
        pressed && styles.pressablePressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.courseIcon,
          course.progress >= 100 &&
            styles.courseIconCompleted,
        ]}
      >
        <Ionicons
          name={
            course.progress >= 100
              ? "checkmark"
              : "play"
          }
          size={16}
          color={
            course.progress >= 100
              ? "#FFFFFF"
              : "#3974C6"
          }
        />
      </View>

      <View style={styles.courseItemContent}>
        <View style={styles.courseTitleRow}>
          <Text
            style={styles.courseItemTitle}
            numberOfLines={1}
          >
            {course.title}
          </Text>

          <View
            style={[
              styles.statusBadge,
              tone === "complete" &&
                styles.statusBadgeComplete,
              tone === "progress" &&
                styles.statusBadgeProgress,
              tone === "waiting" &&
                styles.statusBadgeWaiting,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                tone === "complete" &&
                  styles.statusTextComplete,
                tone === "progress" &&
                  styles.statusTextProgress,
                tone === "waiting" &&
                  styles.statusTextWaiting,
              ]}
            >
              {getStatusLabel(course.status)}
            </Text>
          </View>
        </View>

        <Text
          style={styles.courseMeta}
          numberOfLines={1}
        >
          {course.role} · 마감{" "}
          {course.deadline}
        </Text>

        <View style={styles.courseProgressRow}>
          <Text
            style={styles.courseProgressValue}
          >
            {course.progress}%
          </Text>

          <View
            style={styles.courseProgressTrack}
          >
            <View
              style={[
                styles.courseProgressBar,
                {
                  width: `${course.progress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#91A0B2"
      />
    </Pressable>
  );
}

type CompletionRateCardProps = {
  label: string;
  value: number;
  toneIndex: number;
};

function CompletionRateCard({
  label,
  value,
  toneIndex,
}: CompletionRateCardProps) {
  const safeValue = Math.max(
    0,
    Math.min(100, Math.round(value || 0))
  );

  const toneStyle =
    toneIndex === 1
      ? styles.rateIconGreen
      : toneIndex === 2
        ? styles.rateIconPurple
        : toneIndex === 3
          ? styles.rateIconOrange
          : styles.rateIconBlue;

  const iconColor =
    toneIndex === 1
      ? "#25875A"
      : toneIndex === 2
        ? "#725BD0"
        : toneIndex === 3
          ? "#D07A22"
          : "#3974C6";

  return (
    <View style={styles.rateCard}>
      <View
        style={[styles.rateIcon, toneStyle]}
      >
        <Ionicons
          name="stats-chart-outline"
          size={19}
          color={iconColor}
        />
      </View>

      <Text style={styles.rateLabel}>
        {label}
      </Text>

      <Text style={styles.rateValue}>
        {safeValue}%
      </Text>

      <View style={styles.rateTrack}>
        <View
          style={[
            styles.rateBar,
            {
              width: `${safeValue}%`,
              backgroundColor: iconColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

function GuideItem({ text }: { text: string }) {
  return (
    <View style={styles.guideItem}>
      <View style={styles.guideDot} />

      <Text style={styles.guideItemText}>
        {text}
      </Text>
    </View>
  );
}

type EducationSummaryModalProps = {
  data: SummaryModalData | null;
  onClose: () => void;
  onSelectCourse: (
    course: EducationCourse
  ) => void;
};

function EducationSummaryModal({
  data,
  onClose,
  onSelectCourse,
}: EducationSummaryModalProps) {
  return (
    <Modal
      visible={Boolean(data)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalBackdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.modalCard}
          onPress={() => undefined}
        >
          {data && (
            <>
              <View style={styles.modalHeader}>
                <View
                  style={styles.modalHeaderText}
                >
                  <Text
                    style={styles.modalEyebrow}
                  >
                    내 교육 현황
                  </Text>

                  <Text style={styles.modalTitle}>
                    {data.label}
                  </Text>

                  <Text
                    style={
                      styles.modalDescription
                    }
                  >
                    {data.description}
                  </Text>
                </View>

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={onClose}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="#5D7088"
                  />
                </Pressable>
              </View>

              <View style={styles.modalCountRow}>
                <Text
                  style={styles.modalCountValue}
                >
                  {data.courses.length}건
                </Text>

                <Text
                  style={styles.modalCountLabel}
                >
                  현재 교육 목록 기준
                </Text>
              </View>

              <ScrollView
                style={styles.modalCourseScroll}
                contentContainerStyle={
                  styles.modalCourseContent
                }
                showsVerticalScrollIndicator={
                  false
                }
              >
                {data.courses.map((course) => (
                  <Pressable
                    key={course.id}
                    style={({ pressed }) => [
                      styles.modalCourseItem,
                      pressed &&
                        styles.pressablePressed,
                    ]}
                    onPress={() =>
                      onSelectCourse(course)
                    }
                  >
                    <View
                      style={
                        styles.modalCourseText
                      }
                    >
                      <Text
                        style={
                          styles.modalCourseTitle
                        }
                        numberOfLines={1}
                      >
                        {course.title}
                      </Text>

                      <Text
                        style={
                          styles.modalCourseMeta
                        }
                        numberOfLines={1}
                      >
                        {course.role} · 마감{" "}
                        {course.deadline}
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.modalCourseProgress
                      }
                    >
                      {course.progress}%
                    </Text>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#8FA0B4"
                    />
                  </Pressable>
                ))}

                {!data.courses.length && (
                  <View
                    style={
                      styles.modalEmptyState
                    }
                  >
                    <Ionicons
                      name="file-tray-outline"
                      size={33}
                      color="#9AABBD"
                    />

                    <Text
                      style={
                        styles.modalEmptyText
                      }
                    >
                      해당하는 교육이 없습니다.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function calculateCompletionRate(
  targetCourses: EducationCourse[]
) {
  if (!targetCourses.length) return 0;

  const completedCount =
    targetCourses.filter(
      (course) =>
        course.progress >= 100 ||
        course.status === "이수" ||
        course.status === "완료"
    ).length;

  return Math.round(
    (completedCount / targetCourses.length) *
      100
  );
}