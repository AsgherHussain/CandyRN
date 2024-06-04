import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import ProductImage from "../../assets/images/product.png"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import i18n from "../../i18n"

export default function AdminOrders({
  item,
  active,
  fullItem,
  handleRemoveItem,
  showImage,
  pageProcess
}) {
  const navigation = useNavigation()
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.image, { maxHeight: 250, minHeight: 200 }]}
        onPress={() => {
          showImage({
            images:
              active === 2
                ? item?.product?.photos?.length > 0
                  ? item?.product?.photos
                  : [{ image: "Static Image" }]
                : item?.photos?.length > 0
                ? item?.photos
                : [{ image: "Static Image" }],
            id: active === 2 ? item?.product?.sid : item?.sid,
            price:
              active === 2
                ? item?.product?.per_item_price
                : item?.per_item_price,
            style:
              active === 2
                ? item?.style?.toLowerCase()
                : item?.totals?.style?.toLowerCase()
          })
        }}
      >
        <Image
          source={
            active === 2
              ? item?.product?.photos?.length > 0
                ? { uri: item?.product?.photos[0]?.image }
                : ProductImage
              : item?.photos?.length > 0
              ? { uri: item?.photos[0]?.image }
              : ProductImage
          }
          style={[{ width: "100%", height: "100%" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          active === 2
            ? navigation.navigate("UserOrders", {
                userID: fullItem?.user?.id,
                user: fullItem?.user
              })
            : active === 3
            ? navigation.navigate("OrderDetails", { item, pageProcess })
            : navigation.navigate("OrderDetailsForProcess", {
                item,
                isReserved: active === 4 || active === 5 ? true : false
              })
        }
        style={styles.rowBetween}
      >
        <Text style={styles.price}>
          {i18n.t("Product")}: {active === 2 ? item?.product?.sid : item?.sid}
        </Text>
        {active === 2 && (
          <View
          // onPress={() =>
          //   navigation.navigate('UserOrders', {
          //     userID: fullItem?.user?.id
          //   })
          // }
          >
            <Text style={[styles.price, { fontFamily: FONT1SEMIBOLD }]}>
              {i18n.t("User")}: {fullItem?.user?.name}
            </Text>
          </View>
        )}
        <Text style={styles.price}>
          {i18n.t("Size")}:{" "}
          {active === 2 ? item?.product?.size_variance : item?.size_variance}
        </Text>
        <View style={styles.styleDiv}>
          <Text style={styles.price}>{i18n.t("Color")}</Text>
          {/* {Array.isArray(item?.styles) && item?.styles?.length > 0 ? (
            <>
              {item?.styles?.map((style, index) => (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 10,
                    backgroundColor: style?.toLowerCase(),
                    borderWidth: 1,
                    borderColor: COLORS.black,
                    borderRadius: 20
                  }}
                />
              ))}
            </>
          ) : ( */}
          <View
            style={{
              width: 20,
              height: 20,
              marginLeft: 10,
              backgroundColor:
                active === 2
                  ? item?.style?.toLowerCase()
                  : item?.totals?.style?.toLowerCase(),
              borderWidth: 1,
              borderColor: COLORS.black,
              borderRadius: 20
            }}
          />
          {/* )} */}
        </View>
        <Text style={styles.total}>
          {i18n.t("Price")}: $
          {active === 2 ? item?.product?.per_item_price : item?.per_item_price}
        </Text>
        <Text
          style={[
            styles.total,
            { color: item?.type === "Inventory" ? "#038CD9" : "#FF9900" }
          ]}
        >
          {active === 2 ? item?.product?.type : item?.type}
        </Text>
        <Text style={styles.quantity}>
          {i18n.t("Customers")}: {item?.totals?.customer_count}
        </Text>
        <Text style={styles.quantity}>
          {i18n.t("Total Packs")}: {item?.totals?.pack_count}
        </Text>
        <Text style={styles.quantity}>
          {i18n.t("Total order Qty")}: {item?.totals?.quantity_count}
        </Text>
        <Text style={styles.quantity}>
          {i18n.t("Total Amount")}: ${item?.totals?.amount_count}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
    minHeight: 300,
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
  removeDiv: {
    flexDirection: "row",
    alignItems: "center"
  },
  styleDiv: {
    flexDirection: "row",
    alignItems: "center"
  }
})
