import React, { useContext, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AppButton, Header } from "../../components"
import {
  COLORS,
  FONT1BOLD,
  FONT1REGULAR,
  FONT2BOLD,
  FONT2ITALIC,
  FONT2REGULAR
} from "../../constants"
import ProductImage from "../../assets/images/product.png"
import { Icon } from "react-native-elements"
import { addToCart } from "../../api/customer"
import Toast from "react-native-simple-toast"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppContext from "../../store/Context"
import ImageView from "react-native-image-viewing"
import i18n from "../../i18n"
import Carousel from "react-native-snap-carousel"
import { FlatList } from "react-native"

const sliderWidth = Dimensions.get("window").width
function InventoryDetails({ navigation, route }) {
  const product = route?.params?.product
  const inventory = route?.params?.inventory
  const halfpack = route?.params?.halfpack
  // Context
  const context = useContext(AppContext)
  const { _getCart } = context
  const [state, setState] = useState({
    active: 0,
    quantity: 0,
    selectedStyle: "",
    loading: false,
    images: [],
    isImageViewVisible: false
  })

  const {
    active,
    quantity,
    selectedStyle,
    loading,
    isImageViewVisible,
    images
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const showImage = url => {
    const data = []
    product?.photos?.forEach(element => {
      data.push({ uri: element?.image })
    })
    handleChange("images", data)
    handleChange("isImageViewVisible", true)
  }

  const handleQuantity = type => {
    if (type === "add") {
      handleChange("quantity", quantity + 3)
    } else {
      handleChange("quantity", quantity > 0 ? quantity - 3 : 0)
    }
  }

  const _addToCart = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        product: product?.id,
        quantity,
        style: selectedStyle
      }
      const token = await AsyncStorage.getItem("token")
      await addToCart(payload, token)
      Toast.show(i18n.t(`Your item has moved to the cart!`))
      _getCart()
      // navigation.goBack()
      handleChange("loading", false)
      handleChange("selectedStyle", "")
      handleChange("quantity", 0)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("loading", false)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Header back />
      <Carousel
        data={product?.photos}
        renderItem={({ item: photo, index }) => (
          <TouchableOpacity
            key={index}
            style={[styles.image, { marginLeft: "5%", height: 400 }]}
            onPress={() => showImage(photo?.image)}
          >
            <Image
              source={photo?.image ? { uri: photo?.image } : ProductImage}
              style={[{ width: "100%", height: "100%" }]}
            />
          </TouchableOpacity>
        )}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />
      <View style={styles.rowBetween}>
        <Text style={[styles.styleText, { fontSize: hp(1.6), maxWidth: product?.styles?.length > 3 || product?.half_pack_styles?.length > 3 ? '15%' : '20%' }]}>
          {product?.sid}
        </Text>
        <Text style={[styles.styleText, { fontSize: hp(1.6), maxWidth: product?.styles?.length > 3 || product?.half_pack_styles?.length > 3 ? '15%' : '22%' }]}>
          {product?.brand?.name}
        </Text>
        <Text style={[styles.styleText, { fontSize: hp(1.6), maxWidth: product?.styles?.length > 3 || product?.half_pack_styles?.length > 3 ? '15%' : '22%' }]}>
          {product?.category?.name}
        </Text>
        {inventory && (
          <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
            Q: {product?.stock}
          </Text>
        )}
        {halfpack ? (
          <FlatList
            numColumns={3}
            data={product?.half_pack_styles}
            style={{ marginHorizontal: 5, maxWidth: '25%' }}
            renderItem={({ item: color, inde }) => (
              <TouchableOpacity
                key={inde}
                onPress={() =>
                  handleChange(
                    "selectedStyle",
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? ""
                      : color
                  )
                }
                style={{
                  width:
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? 30
                      : 20,
                  height:
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? 30
                      : 20,
                  marginRight: 5,
                  backgroundColor: color?.toLowerCase(),
                  borderWidth: 1,
                  borderColor: COLORS.black,
                  borderRadius: 20
                }}
              />
            )}
          />
          // <View style={[styles.row, { width: 100 }]}>
          //   {product?.half_pack_styles?.map((color, index) => (
          //     <TouchableOpacity
          //       onPress={() =>
          //         handleChange(
          //           "selectedStyle",
          //           selectedStyle?.toLowerCase() === color?.toLowerCase()
          //             ? ""
          //             : color
          //         )
          //       }
          //       key={index}
          //       style={{
          //         width:
          //           selectedStyle?.toLowerCase() === color?.toLowerCase()
          //             ? 30
          //             : 20,
          //         height:
          //           selectedStyle?.toLowerCase() === color?.toLowerCase()
          //             ? 30
          //             : 20,
          //         marginRight: 5,
          //         backgroundColor: color?.toLowerCase(),
          //         borderWidth: 1,
          //         borderColor: COLORS.black,
          //         borderRadius: 20
          //       }}
          //     />
          //   ))}
          // </View>
        ) : (
          <FlatList
            numColumns={3}
            data={product?.styles}
            style={{ marginHorizontal: 5, maxWidth: '25%' }}
            renderItem={({ item: color, inde }) => (
              <TouchableOpacity
                key={inde}
                onPress={() =>
                  handleChange(
                    "selectedStyle",
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? ""
                      : color
                  )
                }
                style={{
                  width:
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? 30
                      : 20,
                  height:
                    selectedStyle?.toLowerCase() === color?.toLowerCase()
                      ? 30
                      : 20,
                  marginRight: 5,
                  backgroundColor: color?.toLowerCase(),
                  borderWidth: 1,
                  borderColor: COLORS.black,
                  borderRadius: 20
                }}
              />
            )}
          />
        )}
        {/* // <TouchableOpacity
            //   onPress={() => 
            //     handleChange(
            //       "selectedStyle",
            //       selectedStyle?.toLowerCase() === color?.toLowerCase()
            //         ? ""
            //         : color
            //     )
            //   }
            //   key={index}
            //   style={{
            //     width:
            //       selectedStyle?.toLowerCase() === color?.toLowerCase()
            //         ? 30
            //         : 20,
            //     height:
            //       selectedStyle?.toLowerCase() === color?.toLowerCase()
            //         ? 30
            //         : 20,
            //     marginRight: 5,
            //     backgroundColor: color?.toLowerCase(),
            //     borderWidth: 1,
            //     borderColor: COLORS.black,
            //     borderRadius: 20
            //   }}
            // /> */}
        <Text style={styles.price}>${product?.per_item_price}</Text>
      </View>
      <View style={styles.fullWidth}>
        <Text style={styles.productType}>
          {product?.type} {i18n.t("order")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <View style={{ width: "50%" }}>
            {<Text style={styles.quantity}>{i18n.t("Quantity")}</Text>}
            <View style={styles.rowCount}>
              <TouchableOpacity onPress={handleQuantity}>
                <Icon
                  name="minus"
                  type="antdesign"
                  color={COLORS.primary}
                  size={18}
                />
              </TouchableOpacity>
              <Text style={styles.quantityCount}>{quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantity("add")}>
                <Icon
                  name="plus"
                  type="antdesign"
                  color={COLORS.primary}
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={[styles.quantity, { marginTop: -8 }]}>
              {i18n.t("Size")}
            </Text>
            <Text style={[styles.description, { marginTop: 10 }]}>
              {product?.size_variance}
            </Text>
          </View>
        </View>
        <Text style={[styles.quantity, { marginTop: 15 }]}>
          {i18n.t("Description")}
        </Text>
        <Text style={[styles.description, { marginTop: 5 }]}>
          {product?.description}
        </Text>
        <View style={styles.hline} />
        {/* <Text style={styles.totalprice}>{product?.description}</Text> */}
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={inventory ? i18n.t("order") : i18n.t("MOVE ITEMS TO CART")}
          loading={loading}
          onPress={_addToCart}
          disabled={!quantity}
        />
      </View>
      <ImageView
        images={images}
        imageIndex={0}
        visible={isImageViewVisible}
        isSwipeCloseEnabled={true}
        onRequestClose={() => handleChange("isImageViewVisible", false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 10,
    backgroundColor: COLORS.white
  },
  buttonWidth: {
    width: "80%",
    marginBottom: 40
  },
  image: {
    width: "90%"
  },
  fullWidth: {
    width: "90%",
    marginTop: 20
  },
  rowBetween: {
    justifyContent: "space-between",
    // alignItems: "center",
    flexDirection: "row",
    width: "90%",
    marginTop: 10
  },
  styleText: {
    color: COLORS.black,
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  price: {
    fontSize: hp(1.8),
    fontFamily: FONT1REGULAR
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  rowCount: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  productType: {
    color: COLORS.black,
    fontFamily: FONT2ITALIC
  },
  quantity: {
    color: COLORS.black,
    fontFamily: FONT2BOLD,
    marginTop: 10
  },
  quantityCount: {
    color: COLORS.black,
    fontFamily: FONT2BOLD,
    marginHorizontal: 8,
    marginBottom: 5
  },
  description: {
    color: COLORS.black,
    fontFamily: FONT2REGULAR,
    fontSize: hp(1.8)
  },
  totalprice: {
    color: COLORS.totalprice,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginBottom: 30,
    marginTop: 10,
    textAlign: "right"
  },
  hline: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.primary,
    marginTop: 20
  }
})

export default InventoryDetails
