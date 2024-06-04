import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import ProductImage from "../../assets/images/product.png"
import { COLORS, FONT1BOLD, FONT1REGULAR } from "../../constants"
import i18n from "../../i18n"

export default function Product({
  active,
  item,
  isguest,
  inventory,
  halfpack,
  handleChange
}) {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        isguest
          ? handleChange("showPopup", true)
          : navigation.navigate("InventoryDetails", {
              product: item,
              inventory,
              halfpack
            })
      }}
      style={[styles.container, { width: !active ? "100%" : "48%" }]}
    >
      <Image
        source={
          item?.photos?.length > 0
            ? { uri: item?.photos[0]?.image }
            : ProductImage
        }
        style={[styles.image, { height: active ? 200 : 400 }]}
      />
      <View style={styles.rowBetween}>
        <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
          {item?.sid}
        </Text>
        {!active && inventory && (
          <>
            <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
              {item?.brand?.name}
            </Text>
            <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
              {item?.category?.name}
            </Text>
          </>
        )}
        {inventory && (
          <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
            Q: {item?.stock}
          </Text>
        )}
        <Text style={[styles.styleText, { fontSize: hp(1.6) }]}>
          {active ? "" : i18n.t("Price") + ":"} ${item?.per_item_price}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 20
  },
  image: {
    width: "100%"
  },
  rowBetween: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 5,
    width: "100%"
  },
  styleText: {
    color: COLORS.black,
    fontSize: hp(2.5),
    fontFamily: FONT1BOLD
  },
  price: {
    fontSize: hp(2.5),
    fontFamily: FONT1REGULAR
  }
})
