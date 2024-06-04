import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView
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
import moment from "moment"
import i18n from "../../i18n"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getProducts } from "../../api/customer"
import { getPayload } from "../../utils/ValidateEmail"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
const _format = "YYYY-MM-DD"
const _today = moment().format(_format)
function Products({ route }) {
  // params

  const halfpack = route?.params?.halfpack
  // Context
  const context = useContext(AppContext)
  const { categories, brands } = context
  const [_markedDates, setMarkedDates] = useState([_today])
  const [selectedDates, setSelectdates] = useState([])
  const [state, setState] = useState({
    active: 1,
    filterOpen: false,
    halfPack: false,
    isRefreshing: false,
    productLoading: false,
    page: 0,
    limit: 50,
    products: [],
    date: Date.now(),
    min_date: "",
    max_date: "",
    category: [],
    brand: [],
    maxPrice: "",
    minPrice: ""
  })

  const {
    active,
    filterOpen,
    min_date,
    max_date,
    date,
    productLoading,
    products,
    isRefreshing,
    page,
    limit,
    category,
    brand,
    maxPrice,
    minPrice
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    getData()
  }, [])

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
      alert(`Errorsss: ${errorText[0]}`)
    }
  }

  const getData = resetPage => {
    // const payload = halfpack
    //   ? `?l=${limit}&o=${
    //       resetPage ? 0 : page
    //     }&half_pack_available=true&min_date=${min_date}&max_date=${max_date}&category=${category.toString()}&brand=${brand.toString()}&min_price=${minPrice}&max_price=${maxPrice}`
    //   : `?l=${limit}&o=${
    //       resetPage ? 0 : page
    //     }&type=Catalog&min_date=${min_date}&max_date=${max_date}&category=${category.toString()}&brand=${brand.toString()}&min_price=${minPrice}&max_price=${maxPrice}`
    const queryParams = {
      l: limit,
      o: resetPage ? 0 : page,
      min_date,
      max_date,
      category: category.toString(),
      brand: brand.toString(),
      min_price: minPrice,
      max_price: maxPrice,
      type: "Catalog",
      half_pack_available: halfpack ? true : false
    }
    const payload = getPayload(queryParams)
    console.warn("payload", payload)
    _getProducts(payload, resetPage)
  }
  const removeFIlter = () => {
    const payload = halfpack
      ? `?l=${limit}&o=${0}&half_pack_available=true`
      : `?l=${limit}&o=${0}&type=Catalog`
    console.warn("payload", payload)
    _getProducts(payload, true)
    handleChange("min_date", "")
    handleChange("max_date", "")
    handleChange("maxPrice", "")
    handleChange("minPrice", "")
    handleChange("category", [])
    handleChange("brand", [])
    handleChange("filterOpen", false)
    setMarkedDates([_today])
    setSelectdates([])
  }

  const handleFilter = () => {
    getData()
    handleChange("filterOpen", false)
  }

  const onScrollHandler = () => {
        getData()
  }

  const onRefresh = () => {
    getData(true)
  }

  const windowSize = products?.length > 50 ? products?.length / 4 : 21

  const [callOnScrollEnd, updateCallOnScrollEnd] = useState(false)

  return (
    <View style={styles.container}>
      <Header
        leftEmpty
        tab
        titleUpp
        tabText={halfpack ? i18n.t("Half Pack") : i18n.t("Orders")}
        menu
        menuClick={() => {
          handleChange("filterOpen", true)
          handleChange("products", [])
          handleChange("page", 0)
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
                textAlign: "center",
                fontFamily: FONT1REGULAR,
                color: COLORS.primary
              }}
            >
              No List
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
        // disableVirtualization={true}
        maxToRenderPerBatch={windowSize}
        windowSize={windowSize}
        style={styles.flatList}
        keyExtractor={item => "_" + item?.sid}
        onEndReachedThreshold={0.1}
        onEndReached={() => (updateCallOnScrollEnd(true))}
        onMomentumScrollEnd={() => {
          callOnScrollEnd && onScrollHandler()
          updateCallOnScrollEnd(false)
        }}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        renderItem={({ item, index }) => {
          return (
            <Product
              key={index}
              item={item}
              halfpack={halfpack}
              active={active}
            />
          )
        }}
      />
      <CustomModal
        visible={filterOpen}
        noSwipe
        height={"90%"}
        onClose={() => handleChange("filterOpen", false)}
      >
        <View style={styles.modalView}>
          <KeyboardAwareScrollView
            style={{ width: "100%", marginTop: 20 }}
            contentContainerStyle={{ width: "100%", alignItems: "center" }}
          >
            {/* <View style={styles.rowAround}>
            <BouncyCheckbox
              size={25}
              fillColor={COLORS.primary}
              unfillColor={COLORS.white}
              isChecked={halfPack}
              text='Half pack'
              iconStyle={{ borderColor: COLORS.black06, borderRadius: 0 }}
              textStyle={{
                fontFamily: FONT1SEMIBOLD,
                fontSize: hp(2.5),
                color: COLORS.primary
              }}
              style={{ marginVertical: 20 }}
              onPress={() => handleChange('halfPack', !halfPack)}
            />
          </View> */}
            <FullCalendar
              setMarkedDates={setMarkedDates}
              _markedDates={_markedDates}
              selectedDates={selectedDates}
              setSelectdates={setSelectdates}
              handleChange={handleChange}
              date={date}
            />
            <Text
              style={{
                fontFamily: FONT1SEMIBOLD,
                fontSize: hp(2.5),
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
              scrollEnabled={false}
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
                    fontSize: hp(2.5),
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
                fontSize: hp(2.5),
                color: COLORS.primary
              }}
            >
              {i18n.t("Brands")}
            </Text>
            <FlatList
              numColumns={2}
              style={{ width: "80%" }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
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
                    fontSize: hp(2.5),
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
                fontSize: hp(2.5),
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
          </KeyboardAwareScrollView>
          <View style={styles.buttonWidth}>
            <AppButton title={i18n.t("APPLY")} onPress={handleFilter} />
            <AppButton
              title={i18n.t("REMOVE FILTER")}
              outlined
              onPress={removeFIlter}
            />
          </View>
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
    width: "80%",
    marginBottom: 20
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
    width: "80%",
    alignItems: "center"
    // justifyContent: 'space-around'
  },
  modalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  }
})

export default Products
