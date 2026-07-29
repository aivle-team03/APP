import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="checklist">
      <Tabs.Screen
        name="checklist"
        options={{
          title: "체크리스트",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkbox-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="board"
        options={{
          title: "위험 신고",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="warning-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="qna"
        options={{
          title: "AI 챗봇",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}