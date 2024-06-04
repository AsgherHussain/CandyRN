import React, { useCallback, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AdminProductCard, ImageViews, Header } from "../../components"
import { COLORS, FONT1SEMIBOLD } from "../../constants"
import { SwipeListView } from "react-native-swipe-list-view"
import { Icon } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-simple-toast"
import { deleteProduct, getAdminProducts } from "../../api/admin"
import i18n from "../../i18n"
import { useFocusEffect } from "@react-navigation/native"
import BottomIcon from "../../assets/svg/bottom.svg"
import { SvgXml } from "react-native-svg"

export default function ListProduct({}) {
  const flatListRef = useRef()
  // Context
  const [state, setState] = useState({
    loading: false,
    isRefreshing: false,
    active: 0,
    page: 0,
    limit: 50,
    adminProductsLoading: false,
    adminProducts: [],
    catalogAdminProducts: [],
    isImageViewVisible: false,
    images: []
  })

  const {
    loading,
    isRefreshing,
    active,
    page,
    limit,
    adminProductsLoading,
    adminProducts,
    catalogAdminProducts,
    isImageViewVisible,
    images
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      getData()
    }, [])
  )

  const _getAdminProducts = async (payload, inventory, resetPage) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const body = payload ? payload : ""
      const res = await getAdminProducts(body, token)
      if (inventory) {
        handleChange(
          "adminProducts",
          resetPage ? res?.data : [...adminProducts, ...res?.data]
        )
      } else {
        handleChange(
          "catalogAdminProducts",
          resetPage ? res?.data : [...catalogAdminProducts, ...res?.data]
        )
      }
      handleChange("page", resetPage ? 0 + limit : page + limit)
      handleChange("isRefreshing", false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const getData = resetPage => {
    _getAdminProducts(
      `?l=${limit}&o=${resetPage ? 0 : page}&type=Inventory`,
      true,
      resetPage
    )
    _getAdminProducts(
      `?l=${limit}&o=${resetPage ? 0 : page}&type=Catalog`,
      false,
      resetPage
    )
  }

  const filteredByType = () => {
    const listFilter = adminProducts?.filter(e =>
      !active ? e.type === "Inventory" : e.type === "Catalog"
    )
    return listFilter
  }

  const _deleteProduct = async id => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      await deleteProduct(id, token)
      Toast.show(i18n.t(`Product has been deleted!`))
      getData()
      handleChange("loading", false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("loading", false)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const onScrollHandler = () => {
    getData()
  }

  const onRefresh = () => {
    getData(true)
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

  return (
    <View style={styles.container}>
      <Header back tabText={i18n.t("Feedback")} rightEmpty />
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
                {i18n.t("Inventory")}
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
                {i18n.t("Orders")}
              </Text>
            </View>
            <View style={active === 1 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>
        {adminProductsLoading && (
          <ActivityIndicator size={"small"} color={COLORS.primary} />
        )}
        <SwipeListView
          data={active ? catalogAdminProducts : adminProducts}
          ref={flatListRef}
          key={active === 0 ? "#" : "_"}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          keyExtractor={(item, index) => "_" + item?.sid + index}
          leftOpenValue={75}
          onEndReached={onScrollHandler}
          onEndReachedThreshold={0}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "center",
                height: "90%",
                paddingLeft: 10
              }}
            >
              <TouchableOpacity onPress={() => _deleteProduct(data?.item?.id)}>
                <Icon
                  name={"delete"}
                  type={"antdesign"}
                  color={COLORS.alertButon}
                />
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item, index }) => {
            return (
              <AdminProductCard
                key={index}
                showImage={showImage}
                item={item}
                active={active}
                // handleRemoveItem={handleRemoveItem}
              />
            )
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          flatListRef?.current?._listView?._listRef?._scrollRef?.scrollTo({
            animated: true,
            offset: 0
          })
          console.log("asd", flatListRef?.current)
        }}
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
        onPress={() =>
          flatListRef?.current?._listView?._listRef?._scrollRef?.scrollToEnd({
            animated: true
          })
        }
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
    height: "85%",
    alignItems: "center"
  },

  activeTabText: {
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
    textTransform: "uppercase",
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
    textTransform: "uppercase",
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    textTransform: "uppercase",
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
  }
})
