import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { theme } from "./colors";
import { useState } from "react";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addTodo = () => {
    if (text === "") {
      return; // text가 비어있으면 아무것도 하지 않음
    }
    //const newTodos = Object.assign({}, todos, { [Date.now()]: { text, work: working } });  // target은 비어있는 오브젝트
    const newTodos = { ...todos, [Date.now()]: { text, work: { working } } }; // 위 코드와 같은 코드
    setTodos(newTodos);
    setText("");
  };
  console.log(todos);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.gray }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.gray }}>Travel</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "할 일을 추가하세요." : "어디에 가고싶나요?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(todos).map((key) => (
          <View style={styles.todo} key={key}>
            <Text style={styles.todoText}>{todos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // 가로 방향으로 padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 15,
    fontSize: 16,
  },
  todo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  }
});
