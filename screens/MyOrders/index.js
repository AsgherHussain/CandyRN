import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Header } from "../../components"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD, FONT2MEDIUM } from "../../constants"
import AppContext from "../../store/Context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-simple-toast"
import { sendInvoice } from "../../api/admin"
import ProductImage from "../../assets/images/product.png"
import deleteIcon from "../../assets/svg/delete.svg"
import { useFocusEffect } from "@react-navigation/native"
import i18n from "../../i18n"
import { deleteOrder, getMyOrders, getMyOrdersTotal } from "../../api/customer"
import { SvgXml } from "react-native-svg"

export default function UserOrders({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const { user } = context
  const [state, setState] = useState({
    loading: false,
    adminProductsLoadingActive: false,
    adminProductsLoadingHistory: false,
    adminProductsLoadingHalf: false,
    myOrders: [],
    myOrdersCompleted: [],
    halfOrders: [],
    isRefreshing: false,
    loadingDelete: false,
    page: 0,
    pageHalfOrders: 0,
    pageMyOrdersCompleted: 0,
    limit: 50,
    active: 0,
    halftotal: 0,
    completedtotal: 0,
    activetotal: 0,
  })
  const {
    loading,
    active,
    isRefreshing,
    adminProductsLoadingActive,
    adminProductsLoadingHistory,
    adminProductsLoadingHalf,
    myOrders,
    myOrdersCompleted,
    page,
    pageHalfOrders,
    pageMyOrdersCompleted,
    limit,
    halfOrders,
    loadingDelete,
    halftotal,
    completedtotal,
    activetotal,
  } = state
  useFocusEffect(
    useCallback(() => {
      getData()
    }, [])
  )

  const getData = resetPage => {
    const payload = `?l=${limit}&o=${resetPage ? 0 : page
      }&status=Pending,Processing,Confirmed&user=${user?.id}`
    const payload2 = `?l=${limit}&o=${resetPage ? 0 : pageHalfOrders
      }&status=Unmatched&user=${user?.id}&half_pack=True`
    const payload1 = `?l=${limit}&o=${resetPage ? 0 : pageMyOrdersCompleted
      }&status=Completed&user=${user?.id}`
    const payloadTotalUnmatched = `?status=Unmatched&user=${user?.id}`

    // console.warn("payload", payload)
    _getUserOrdersActive(payload, resetPage)
    _getUserOrdersHistory(payload1, resetPage)
    _getUserOrdersHalf(payload2, resetPage, payloadTotalUnmatched)
  }

  const _getUserOrdersActive = async (payload, resetPage) => {
    try {
      if (resetPage) {
        handleChange("myOrders", [])
      }
      handleChange("adminProductsLoadingActive", true)
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getMyOrders(body, token)
      const resTotal = await getMyOrdersTotal(body, token)
      handleChange(
        "activetotal",
        resTotal?.data?.total
      )
      handleChange(
        "myOrders",
        resetPage ? res?.data : [...myOrders, ...res?.data]
      )
      handleChange("page", resetPage ? 0 + limit : page + limit)
      handleChange("isRefreshing", false)
      handleChange("adminProductsLoadingActive", false)
    } catch (error) {
      handleChange("adminProductsLoadingActive", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }
  const _getUserOrdersHistory = async (payload, resetPage) => {
    try {
      if (resetPage) {
        handleChange("myOrdersCompleted", [])
      }
      handleChange("adminProductsLoadingHistory", true)
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getMyOrders(body, token)
      const resTotal = await getMyOrdersTotal(body, token)
      handleChange(
        "completedtotal",
        resTotal?.data?.total
      )
      handleChange(
        "myOrdersCompleted",
        resetPage ? res?.data : [...myOrdersCompleted, ...res?.data]
      )
      handleChange("pageMyOrdersCompleted", resetPage ? 0 + limit : pageMyOrdersCompleted + limit)
      handleChange("isRefreshing", false)
      handleChange("adminProductsLoadingHistory", false)
    } catch (error) {
      handleChange("adminProductsLoadingHistory", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }
  const _getUserOrdersHalf = async (payload, resetPage, payloadTotalUnmatched) => {
    try {
      if (resetPage) {
        handleChange("halfOrders", [])
      }
      handleChange("adminProductsLoadingHalf", true)
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getMyOrders(body, token)
      const resTotal = await getMyOrdersTotal(payloadTotalUnmatched, token)
      handleChange(
        "halftotal",
        resTotal?.data?.total
      )
      handleChange(
        "halfOrders",
        resetPage ? res?.data : [...halfOrders, ...res?.data]
      )
      handleChange("pageHalfOrders", resetPage ? 0 + limit : pageHalfOrders + limit)
      handleChange("isRefreshing", false)
      handleChange("adminProductsLoadingHalf", false)
    } catch (error) {
      handleChange("adminProductsLoadingHalf", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const onScrollHandler = () => {
    getData()
  }

  const onRefresh = () => {
    getData(true)
  }

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _confirmOrder = async () => {
    try {
      handleChange("loadingConfirm", true)
      const token = await AsyncStorage.getItem("token")
      const payload = `?id=${id.toString()}`
      await sendInvoice(payload, token)
      navigation.navigate("PendingComfimOrder")
      handleChange("ids", [])
      handleChange("loadingConfirm", false)
      Toast.show(i18n.t(`Order has been confirmed!`))
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("loadingConfirm", false)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const _deleteOrder = async (id) => {
    try {
      handleChange("adminProductsLoading", true)
      handleChange("loadingDelete", true)
      const token = await AsyncStorage.getItem("token")
      const payload = `?order=${id}`
      await deleteOrder(payload, token)
      onRefresh()
      handleChange("loadingDelete", false)
      Toast.show(i18n.t(`Order has been canceled!`))
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("loadingDelete", false)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const totalAmount = () => {
    if (active === 0) {
      return activetotal
    } else if (active === 1) {
      return completedtotal
    } else {
      return halftotal
    }
    const list =
      active === 2 ? halfOrders : active === 0 ? myOrders : myOrdersCompleted
    let total = 0
    list?.forEach(element => {
      if (element?.total && element?.status !== 'Cancelled') {
        total = total + Number(element?.total)
      }
    })
    return total.toFixed(2)
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={"large"} />
      </View>
    )
  }

  const sortByDate = array => {
    return array?.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date)
    })
  }

  const sortByDate1 = array => {
    return array?.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date)
    })
  }

  const sortByStatus = array => {
    return array?.sort((a, b) => {
      return b.status < a.status ? -1 : 1
    })
  }

  return (
    <View style={styles.container}>
      <Header back titleCap title={user?.name} rightEmpty />
      <View style={styles.mainBody}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 0)}
          >
            <View style={styles.row}>
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Active")}
              </Text>
            </View>
            <View style={active === 0 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 1)}
          >
            <View style={styles.row}>
              <Text
                style={active === 1 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("History")}
              </Text>
            </View>
            <View style={active === 1 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 2)}
          >
            <View style={styles.row}>
              <Text
                style={active === 2 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t("Pending Half Packs")}
              </Text>
            </View>
            <View style={active === 2 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>
        {(active === 0 ? adminProductsLoadingActive : active === 1 ? adminProductsLoadingHistory : adminProductsLoadingHalf) && (
          <ActivityIndicator size={"small"} color={COLORS.primary} />
        )}
        <FlatList
          data={
            active === 2
              ? sortByStatus(sortByDate(halfOrders))
              : active === 0
                ? sortByDate(myOrders)
                : sortByDate1(myOrdersCompleted)
          }
          key={"_"}
          scrollEnabled
          onEndReached={onScrollHandler}
          onEndReachedThreshold={0}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <Text style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}>
                {(active === 0 ? adminProductsLoadingActive : active === 1 ? adminProductsLoadingHistory : adminProductsLoadingHalf) ? '' : i18n.t("No List")}
              </Text>
            )
          }}
          keyExtractor={item => "_" + item?.id}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={active === 1 ? 0 : 1}
                onPress={() =>
                  active === 1
                    ? navigation.navigate("CustomerInvoice", { data: item })
                    : console.log()
                }
                key={index}
                style={[styles.container1]}
              >
                <Image
                  source={
                    item?.product?.photos?.length > 0
                      ? { uri: item?.product?.photos[0]?.image }
                      : ProductImage
                  }
                  style={[styles.image, { minHeight: 200 }]}
                />
                <View style={styles.rowBetween}>
                  <Text style={styles.price}>
                    {i18n.t("Product")}: {item?.product?.sid}
                  </Text>
                  <Text style={styles.price}>
                    {i18n.t("Size")}: {item?.product?.size_variance}
                  </Text>
                  <View style={styles.styleDiv}>
                    <Text style={styles.price}>{i18n.t("Color")}</Text>
                    {/* {item?.styles?.map((style, index) => ( */}
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        backgroundColor: item?.style?.toLowerCase(),
                        borderWidth: 1,
                        borderColor: COLORS.black,
                        borderRadius: 20
                      }}
                    />
                    {/* ))} */}
                  </View>
                  <Text style={styles.total}>
                    {i18n.t("Price")}: ${item?.product?.per_item_price}
                  </Text>
                  <Text
                    style={[
                      styles.quantity,
                      {
                        fontFamily: FONT1BOLD,
                        color:
                          item?.status === "Cancelled" ? COLORS.darkRed :
                            (active === 2 || active === 0)
                              ? COLORS.pending
                              : COLORS.completed
                      }
                    ]}
                  >
                    {active === 2
                      ? item?.status === 'Unmatched' ? i18n.t("Unmatched") : i18n.t("Canceled")
                      : active === 0
                        ? i18n.t("Pending")
                        : i18n.t("Completed")
                    }
                  </Text>
                  {/* <Text style={styles.quantity}>Packs: {1}</Text> */}
                  <Text style={styles.quantity}>
                    {i18n.t("order Qty")}: {item?.quantity}
                  </Text>
                  <Text style={styles.quantity}>
                    {i18n.t("Total Amount")}: ${item?.total}
                  </Text>
                  {
                    active === 2 && item?.status === 'Unmatched' &&
                    <TouchableOpacity disabled={loadingDelete} onPress={() => _deleteOrder(item?.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.quantity, { fontSize: hp(1.8), fontFamily: FONT2MEDIUM, marginRight: 10 }]}>{i18n.t("Cancel")}</Text>
                      <SvgXml xml={deleteIcon} />
                    </TouchableOpacity>
                  }
                </View>
              </TouchableOpacity>
            )
          }}
        />
        {/* {active === 0 && (
          <View style={{ width: '90%' }}>
          <AppButton title={'Generate Invoice'} />
          </View>
        )} */}
        <View style={styles.hline} />
        <Text
          style={[
            styles.total,
            { textAlign: "right", width: "100%", marginTop: 5 }
          ]}
        >
          {i18n.t("Total Amount")}: ${totalAmount()}
        </Text>
      </View>
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
  hline: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.primary,
    marginTop: 10
  },
  activeTabText: {
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },

  tabs: {
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  tab: {
    width: "33%",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  tabText: {
    color: COLORS.grey,
    fontSize: hp(1.6),
    marginBottom: 10,
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
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
  container1: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
    minHeight: 250,
    flex: 1
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
    fontSize: hp(2),
    fontFamily: FONT1REGULAR,
    color: COLORS.black
  },
  quantity: {
    color: COLORS.black,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  total: {
    color: COLORS.totalprice,
    fontSize: hp(2),
    fontFamily: FONT1BOLD
  },
  removeDiv: {
    flexDirection: "row",
    alignItems: "center"
  },
  styleDiv: {
    flexDirection: "row",
    alignItems: "center"
  }
})
