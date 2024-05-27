import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { theme } from "./colors";

const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveTodos = async (toSave) => {  // toSave는 addTodo 함수를 통해 saveTodos에 전달됨
    try {
      const s = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY, s);  // @는 데이터 키를 구분하고 네임스페이스를 관리하기 위한 관례적인 접두사(뜻x)
    } catch (e) {
      console.log("저장 실패", e);
    }
  }
  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      // console.log('저장된 내용', JSON.parse(s));
      setTodos(JSON.parse(s));
    } catch (e) {
      console.log("저장된 내용 로드 실패", e);
    }
  }
  const addTodo = async () => {
    try {
      if (text === "") {
        return; // text가 비어있으면 아무것도 하지 않음
      }
      //const newTodos = Object.assign({}, todos, { [Date.now()]: { text, work: working } });  // target은 비어있는 오브젝트
      const newTodos = { ...todos, [Date.now()]: { text, working } }; // 위 코드와 같은 코드
      setTodos(newTodos);
      await saveTodos(newTodos);
      setText("");
    } catch (e) {
      console.log("입력 실패", e);
    }
  };

  useEffect(() => {
    loadTodos();  // 컴포넌트가 마운트될 때 실행
  }, []);
  console.log("입력", todos);

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
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
            </View>
          ) : null
        )}
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
