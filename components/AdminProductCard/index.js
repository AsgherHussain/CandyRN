import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import ProductImage from "../../assets/images/product.png"
import { COLORS, FONT1BOLD, FONT1REGULAR } from "../../constants"
import i18n from "../../i18n"

export default function AdminProductCard({
  item,
  showImage,
  handleRemoveItem,
  active
}) {
  const navigation = useNavigation()
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          showImage({
            images:
              item?.photos?.length > 0
                ? item?.photos
                : [{ image: "Static Image" }],
            id: item?.sid,
            price: item?.per_item_price,
            style: item?.styles[0]?.toLowerCase()
          })
        }}
        style={[styles.image, { height: 200 }]}
      >
        <Image
          source={
            item?.photos?.length > 0
              ? { uri: item?.photos[0]?.image }
              : ProductImage
          }
          style={[{ width: "100%", height: "100%" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("ProductDetails", { item })}
        style={styles.rowBetween}
      >
        <Text style={styles.price}>
          {i18n.t("Product")}: {item?.sid}
        </Text>
        <Text style={styles.total}>
          {i18n.t("Price")}: ${item?.per_item_price}
        </Text>
        <Text style={styles.price}>
          {i18n.t("Size")}: {item?.size_variance}
        </Text>
        <View style={styles.styleDiv}>
          <Text style={styles.price}>{i18n.t("Color")}</Text>
          {item?.styles?.map((style, index) => (
            <View
              key={index}
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
        </View>
        {active === 0 && (
          <Text style={styles.quantity}>
            {i18n.t("Category")}: {item?.category?.name}
          </Text>
        )}
        {active === 0 && (
          <Text style={styles.quantity}>
            {i18n.t("Quantity")}: {item?.stock}
          </Text>
        )}
        <Text style={styles.styleText}>{i18n.t("Description")}:</Text>
        <Text style={styles.quantity}>{item?.description}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginBottom: 20
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
