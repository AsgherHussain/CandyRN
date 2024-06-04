import React, { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions
} from "react-native"
import { CheckBox } from "react-native-elements"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import { AppButton, AppInput, Header } from "../../components"
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1SEMIBOLD } from "../../constants"
import searchIcon from "../../assets/svg/search.svg"
import UserProfile from "../../assets/images/profile.png"
import FlagIcon from "../../assets/svg/flag.svg"
import FlagFill from "../../assets/svg/flagFill.svg"
import AppContext from "../../store/Context"
import i18n from "../../i18n"
import { CustomModal } from "../../components"

const { height, width } = Dimensions.get("screen")

function DeleteUserModal({ onDelete, onClose }) {
  return (
    <CustomModal visible height={"35%"} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t("Delete Salesperson")}</Text>
        <Text style={styles.subTitle}>
          {i18n.t(
            "Are you sure you want to delete this Salesperson, you can't undo this action?"
          )}
        </Text>
        <View style={styles.mainBody}>
          <View style={styles.buttonWidth}>
            <AppButton
              title={i18n.t("YES")}
              onPress={onDelete}
              width={width / 1.1}
              backgroundColor={COLORS.darkRed}
            />
          </View>
          <View style={styles.buttonWidth}>
            <AppButton
              title={i18n.t("NO")}
              onPress={onClose}
              width={width / 1.1}
            />
          </View>
        </View>
      </View>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center"
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  mainBody: {
    width: "90%",
    height: "100%",
    alignItems: "center"
  },
  listImage: {
    width: 50,
    borderRadius: 50,
    height: 50
  },

  title: {
    marginBottom: 5,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  subTitle: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM,
    textAlign: "center",
    width: "90%"
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 70
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "83%",
    marginLeft: 10
  },
  tab: {
    width: "50%",
    marginBottom: 20,
    alignItems: "center"
  }
})

export default DeleteUserModal
