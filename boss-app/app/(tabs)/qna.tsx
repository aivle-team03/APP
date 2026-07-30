import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/qnaStyles";

type MessageType = "bot" | "user";

type Message = {
  id: string;
  type: MessageType;
  text: string;
  time: string;
};

const API_BASE_URL = "http://172.20.10.3:8000";

const DEFAULT_RECOMMENDED_QUESTIONS = [
  "소화기 점검 기준을 알려주세요.",
  "비상구 앞 적치물은 어떻게 조치해야 하나요?",
  "방화문은 항상 닫혀 있어야 하나요?",
  "지게차 작업 시 안전수칙을 알려주세요.",
];

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "오후" : "오전";
  const displayHour = hours % 12 || 12;

  return `${meridiem} ${displayHour}:${minutes}`;
}

function createInitialMessage(): Message {
  return {
    id: "initial-message",
    type: "bot",
    text: "안녕하세요. AI 소방안전관리 비서입니다.\n시설물 안전 및 관련 법규에 대해 궁금한 점을 질문해 주세요.",
    time: getCurrentTime(),
  };
}

export default function ChatbotScreen() {
  const listRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>([
    createInitialMessage(),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] =
    useState<string[]>(DEFAULT_RECOMMENDED_QUESTIONS);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    });
  }, [messages, isTyping]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chatbot/recommendations`
      );

      if (!response.ok) {
        throw new Error("추천 질문 응답 오류");
      }

      const data = await response.json();

      if (Array.isArray(data.questions)) {
        setRecommendedQuestions(data.questions);
      }
    } catch (error) {
      console.error("추천 질문 로딩 실패:", error);
    }
  };

  const sendMessage = async (textToSend: string) => {
    const trimmedText = textToSend.trim();

    if (!trimmedText || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: trimmedText,
      time: getCurrentTime(),
    };

    const previousMessages = messages;

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);
    setInputValue("");
    setIsTyping(true);

    const historyPayload = previousMessages
      .filter((message) => message.id !== "initial-message")
      .map(
        (message) =>
          `${message.type === "user" ? "사용자" : "챗봇"}: ${
            message.text
          }`
      );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chatbot/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_text: trimmedText,
            history: historyPayload,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("챗봇 API 응답 오류");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text:
          data.answer ??
          "답변을 불러오지 못했습니다. 다시 질문해 주세요.",
        time: getCurrentTime(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error("챗봇 질의 실패:", error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "bot",
        text: "서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
        time: getCurrentTime(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.type === "bot";

    return (
      <View
        style={[
          styles.messageRow,
          isBot ? styles.botRow : styles.userRow,
        ]}
      >
        {isBot && (
          <View style={styles.botAvatar}>
            <Ionicons
              name="sparkles-outline"
              size={17}
              color="#ffffff"
            />
          </View>
        )}

        <View
          style={[
            styles.bubbleWrap,
            !isBot && styles.userBubbleWrap,
          ]}
        >
          <View
            style={[
              styles.chatBubble,
              isBot ? styles.botBubble : styles.userBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                !isBot && styles.userMessageText,
              ]}
            >
              {item.text}
            </Text>
          </View>

          <Text
            style={[
              styles.messageTime,
              !isBot && styles.userMessageTime,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="sparkles-outline"
                size={22}
                color="#ffffff"
              />
            </View>

            <View style={styles.headerTextArea}>
              <Text style={styles.headerTitle}>
                소방안전 법규 Q&A 비서
              </Text>

              <Text style={styles.headerDescription}>
                시설물 안전과 관련 법규를 질문해 주세요.
              </Text>
            </View>
          </View>

          <View style={styles.recommendSection}>
            <Text style={styles.recommendTitle}>
              추천 질문
            </Text>

            <Text style={styles.recommendDescription}>
              자주 확인하는 법규와 안전관리 기준입니다.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendList}
            >
              {recommendedQuestions.map((question) => (
                <Pressable
                  key={question}
                  style={({ pressed }) => [
                    styles.recommendButton,
                    pressed && styles.recommendButtonPressed,
                  ]}
                  onPress={() => sendMessage(question)}
                  disabled={isTyping}
                >
                  <Text style={styles.recommendButtonText}>
                    {question}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isTyping ? (
                <View style={styles.messageRow}>
                  <View style={styles.botAvatar}>
                    <Ionicons
                      name="sparkles-outline"
                      size={17}
                      color="#ffffff"
                    />
                  </View>

                  <View style={styles.typingBubble}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              ) : null
            }
          />

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="소방 법규 및 안전 수칙을 질문하세요."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={1000}
              returnKeyType="send"
              blurOnSubmit
              onSubmitEditing={() => sendMessage(inputValue)}
            />

            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
                (!inputValue.trim() || isTyping) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <Ionicons
                name="send"
                size={19}
                color="#ffffff"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}