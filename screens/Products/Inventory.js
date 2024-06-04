import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import {
  AppButton,
  AppInput,
  CustomModal,
  FullCalendar,
  Header,
  Product
} from "../../components"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import Square from "../../assets/svg/square.svg"
import Square4 from "../../assets/svg/4square.svg"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import AppContext from "../../store/Context"
import { useFocusEffect } from "@react-navigation/native"
import i18n from "../../i18n"
import { getProducts } from "../../api/customer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getPayload } from "../../utils/ValidateEmail"
import { ScrollView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

function Inventory({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { categories, brands } = context
  const [state, setState] = useState({
    active: 1,
    filterOpen: false,
    halfPack: false,
    isRefreshing: false,
    productLoading: false,
    page: 0,
    limit: 50,
    category: [],
    brand: [],
    products: [],
    date: Date.now(),
    maxPrice: "",
    minPrice: ""
  })

  const {
    active,
    productLoading,
    products,
    filterOpen,
    limit,
    brand,
    category,
    isRefreshing,
    page,
    maxPrice,
    minPrice
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _getProducts = async (payload, resetPage) => {
    try {
      handleChange("productLoading", true)
      const queryParams = payload ? payload : ""
      const token = await AsyncStorage.getItem("token")
      const res = await getProducts(queryParams, token)
      handleChange(
        "products",
        resetPage ? res?.data : [...products, ...res?.data]
      )
      handleChange("page", resetPage ? 0 + limit : page + limit)
      handleChange("isRefreshing", false)
      handleChange("productLoading", false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("productLoading", false)
      alert(`Error: ${errorText[0]}`)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = resetPage => {
    // const payload = `?l=${limit}&o=${
    //   resetPage ? 0 : page
    // }&half_pack_available=false&type=Inventory&category=${category.toString()}&brand=${brand.toString()}`
    const queryParams = {
      l: limit,
      o: resetPage ? 0 : page,
      type: "Inventory",
      category: category.toString(),
      brand: brand.toString(),
      min_price: minPrice,
      max_price: maxPrice,
      half_pack_available: false
    }
    const payload = getPayload(queryParams)
    console.warn("payload", payload)
    _getProducts(payload, resetPage)
  }

  const handleFilter = () => {
    getData()
    handleChange("filterOpen", false)
  }

  const removeFIlter = () => {
    const payload = `?l=${limit}&o=${0}&type=Inventory&half_pack_available=false`
    _getProducts(payload, true)
    handleChange("maxPrice", "")
    handleChange("minPrice", "")
    handleChange("category", [])
    handleChange("brand", [])
    handleChange("filterOpen", false)
  }

  const onScrollHandler = () => {
    getData()
  }

  const onRefresh = () => {
    getData(true)
  }

  const windowSize = products?.length > 50 ? products?.length / 4 : 21

  return (
    <View style={styles.container}>
      <Header
        back
        tab
        titleUpp
        tabText={i18n.t("Inventory")}
        menu
        menuClick={() => {
          handleChange("filterOpen", true)
          handleChange("page", 0)
          handleChange("products", [])
        }}
      />
      <View style={styles.mainBody}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 0)}
          >
            <View style={styles.row}>
              <SvgXml
                xml={Square}
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                1 x 1
              </Text>
            </View>
            <View style={active === 0 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange("active", 1)}
          >
            <View style={styles.row}>
              <SvgXml
                xml={Square4}
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text
                style={active === 1 ? styles.activeTabText : styles.tabText}
              >
                2 x 2
              </Text>
            </View>
            <View style={active === 1 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>
      </View>
      {productLoading && (
        <ActivityIndicator size={"small"} color={COLORS.primary} />
      )}
      <FlatList
        data={products}
        key={active === 0 ? "#" : "_"}
        numColumns={active === 0 ? 1 : 2}
        ListEmptyComponent={() => {
          return (
            <Text
              style={{
                fontFamily: FONT1REGULAR,
                color: COLORS.primary,
                textAlign: "center"
              }}
            >
              {i18n.t("No List")}
            </Text>
          )
        }}
        columnWrapperStyle={
          active === 1 && {
            justifyContent: "space-between",
            marginVertical: 5
          }
        }
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={windowSize}
        windowSize={windowSize}
        style={styles.flatList}
        onEndReached={onScrollHandler}
        onEndReachedThreshold={0}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        keyExtractor={item => "_" + item?.sid}
        renderItem={({ item, index }) => {
          return (
            <Product key={index} item={item} inventory={true} active={active} />
          )
        }}
      />
      <CustomModal
        visible={filterOpen}
        height={"80%"}
        noSwipe
        onClose={() => handleChange("filterOpen", false)}
      >
        <View style={styles.modalView}>
          <KeyboardAwareScrollView
            style={{ width: "100%", marginTop: 20 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: FONT1SEMIBOLD,
                fontSize: hp(2.8),
                marginTop: 10,
                textTransform: "uppercase",
                color: COLORS.primary
              }}
            >
              {i18n.t("Category")}
            </Text>
            <FlatList
              numColumns={2}
              style={{ width: "80%" }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              data={categories}
              renderItem={({ item, inde }) => (
                <BouncyCheckbox
                  size={20}
                  key={inde}
                  fillColor={COLORS.primary}
                  unfillColor={COLORS.white}
                  isChecked={category.includes(item?.id)}
                  text={item?.name}
                  disableBuiltInState
                  iconStyle={{ borderColor: COLORS.black06, borderRadius: 0 }}
                  textStyle={{
                    fontFamily: FONT1SEMIBOLD,
                    fontSize: hp(2.8),
                    color: COLORS.primary,
                    textDecorationLine: "none"
                  }}
                  style={{ marginVertical: 5, width: "50%" }}
                  onPress={() => {
                    if (category.includes(item?.id)) {
                      const removed = category.filter(e => e != item?.id)
                      handleChange("category", removed)
                    } else {
                      handleChange("category", [...category, item?.id])
                    }
                  }}
                />
              )}
            />
            <Text
              style={{
                fontFamily: FONT1SEMIBOLD,
                textTransform: "uppercase",
                fontSize: hp(2.8),
                marginTop: 20,
                color: COLORS.primary
              }}
            >
              {i18n.t("Brands")}
            </Text>
            <FlatList
              numColumns={2}
              style={{ width: "80%" }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              data={brands}
              renderItem={({ item, inde }) => (
                <BouncyCheckbox
                  key={inde}
                  size={20}
                  fillColor={COLORS.primary}
                  unfillColor={COLORS.white}
                  isChecked={brand.includes(item?.id)}
                  text={item?.name}
                  disableBuiltInState
                  iconStyle={{ borderColor: COLORS.black06, borderRadius: 0 }}
                  textStyle={{
                    fontFamily: FONT1SEMIBOLD,
                    fontSize: hp(2.8),
                    color: COLORS.primary,
                    textDecorationLine: "none"
                  }}
                  style={{ marginVertical: 5, width: "50%" }}
                  onPress={() => {
                    if (brand.includes(item?.id)) {
                      const removed = brand.filter(e => e != item?.id)
                      handleChange("brand", removed)
                    } else {
                      handleChange("brand", [...brand, item?.id])
                    }
                  }}
                />
              )}
            />
            <Text
              style={{
                fontFamily: FONT1SEMIBOLD,
                textTransform: "uppercase",
                fontSize: hp(2.8),
                marginTop: 20,
                color: COLORS.primary
              }}
            >
              {i18n.t("Price")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "80%",
                marginBottom: 10,
                marginTop: 10,
                justifyContent: "space-between"
              }}
            >
              <View style={{ width: "45%", alignItems: "center" }}>
                <Text
                  style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}
                >
                  {i18n.t("Min")}
                </Text>
                <AppInput
                  placeholder={"0.0"}
                  borderRadius={1}
                  height={40}
                  onChange={handleChange}
                  value={minPrice}
                  name={"minPrice"}
                  borderWidth={1}
                  prefixBGTransparent
                  keyboardType={"numeric"}
                  returnKeyType={"done"}
                  prefix={
                    <Text style={{ fontFamily: FONT1BOLD, fontSize: 16 }}>
                      $
                    </Text>
                  }
                />
              </View>
              <View style={{ width: "45%", alignItems: "center" }}>
                <Text
                  style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}
                >
                  {i18n.t("Max")}
                </Text>
                <AppInput
                  borderRadius={1}
                  borderWidth={1}
                  onChange={handleChange}
                  value={maxPrice}
                  returnKeyType={"done"}
                  keyboardType={"numeric"}
                  name={"maxPrice"}
                  height={40}
                  placeholder={"0.0"}
                  prefixBGTransparent
                  prefix={
                    <Text style={{ fontFamily: FONT1BOLD, fontSize: 16 }}>
                      $
                    </Text>
                  }
                />
              </View>
            </View>
            {/* <FullCalendar handleChange={handleChange} date={date} /> */}
            <View style={styles.buttonWidth}>
              <AppButton title={i18n.t("APPLY")} onPress={handleFilter} />
              <AppButton
                title={i18n.t("REMOVE FILTER")}
                outlined
                onPress={removeFIlter}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    paddingTop: 10,
    backgroundColor: COLORS.white,
    alignItems: "center"
  },
  mainBody: {
    width: "100%",
    alignItems: "center"
  },
  buttonWidth: {
    width: "80%"
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
  tabs: {
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  tab: {
    width: "50%",
    alignItems: "center"
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
  flatList: {
    width: "90%"
  },
  rowAround: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  modalView: {
    width: "100%",
    height: "96%",
    alignItems: "center",
    justifyContent: "flex-start"
  }
})

export default Inventory
