import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>hello native - hojncode!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    color: "#40739e",
  },
});

//StyleSheet.create 는 단지 object 로 사용 안해도 구동되지만, 자동완성 기능을 지원해주기에 사용한다. (인라인으로 css 작성도 가능하다.)
