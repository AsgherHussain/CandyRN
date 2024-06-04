import React, {
  useCallback,
  useRef,
  useContext,
  useState,
  useEffect
} from "react"
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Image
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AdminOrders, Header } from "../../components"
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import AppContext from "../../store/Context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-simple-toast"
import {
  deleteProduct,
  getAdminConfirmOrders,
  getAdminOrders,
  getReservedHp,
  getReservedg
} from "../../api/admin"
import { useFocusEffect, useIsFocused } from "@react-navigation/native"
import i18n from "../../i18n"
import { ImageViews } from "../../components"
import BottomIcon from "../../assets/svg/bottom.svg"
import { SvgXml } from "react-native-svg"
import { Icon } from "react-native-elements"
import moment from 'moment';
import MonthPicker from "react-native-month-picker";


export default function PendingComfimOrder({ navigation, route }) {
  const pageProcessRoute = route?.params?.pageProcess
  const flatListRef = useRef()
  // Context
  const context = useContext(AppContext)
  const {
    adminProductsLoading
    // adminOrders,
    // adminOrdersHalf,
    // adminOrdersProcessing,
    // _getAdminProducts,
    // _getAdminOrders,
    // _getAdminOrdersProcess
  } = context
  const [state, setState] = useState({
    loading: false,
    active: 4,
    isRefreshing: false,
    page: 0,
    pageHalf: 0,
    pageConfirm: 0,
    pageProcess: 0,
    limit: 50,
    adminOrdersConfirm: [],
    adminOrdersHalf: [],
    adminOrders: [],
    adminOrdersProcessing: [],
    adminOrdersConfirmLoading: false,
    adminOrdersHalfLoading: false,
    adminOrdersLoading: false,
    adminOrdersProcessingLoading: false,
    isImageViewVisible: false,
    adminOrdersProcessingEnd: false,
    images: []
  })
  const {
    loading,
    active,
    isRefreshing,
    limit,
    page,
    pageHalf,
    pageConfirm,
    pageProcess,
    adminOrdersConfirm,
    adminOrdersHalf,
    adminOrders,
    adminOrdersProcessing,
    adminOrdersConfirmLoading,
    adminOrdersHalfLoading,
    adminOrdersLoading,
    adminOrdersProcessingLoading,
    isImageViewVisible,
    images,
    adminOrdersProcessingEnd
  } = state
  // useFocusEffect(
  //   useCallback(() => {
  //     // _getAdminOrders("")
  //     // _getAdminOrdersProcess()
  //     getData(false, false)
  //     // _getAdminOrders("?half_pack=True", true)
  //   }, [])
  // )

  // useEffect(() => {
  //   if (pageProcessRoute) {
  //     getData(false, true)
  //   }
  // }, [pageProcessRoute])

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      getData()
      getReservedG()
      getReservedHP()
    }
  }, [isFocused])

  const getData = (resetPage, dateString, reset) => {
    if (
      active === 0
        ? !adminOrdersHalfLoading
        : active === 1
        ? !adminOrdersLoading
        : active === 2
        ? !adminOrdersConfirmLoading
        : !adminOrdersProcessingLoading
    ) {
      const month = reset ? "" : dateString ? dateString : selectedMonth ? selectedMonth : ""
      const payload = `?l=${limit}&o=${resetPage ? 0 : pageConfirm}`
      const payload1 = `?l=${limit}&o=${resetPage ? 0 : page}${month}`
      const payload2 = `?l=${limit}&o=${
        resetPage ? 0 : pageHalf
      }&half_pack=True${month}`
      let payload3 = ""
      payload3 = `?l=${limit}&o=${resetPage ? 0 : pageProcess}&processing=True${month}`
      _getAdminConfirmOrders(payload, resetPage)
      _getAdminOrders(payload1, resetPage)
      _getAdminOrders(payload2, resetPage, true)
      _getAdminOrdersProcess(payload3, resetPage)
    }
  }

  const onScrollHandler = (data) => {
        if (!adminOrdersProcessingEnd) {
      getData(false)
    }
  }

  const onRefresh = () => {
    getData(true)
  }

  const _getAdminOrdersProcess = async (payload, resetPage) => {
        try {
      if (resetPage) {
        handleChange("adminOrdersProcessingEnd", false)
      }
      handleChange("adminOrdersProcessingLoading", true)
      const token = await AsyncStorage.getItem("token")
      const body = "?processing=True"
      // console.warn("payload", payload)
      const res = await getAdminOrders(payload, token)
            handleChange(
        "adminOrdersProcessing",
        resetPage ? res?.data : [...adminOrdersProcessing, ...res?.data]
      )
      handleChange("pageProcess", resetPage ? 0 + limit : pageProcess + limit)
      handleChange("adminOrdersProcessingLoading", false)
      handleChange("isRefreshing", false)
    } catch (error) {
      handleChange("adminOrdersProcessingLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminOrders = async (payload, resetPage, half_pack) => {
        try {
      handleChange(
        half_pack ? "adminOrdersHalfLoading" : "adminOrdersLoading",
        true
      )
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getAdminOrders(body, token)
                  if (half_pack) {
        handleChange(
          "adminOrdersHalf",
          resetPage ? res?.data : [...adminOrdersHalf, ...res?.data]
        )
        handleChange("pageHalf", resetPage ? 0 + limit : pageHalf + limit)
      } else {
        handleChange(
          "adminOrders",
          resetPage ? res?.data : [...adminOrders, ...res?.data]
        )
        handleChange("page", resetPage ? 0 + limit : page + limit)
      }
      handleChange(
        half_pack ? "adminOrdersHalfLoading" : "adminOrdersLoading",
        false
      )
      handleChange("isRefreshing", false)
    } catch (error) {
      handleChange(
        half_pack ? "adminOrdersHalfLoading" : "adminOrdersLoading",
        false
      )
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminConfirmOrders = async (payload, resetPage) => {
        try {
      handleChange("adminOrdersConfirmLoading", true)
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getAdminConfirmOrders(body, token)
            handleChange(
        "adminOrdersConfirm",
        resetPage ? res?.data : [...adminOrdersConfirm, ...res?.data]
      )
      handleChange("pageConfirm", resetPage ? 0 + limit : pageConfirm + limit)
      handleChange("adminOrdersConfirmLoading", false)
      handleChange("isRefreshing", false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("adminOrdersConfirmLoading", false)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const showImage = ({ images, id, price, style }) => {
    const list = []
    images?.map(item => {
      list.push({ uri: item?.image, id, price, style })
    })
    handleChange("images", list)
    handleChange("isImageViewVisible", true)
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={"large"} />
      </View>
    )
  }

  const [reservedHP, setReservedHP] = useState([])
  const [reservedG, setReservedG] = useState([])

  const getReservedHP = async (dateString) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await getReservedHp(token, dateString)
      setReservedHP(res.data)
    } catch (error) {
      __DEV__ && console.log("ERROR------------", error)
    }
  }

  const getReservedG = async (dateString) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await getReservedg(token, dateString)
      setReservedG(res.data)
    } catch (error) {
      __DEV__ && console.log("ERROR------------", error)
    }
  }

  const [isOpen, toggleOpen] = useState(false);
  const [value, onChange] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(false)
  const [firingNumber, setFiringNumber] = useState(1)
  const [reverseSorting, setReverseSorting] = useState(false)
  const [callOnScrollEnd, updateCallOnScrollEnd] = useState(false)

  const filterByMonth = (dateString) => {
    getReservedG(dateString)
    getReservedHP(dateString)
    getData(true, dateString)
  }

  const currentData =
    active === 3
      ? adminOrdersProcessing
      : active === 1
      ? adminOrders
      : active === 2
      ? adminOrdersConfirm
      : active === 4
      ? reservedHP
      : active === 5
      ? reservedG
      : adminOrdersHalf  

  return (
    <View style={styles.container}>
      <Header back tabText={i18n.t("Feedback")} rightEmpty />
      <Modal
        transparent
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => {
          toggleOpen(false)
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <MonthPicker
              selectedDate={value || new Date()}
              onMonthChange={onChange}
              yearTextStyle={{ color: "#000000" }}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                toggleOpen(false)
                const dateString = `&month=${moment(value).format("YYYY-MM")}`
                setSelectedMonth(dateString)
                setFiringNumber(firingNumber + 1)
                filterByMonth(dateString)
              }}
            >
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.mainBody}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              handleChange("active", 4)
              getReservedHP()
            }}
          >
            <View style={styles.row}>
              <Text
                style={active === 4 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Reserved HP")}
              </Text>
            </View>
            <View style={active === 4 ? styles.activeline : styles.line} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              handleChange("active", 5)
              getReservedG()
            }}
          >
            <View style={styles.row}>
              <Text
                style={active === 5 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Reserved G")}
              </Text>
            </View>
            <View style={active === 5 ? styles.activeline : styles.line} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 0)}
          >
            <View style={styles.row}>
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("HALF PACKS")}
              </Text>
            </View>
            <View style={active === 0 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 1)}
          >
            <View style={styles.row}>
              <Text
                style={active === 1 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Orders")}
              </Text>
            </View>
            <View style={active === 1 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 3)}
          >
            <View style={styles.row}>
              <Text
                style={active === 3 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Processing")}
              </Text>
            </View>
            <View style={active === 3 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              getData(false)
              handleChange("active", 2)
            }}
          >
            <View style={styles.row}>
              <Text
                style={active === 2 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Confirmed")}
              </Text>
            </View>
            <View style={active === 2 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>

        {/* {active === 2 ? ( */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%"
          }}
        >
          <TouchableOpacity
            onPress={() => toggleOpen(true)}
            style={{
              padding: 10,
              backgroundColor: "#FFF",
              borderWidth: 2,
              borderColor: "#00000",
              borderRadius: 7,
              marginBottom: 15
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontWeight: "500" }}>Filter by date</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setReverseSorting(!reverseSorting)}
            style={{
              padding: 10,
              backgroundColor: "#FFF",
              borderWidth: 2,
              borderColor: "#00000",
              borderRadius: 7,
              marginBottom: 15,
              flexDirection:'row',
              marginLeft:10
            }}
            activeOpacity={0.7}
          >
            <Image source={require("../../assets/images/doubleArrow.png")} style={{width:20, height:20, marginRight:10}} />
            <Text>{reverseSorting ? "Oldest to Latest" : "Latest to Oldest"}</Text>
          </TouchableOpacity>


          {selectedMonth && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setSelectedMonth(false)
                getData(true, null, true)
                getReservedG(null)
                getReservedHP(null)
                setReverseSorting(false)
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  textDecorationLine: "underline",
                  marginBottom: 10,
                  marginLeft: 15
                }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={reverseSorting ? [...currentData].reverse() : currentData}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          onEndReached={() => updateCallOnScrollEnd(true)}
          onMomentumScrollEnd={() => {
            callOnScrollEnd && onScrollHandler()
            updateCallOnScrollEnd(false)
          }}
          scrollEventThrottle={1600}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={() => {
            if (
              active === 0
                ? !adminOrdersHalfLoading
                : active === 1
                ? !adminOrdersLoading
                : active === 2
                ? !adminOrdersConfirmLoading
                : !adminOrdersProcessingLoading
            ) {
              return (
                <Text
                  style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}
                >
                  {i18n.t("No List")}
                </Text>
              )
            } else return null
          }}
          keyExtractor={(item, index) => "_" + item?.sid + index}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => {
            return (
              <AdminOrders
                key={index}
                showImage={showImage}
                item={active === 2 ? item : item}
                fullItem={item}
                pageProcess={adminOrdersProcessing.length}
                active={active}
              />
            )
          }}
          ListFooterComponent={() => {
            if (
              active === 0
                ? adminOrdersHalfLoading
                : active === 1
                ? adminOrdersLoading
                : active === 2
                ? adminOrdersConfirmLoading
                : adminOrdersProcessingLoading
            ) {
              return <ActivityIndicator size={"small"} color={COLORS.primary} />
            } else return null
          }}
        />
        {/* ) : (
          <FlatList
            data={
              active === 3
                ? adminOrdersProcessing
                : active === 1
                ? adminOrders
                : adminOrdersHalf
            }
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            ref={flatListRef}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}
                >
                  {i18n.t("No List")}
                </Text>
              )
            }}
            keyExtractor={(item, index) => "_" + item?.sid + index}
            renderItem={({ item, index }) => {
              return (
                <AdminOrders
                  key={index}
                  showImage={showImage}
                  item={active === 2 ? item : item}
                  fullItem={item}
                  active={active}
                />
              )
            }}
          />
        )} */}
      </View>
      <TouchableOpacity
        onPress={() => {
          getData(true)
          flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
        }}
        style={{
          position: "absolute",
          right: 20,
          borderWidth: 2,
          borderColor: COLORS.primary,
          borderRadius: 100,
          width: 42,
          height: 42,
          bottom: 120,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Icon name="refresh-ccw" type="feather" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
        }
        style={{
          position: "absolute",
          right: 20,
          bottom: 70,
          transform: [{ rotate: "180deg" }]
        }}
      >
        <SvgXml xml={BottomIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => flatListRef?.current?.scrollToEnd({ animating: true })}
        style={{ position: "absolute", right: 20, bottom: 20 }}
      >
        <SvgXml xml={BottomIcon} />
      </TouchableOpacity>
      <ImageViews
        images={images}
        isImageViewVisible={isImageViewVisible}
        handleChange={handleChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: COLORS.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  mainBody: {
    width: "90%",
    height: "90%",
    alignItems: "center"
  },
  tabs: {
    width: "95%",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  tab: {
    width: "33.3%",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  tabText: {
    color: COLORS.grey,
    fontSize: hp(1.5),
    marginBottom: 10,
    textTransform: "uppercase",
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    textTransform: "uppercase",
    fontSize: hp(1.6),
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
  input: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 70,
  },
  confirmButton: {
    borderWidth: 0.5,
    padding: 15,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
