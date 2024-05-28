import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { theme } from "./colors";

const STORAGE_KEY = "@todos";

// 로딩할 때 indicator 표시
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
      await saveTodos(newTodos);  // 휴대폰의 디스크(저장공간?)에 접근하는 것이기 때문에 await를 해주는게 좋음
      setText("");
    } catch (e) {
      console.log("입력 실패", e);
    }
  };

  useEffect(() => {
    loadTodos();  // 컴포넌트가 마운트될 때 실행
  }, []);
  console.log("입력", todos);

  const deleteTodo = (key) => {
    Alert.alert("삭제", "삭제할까요?", [
      { text: "취소" }, {
        text: "삭제", onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);  // await 해도 되고 안해도 됨. await는 안하면 화면에서 빨리 삭제하고 나중에 상태 저장하는 것
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.gray }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={18} color={theme.todoBg} />
              </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
