import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

type FocusedInput = "userId" | "password" | null;

/**
 * 실행 환경에 맞게 주소 변경
 *
 * iOS 시뮬레이터:
 * http://127.0.0.1:8000
 *
 * Android 에뮬레이터:
 * http://10.0.2.2:8000
 *
 * 실제 휴대폰 Expo Go:
 * http://노트북의_와이파이_IP:8000
 * 예: http://192.168.0.15:8000
 */
const API_BASE_URL = "http://172.16.0.75:8000";

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [focusedInput, setFocusedInput] =
    useState<FocusedInput>(null);

  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const trimmedUserId = userId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUserId || !trimmedPassword) {
      Alert.alert(
        "입력 확인",
        "아이디와 비밀번호를 모두 입력해주세요."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: trimmedUserId,
            password: trimmedPassword,
          }),
        }
      );

      let data: {
        access_token?: string;
        detail?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("서버 응답을 해석할 수 없습니다.");
      }

      if (!response.ok) {
        Alert.alert(
          "로그인 실패",
          data.detail ||
            "아이디 또는 비밀번호가 일치하지 않습니다."
        );
        return;
      }

      if (!data.access_token) {
        Alert.alert(
          "로그인 실패",
          "서버 응답에 인증 토큰이 없습니다."
        );
        return;
      }

      await SecureStore.setItemAsync(
        "accessToken",
        data.access_token
      );

      await SecureStore.setItemAsync(
        "isLoggedIn",
        "true"
      );

      router.replace("/(tabs)/checklist");
    } catch (error) {
      console.error("로그인 요청 오류:", error);

      Alert.alert(
        "서버 연결 실패",
        "백엔드 서버와 통신할 수 없습니다.\n서버 주소와 실행 상태를 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.backgroundCircleTop} />
        <View style={styles.backgroundCircleBottom} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logoArea}>
              <Image
                source={require("../../assets/images/boss-logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text style={styles.title}>
                안전한 현장 관리의 시작
              </Text>

              <Text style={styles.description}>
                AI 기반 시설 안전관리 서비스
              </Text>
            </View>

            <View style={styles.loginCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEyebrow}>
                  BOSS SAFETY MANAGEMENT
                </Text>

                <Text style={styles.cardTitle}>
                  로그인
                </Text>

                <Text style={styles.cardDescription}>
                  관리자 계정으로 로그인해주세요.
                </Text>
              </View>

              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>
                    아이디
                  </Text>

                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "userId" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={
                        focusedInput === "userId"
                          ? colors.primary
                          : "#8194AD"
                      }
                    />

                    <TextInput
                      style={styles.input}
                      value={userId}
                      onChangeText={setUserId}
                      placeholder="아이디를 입력해주세요"
                      placeholderTextColor="#9AAAC0"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="username"
                      textContentType="username"
                      returnKeyType="next"
                      editable={!isLoading}
                      onFocus={() =>
                        setFocusedInput("userId")
                      }
                      onBlur={() =>
                        setFocusedInput(null)
                      }
                      onSubmitEditing={() => {
                        passwordInputRef.current?.focus();
                      }}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>
                    비밀번호
                  </Text>

                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "password" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={
                        focusedInput === "password"
                          ? colors.primary
                          : "#8194AD"
                      }
                    />

                    <TextInput
                      ref={passwordInputRef}
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="비밀번호를 입력해주세요"
                      placeholderTextColor="#9AAAC0"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
                      returnKeyType="done"
                      editable={!isLoading}
                      onFocus={() =>
                        setFocusedInput("password")
                      }
                      onBlur={() =>
                        setFocusedInput(null)
                      }
                      onSubmitEditing={handleLogin}
                    />
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.loginButton,
                    pressed &&
                      !isLoading &&
                      styles.loginButtonPressed,
                    isLoading &&
                      styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text style={styles.loginButtonText}>
                        로그인 중...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>
                        로그인
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={19}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </Pressable>

                <View style={styles.findButtonContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.findButton,
                      pressed &&
                        styles.findButtonPressed,
                    ]}
                    disabled={isLoading}
                    onPress={() => {
                      Alert.alert(
                        "아이디 찾기",
                        "아이디 찾기 화면을 연결해주세요."
                      );
                    }}
                  >
                    <Text style={styles.findButtonText}>
                      아이디 찾기
                    </Text>
                  </Pressable>

                  <View style={styles.dividerDot} />

                  <Pressable
                    style={({ pressed }) => [
                      styles.findButton,
                      pressed &&
                        styles.findButtonPressed,
                    ]}
                    disabled={isLoading}
                    onPress={() => {
                      Alert.alert(
                        "비밀번호 찾기",
                        "비밀번호 재설정 화면을 연결해주세요."
                      );
                    }}
                  >
                    <Text style={styles.findButtonText}>
                      비밀번호 찾기
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.footer}>
            안전한 현장 관리를 BOSS와 함께 시작하세요.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const colors = {
  background: "#F3F7FC",
  lightBlue: "#DDEBFC",
  sidebarBlue: "#C9DDFC",
  primary: "#3478D4",
  primaryDark: "#245EAD",
  navy: "#173255",
  text: "#243B5A",
  muted: "#7187A4",
  border: "#D9E4F1",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    overflow: "hidden",
  },

  backgroundCircleTop: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.lightBlue,
    opacity: 0.75,
  },

  backgroundCircleBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.sidebarBlue,
    opacity: 0.45,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },

  content: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoImage: {
    width: 170,
    height: 72,
    marginBottom: 20,
  },

  title: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  loginCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#E5EDF7",
    shadowColor: "#54749C",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 6,
  },

  cardHeader: {
    marginBottom: 26,
  },

  cardEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  cardTitle: {
    color: colors.navy,
    fontSize: 27,
    fontWeight: "800",
  },

  cardDescription: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 7,
  },

  form: {
    gap: 18,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBFDFF",
  },

  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 2,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 11,
    color: colors.navy,
    fontSize: 15,
  },

  loginButton: {
    height: 56,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.primary,
    marginTop: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.24,
    shadowRadius: 11,
    elevation: 4,
  },

  loginButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  loginButtonDisabled: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  findButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  findButton: {
    paddingHorizontal: 4,
    paddingVertical: 5,
  },

  findButtonPressed: {
    opacity: 0.55,
  },

  findButtonText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500",
  },

  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#B5C1D1",
    marginHorizontal: 10,
  },

  footer: {
    color: "#8194AD",
    fontSize: 12,
    textAlign: "center",
    paddingTop: 24,
    paddingBottom: 18,
  },
});