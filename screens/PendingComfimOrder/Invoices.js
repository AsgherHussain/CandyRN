import React, { useCallback, useContext, useState } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Header } from "../../components"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import AppContext from "../../store/Context"
import { useFocusEffect } from "@react-navigation/native"
import i18n from "../../i18n"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getInvoices } from "../../api/admin"
import { ActivityIndicator } from "react-native"
export default function Invoices({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {} = context
  const [state, setState] = useState({
    loading: false,
    active: 0,
    page: 0,
    limit: 50,
    isRefreshing: false,
    allInvoices: []
  })

  const { loading, allInvoices, page, limit, isRefreshing } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getInvoices()
    }, [])
  )

  const _getInvoices = async resetPage => {
    try {
      handleChange("loading", true)
      const payload = `?l=${limit}&o=${resetPage ? 0 : page}`
      const token = await AsyncStorage.getItem("token")
      const res = await getInvoices(payload, token)
      handleChange(
        "allInvoices",
        resetPage ? res?.data : [...allInvoices, ...res?.data]
      )
      handleChange("page", resetPage ? 0 + limit : page + limit)
      handleChange("isRefreshing", false)
      handleChange("loading", false)
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const onScrollHandler = () => {
    _getInvoices()
  }

  const onRefresh = () => {
    _getInvoices(true)
  }

  return (
    <View style={styles.container}>
      <Header
        title={i18n.t("Invoices")}
        back
        rightEmpty
        color={COLORS.darkBlack}
      />
      {loading && <ActivityIndicator size={"small"} color={COLORS.primary} />}
      <FlatList
        data={allInvoices}
        showsVerticalScrollIndicator={false}
        onEndReached={onScrollHandler}
        onEndReachedThreshold={0}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        style={{ width: "90%", marginTop: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("InvoicePage", { data: item })}
            style={{
              width: "100%",
              alignItems: "flex-start",
              height: 40,
              marginBottom: 10,
              borderWidth: 1,
              justifyContent: "center",
              paddingLeft: 15
            }}
          >
            <Text>
              {item?.user?.name} #{item?.sid}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    backgroundColor: COLORS.white,
    alignItems: "center"
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  flexEnd: {
    alignItems: "flex-end",
    width: "100%"
  },
  mainBody: {
    width: "90%",
    marginBottom: 20,
    height: "80%"
  },
  dateText: {
    fontFamily: FONT1SEMIBOLD,
    textAlign: "center",
    marginTop: -10,
    color: COLORS.darkBlack,
    fontSize: hp(2)
  },
  text: {
    fontFamily: FONT1REGULAR,
    color: COLORS.darkBlack,
    fontSize: hp(2.2)
  },
  link: {
    fontFamily: FONT1REGULAR,
    color: COLORS.link,
    fontSize: hp(2.2)
  },
  text1: {
    fontFamily: FONT1SEMIBOLD,
    color: COLORS.darkBlack,
    fontSize: hp(2.2)
  },
  productContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 50
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  tabText: {
    color: COLORS.grey,
    fontSize: hp(3),
    marginBottom: 10,
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  line: {
    width: "100%",
    backgroundColor: COLORS.grey,
    height: 5
  },
  activeline: {
    width: "100%",
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  image: {
    width: "40%",
    marginRight: 10
  },
  rowBetween: {
    width: "50%",
    justifyContent: "space-between"
  },
  styleText: {
    color: COLORS.black,
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  price: {
    fontSize: hp(2.5),
    fontFamily: FONT1REGULAR,
    color: COLORS.black
  },
  quantity: {
    color: COLORS.black,
    fontSize: hp(2.5),
    fontFamily: FONT1REGULAR
  },
  total: {
    color: COLORS.totalprice,
    fontSize: hp(2.5),
    fontFamily: FONT1BOLD
  },
  hline: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.primary
  },
  styleDiv: {
    flexDirection: "row",
    alignItems: "center"
  }
})
