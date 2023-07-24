import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

//const SCREEN_WIDTH  = Dimensions.get("window").width; 는 아래와 같다. es6 문법.
const { width: SCREEN_WIDTH } = Dimensions.get("window");
// console.log(SCREEN_WIDTH);
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync(); //Foreground 는 앱 사용중에만 작동하는것.
    if (!granted) {
      // 유저가 위치를 추적을 허용하였는지 여부 확인 기능.
      setOk(false);
    }
    // 유저 위치 확인하기.
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    // console.log(location[0].city);
    setCity(location[0].city.slice(0, 2));
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const json = await response.json();
    setDays(json.daily);
    console.log(json);
  };
  useEffect(() => {
    getWeather();
  });
  return (
    <View style={styles.container}>
      <StatusBar style="black" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled // 페이지 넘기면 멈춤 효과
        horizontal
        showsHorizontalScrollIndicator={false} //스크롤 바 가리기.
        indicatorStyle={"white"} // 스크롤 바 색상 설정, ios만 적용 (안드로이드는 persistentScrollbar를 써야함 - 상황에 맞춰 골라 쓸 수 있는 법을 익히자)
        contentContainerStyle={styles.weather}
      >
        {days?.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 100 }}
              size="large"
            />
          </View>
        ) : (
          days?.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.dateInfo}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="#dcdde1"
                />
              </View>
              <Text style={styles.nightTemp}>
                Night({parseFloat(day.feels_like.night).toFixed(1)})
              </Text>
              {/* <Text style={styles.description}>{day.weather[0].main}</Text> */}
              <Text style={styles.description}>
                {day.weather[0].description.slice(-2)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#75C2F6",
  },
  city: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#353b48",
    fontSize: 58,
    fontWeight: "600",
    marginTop: 30,
  },
  weather: {
    backgroundColor: "#75C2F6",
  },
  day: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  dateInfo: {
    marginTop: 20,
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 56,
    marginBottom: 0,
    color: "#1D5D9B",
    fontWeight: "800",
  },
  temp: {
    color: "#353b48",
    marginTop: 0,
    fontSize: 138,
    fontWeight: "300",
  },
  nightTemp: {
    color: "#1D5D9B",
    fontSize: 25,
    fontWeight: "800",
    marginTop: -20,
  },
  description: {
    color: "#353b48",
    marginTop: 0,
    fontSize: 50,
    fontWeight: "400",
  },
  tinyText: {
    color: "#273c75",
    fontSize: 25,
    fontWeight: "200",
  },
});

//StyleSheet.create 는 단지 object 로 사용 안해도 구동되지만, 자동완성 기능을 지원해주기에 사용한다. (인라인으로 css 작성도 가능하다.)
// parseFloat 객체 (오브젝트)에서 밸류값 가져올때 사용.
// toFixed(숫자) 숫자만큼 소수점 보여주기 .(소수점 자리수가 많을때 생략시 사용)
