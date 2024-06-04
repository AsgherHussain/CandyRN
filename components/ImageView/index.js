import React from "react"
import ImageView from "react-native-image-viewing"
import { COLORS, FONT1BOLD, FONT1REGULAR } from "../../constants"
import { View, Text } from "react-native"
import i18n from "../../i18n"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export default function ImageViews({
  images,
  isImageViewVisible,
  handleChange
}) {
  const myImage = require("../../assets/images/product.png")
  const resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource")
  const resolvedImage = resolveAssetSource(myImage)
  return (
    <ImageView
      images={images[0]?.uri === "Static Image" ? [{uri: resolvedImage.uri}] : images}
      imageIndex={0}
      backgroundColor={COLORS.white}
      visible={isImageViewVisible}
      FooterComponent={({ imageIndex }) => (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            height: 50,
            paddingTop: 5,
            backgroundColor: COLORS.white
          }}
        >
          <Text
            style={{
              color: COLORS.darkBlack,
              fontSize: hp(1.8),
              fontFamily: FONT1REGULAR
            }}
          >
            {i18n.t("Product")}: {images[imageIndex]?.id}
          </Text>
          <View
            style={{
              width: 20,
              height: 20,
              marginLeft: 10,
              backgroundColor: images[imageIndex]?.style,
              borderWidth: 1,
              borderColor: COLORS.black,
              borderRadius: 20
            }}
          />
          <Text
            style={{
              color: COLORS.totalprice,
              fontSize: hp(1.8),
              fontFamily: FONT1BOLD
            }}
          >
            {i18n.t("Price")}: $ {images[imageIndex]?.price}
          </Text>
        </View>
      )}
      isSwipeCloseEnabled={true}
      onRequestClose={() => handleChange("isImageViewVisible", false)}
    />
  )
}
