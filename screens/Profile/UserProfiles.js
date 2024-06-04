import React, { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import { AppButton, AppInput } from "../../components"
import { getUserById } from "../../api/admin"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppContext from "../../store/Context"
import leftIcon from "../../assets/svg/left.svg"
import Toast from "react-native-simple-toast"
import { SvgXml } from "react-native-svg"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import profileIcon from "../../assets/images/profile.png"
import ImagePicker from "react-native-image-crop-picker"
import i18n from "../../i18n"
import { Modal } from "react-native"
import { updateProfile } from "../../api/auth"

function ProfileView({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const { user } = context
  const userID = route?.params?.userID

  const [state, setState] = useState({
    name: "",
    last_name: "",
    email: "",
    shipping_address: "",
    city: "",
    zip_code: "",
    selectState: "",
    country: "",
    avatarSourceURL: "",
    photo: null,
    isUpdate: true,
    modal: false,
    phone: "",
    note: "",
    salesperson: null,
    completed_date: null,
    total_in_cart: 0
  })

  React.useEffect(() => {
    const fetchData = async () => {
      if (userID) {
        handleChange("loading", true)
        const token = await AsyncStorage.getItem("token")
        let userResponse = await getUserById(userID, token)
        userResponse = userResponse?.data
        setState({
          ...state,
          email: userResponse?.email,
          name: userResponse?.name,
          last_name: userResponse?.last_name,
          phone: userResponse?.phone,
          zip_code: userResponse?.profile?.zip_code || "",
          selectState: userResponse?.profile?.country || "",
          city: userResponse?.profile?.city || "",
          country: userResponse?.profile?.country || "",
          shipping_address: userResponse?.profile?.shipping_address || "",
          avatarSourceURL: userResponse?.profile?.photo,
          note: userResponse?.note,
          salesperson: userResponse?.salesperson,
          completed_date: userResponse?.completed_date,
          total_in_cart: userResponse?.total_in_cart
        })

        handleChange("loading", false)
      }
    }
    fetchData()
  }, [userID])

  const {
    loading,
    email,
    name,
    last_name,
    shipping_address,
    city,
    zip_code,
    selectState,
    country,
    avatarSourceURL,
    photo,
    isUpdate,
    modal,
    phone,
    note,
    salesperson,
    completed_date,
    total_in_cart
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _uploadImage = async type => {
    handleChange("uploading", true)
    let OpenImagePicker =
      type == "camera"
        ? ImagePicker.openCamera
        : type == ""
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      cropping: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange("uploading", false)
        } else {
          const uri = response.path
          const uploadUri =
            Platform.OS === "ios" ? uri.replace("file://", "") : uri
          const photo = {
            uri: uploadUri,
            name: "userimage1.png",
            type: response.mime
          }
          handleChange("avatarSourceURL", uploadUri)
          handleChange("photo", photo)
          handleChange("uploading", false)
          handleChange("modal", false)
          Toast.show(i18n.t("Profile Add Successfully"))
        }
      })
      .catch(err => {
        handleChange("showAlert", false)
        handleChange("uploading", false)
      })
  }

  const handleProfile = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const user_id = user?.id
      const formData = new FormData()
      formData.append("name", name)
      formData.append("last_name", last_name)
      formData.append("email", email)
      photo && formData.append("profile.photo", null)
      formData.append("profile.shipping_address", shipping_address)
      formData.append("profile.city", city)
      formData.append("profile.zip_code", zip_code)
      formData.append("profile.state", selectState)
      formData.append("profile.country", country)
      formData.append("profile.phone", phone)
      const res = await updateProfile(formData, userID, token);
      // context?.setUser(res?.data)
      // await AsyncStorage.setItem("user", JSON.stringify(res?.data))
      handleChange('loading', false);
      Toast.show(i18n.t('Your profile has been updated!'));
      handleChange('isUpdate', false);
    } catch (error) {
      console.log("TEsting", error)
      handleChange("loading", false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t("Error")}: ${JSON.stringify(errorText[0])}`)
    }
  }
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View style={styles.top}>
        <View
          style={{
            width: "90%",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.menuView}
          >
            <SvgXml xml={leftIcon} />
          </TouchableOpacity>
          <View style={styles.tab}>
            <Text style={styles.activeTabText}>{i18n.t("User Profile")}</Text>
            <View style={styles.activeline} />
          </View>
          <View style={{ width: "10%" }} />
        </View>
        <TouchableOpacity
          onPress={() =>
            isUpdate ? handleChange("modal", true) : console.log()
          }
          style={styles.userView}
        >
          <Image
            source={avatarSourceURL ? { uri: avatarSourceURL } : profileIcon}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        {isUpdate ? (
          <>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Full name")}
                placeholder={i18n.t("Full name")}
                name={"name"}
                prefixBGTransparent
                value={name}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Last name")}
                placeholder={i18n.t("Last name")}
                name={"last_name"}
                prefixBGTransparent
                value={last_name}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Phone number")}
                placeholder={i18n.t("Phone number")}
                name={"phone"}
                prefixBGTransparent
                value={phone}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Email (optional)")}
                placeholder={i18n.t("Email (optional)")}
                name={"email"}
                prefixBGTransparent
                value={email}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("City")}
                placeholder={i18n.t("City")}
                name={"city"}
                prefixBGTransparent
                value={city}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Country")}
                placeholder={i18n.t("Country")}
                name={"country"}
                prefixBGTransparent
                value={country}
                onChange={handleChange}
              />
            </View>
            <View style={styles.textInputContainer}>
              <AppInput
                label={i18n.t("Note")}
                placeholder={i18n.t("Note")}
                name={"note"}
                prefixBGTransparent
                value={note}
                height={hp("9%")}
                onChange={handleChange}
                multiline
              />
            </View>

            <View style={styles.salesInfo}>
              <View style={styles.width90}>
                <Text style={styles.name}>
                  {i18n.t("Salesperson")}:{" "}
                  <Text style={{ fontFamily: FONT1REGULAR }}>
                    {salesperson}
                  </Text>
                </Text>
                <Text style={styles.name}>
                  {i18n.t("Date Of Last Completed Order")}: {completed_date}
                </Text>
                <Text style={styles.name}>
                  {i18n.t("Total Amount Bought")}: {total_in_cart}
                </Text>
              </View>
            </View>
            <View style={styles.buttonWidth}>
              <AppButton
                title={i18n.t("CONFIRM")}
                loading={loading}
                disabled={!name || !city || !country}
                onPress={handleProfile}
              />
            </View>
          </>
        ) : (
          <View style={{ width: "90%", marginTop: 20 }}>
            <Text style={styles.name}>
              {i18n.t("Shipping Address")}: {shipping_address}
            </Text>
            <Text style={styles.name}>
              {i18n.t("Full name")}: {name + " " + last_name}
            </Text>
            <Text style={styles.name}>
              {i18n.t("City")}: {city}
            </Text>
            <Text style={styles.name}>
              {i18n.t("ZIP")}: {zip_code}
            </Text>
            <Text style={styles.name}>
              {i18n.t("State")}: {selectState}
            </Text>
            <Text style={styles.name}>
              {i18n.t("Country")}: {country}
            </Text>
            <Text style={styles.name}>
              {i18n.t("Email")}: {email}
            </Text>
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          handleChange("modal", false)
        }}
      >
        <View
          style={[styles.centeredView]}
          onPress={() => {
            handleChange("modal", false)
          }}
        >
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text style={styles.modalText}>{i18n.t("Select Option")}</Text>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => handleChange("modal", false)}
            >
              <Text style={styles.cross}>X</Text>
            </TouchableOpacity>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1]}>
                <AppButton
                  title={i18n.t("Open Camera")}
                  onPress={() => _uploadImage("camera")}
                />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={i18n.t("Open Gallery")}
                  outlined
                  backgroundColor={COLORS.white}
                  onPress={() => _uploadImage("gallery")}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    backgroundColor: COLORS.white,
    height: "100%"
  },
  top: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center"
  },
  buttonWidth: { width: "80%", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  textInputContainer: { width: "90%" },
  textInputContainerHalf: { marginBottom: hp("2%"), width: "48%" },
  remeberContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: hp(5)
  },
  menuView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 45,

    position: "absolute",
    left: 0
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD,
    textDecorationLine: "underline"
  },
  signUpText: {
    marginTop: 20
  },
  loginText: {
    color: COLORS.black,
    fontSize: hp(2.5),
    marginBottom: "5%",
    fontFamily: FONT1REGULAR
  },
  backContainer: { width: "90%", alignItems: "flex-start", marginBottom: 30 },
  signUp: {
    color: COLORS.secondary,
    fontFamily: FONT1BOLD,
    textDecorationLine: "underline"
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
  tabText: {
    color: COLORS.grey,
    fontSize: hp(3),
    marginBottom: 10,
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    textTransform: "capitalize",
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD,
    textAlign: "center"
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%"
  },
  userView: {
    alignItems: "center",
    marginTop: 30
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80
  },
  name: {
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.modalBG
  },
  modalView: {
    width: "90%",
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 20,
    paddingVertical: 50,
    elevation: 5
  },
  rowAround: {
    width: "100%",
    marginVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  modalText: {
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: FONT1BOLD,
    fontSize: hp(4),
    marginBottom: 20
  },
  halfWidth1: {
    width: "48%"
  },
  salesInfo: {
    width: "100%",
    marginTop: 24,
    borderTopWidth: 1,
    alignItems: "center"
  },
  width90: {
    width: "90%"
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 10
  },
  cross: {
    fontSize: hp(2.5)
  }
})

export default ProfileView
