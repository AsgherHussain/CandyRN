import React, { useState, useContext, useEffect } from "react"
import { Modal } from "react-native"
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
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "react-native-elements"
import Toast from "react-native-simple-toast"
import { SvgXml } from "react-native-svg"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import { AppButton, AppInput } from "../../components"
import { getSalesPersonById } from "../../api/salesperson"
import AppContext from "../../store/Context"
import leftIcon from "../../assets/svg/left.svg"
import profileIcon from "../../assets/images/profile.png"
import ImagePicker from "react-native-image-crop-picker"
import i18n from "../../i18n"
import UserProfile from "../../assets/images/profile.png"
import {
  createNewSalePersonProfile,
  getSalesPerson,
  updateSalepersonProfiles,
  deleteSalepersonProfiles,
  assignedUsersToSalesPerson,
  deleteUsersSalesPerson
} from "../../api/salesperson"
import UnassignedUserModal from "./UnassignedUserModal"
import DeleteUserModal from "./DeleteUserModal"

function SalepersonView({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const userID = route?.params?.userID
  const [state, setState] = useState({
    name: "",
    last_name: "",
    email: "",
    shipping_address: "",
    country: "",
    photo: null,
    isUpdate: true,
    modal: false,
    phone: "",
    note: "",
    password: "",
    unassignedModal: false,
    deleteModal: false,
    userResponseId: null,
    assignedUser: []
  })

  React.useEffect(() => {
    const fetchData = async () => {
      if (userID) {
        handleChange("loading", true)
        const token = await AsyncStorage.getItem("token")
        let userResponse = await getSalesPersonById(userID, token)
        userResponse = userResponse?.data
        setState({
          ...state,
          email: userResponse?.email,
          name: userResponse?.first_name,
          last_name: userResponse?.last_name,
          phone: userResponse?.phone,
          password: userResponse?.password,
          note: userResponse?.note,
          userResponseId: userResponse?.user.id,
          assignedUser: userResponse.assigned_users || []
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
    isUpdate,
    modal,
    phone,
    note,
    unassignedModal,
    deleteModal,
    userResponseId,
    assignedUser
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

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      await deleteSalepersonProfiles(userID, token)
      handleChange("deleteModal", false)
      Toast.show(i18n.t("Salesperson Profile has been deleted!"))
      navigation.goBack()
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t("Error")}: ${JSON.stringify(errorText[0])}`)
    }
  }
  const handleProfile = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const payload = {
        first_name: name,
        last_name: last_name,
        email: email,
        phone: phone,
        note: note,
        user: userResponseId
      }
      const formData = new FormData()
      formData.append("first_name", name)
      formData.append("last_name", last_name)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("note", note)
      await updateSalepersonProfiles(userID, payload, token)
      handleChange("loading", false)
      Toast.show(i18n.t("Salesperson has been updated!"))
      handleChange("isUpdate", false)
    } catch (error) {
      console.log("TEsting", error)
      handleChange("loading", false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t("Error")}: ${JSON.stringify(errorText[0])}`)
    }
  }

  const handleAssignUser = async users => {
    let assignedNew = [...assignedUser]
    if (users.length > 0) {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      try {
        const promises = users.map(async u => {
          const assigned = await assignedUsersToSalesPerson(
            { user: u.id, salesperson: userID },
            token
          )
          return assigned?.data
        })

        const assignedUsersData = await Promise.all(promises)
        assignedNew = [...assignedNew, ...assignedUsersData]
        console.log("Test", assignedNew)
        handleChange("assignedUser", assignedNew)
        handleChange("unassignedModal", false)
        handleChange("loading", false)
      } catch (error) {
        handleChange("loading", false)
        console.error("Error assigning user:", error)
        // Handle error if needed
      }
    }
  }

  const deleteAssignedUser = async id => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const res = await deleteUsersSalesPerson(id, token)
      setState({
        ...state,
        assignedUser: assignedUser.filter(i => i.id !== id)
      })
      Toast.show(i18n.t("Assigned User Deleted!"))
      handleChange("loading", false)
    } catch (E) {
      handleChange("loading", false)
      console.log("Error deleteAssignedUser", E)
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
            <Text style={styles.activeTabText}>
              {i18n.t("Salesperson Profile")}
            </Text>
            <View style={styles.activeline} />
          </View>
          <View style={{ width: "10%" }} />
        </View>
        <View style={styles.imgDiv}>
          <TouchableOpacity
            disabled
            onPress={() =>
              isUpdate ? handleChange("modal", true) : console.log()
            }
            style={styles.userView}
          >
            <Image source={profileIcon} style={styles.profileImage} />
          </TouchableOpacity>
          {userID && (
            <TouchableOpacity
              style={styles.iconDelete}
              onPress={() => handleChange("deleteModal", true)}
            >
              <Icon
                name="delete"
                type="antdesign"
                color={COLORS.primary}
                size={16}
              />
            </TouchableOpacity>
          )}
        </View>
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

          <View style={[styles.buttonWidth, { marginBottom: 0, marginTop: 8 }]}>
            <AppButton
              title={i18n.t("CONFIRM")}
              loading={loading}
              disabled={!name || !last_name || !phone}
              onPress={handleProfile}
            />
          </View>
          {userID && (
            <View style={styles.buttonWidth}>
              <AppButton
                title={i18n.t("ASSIGN USERS")}
                // loading={loading}
                onPress={() => handleChange("unassignedModal", true)}
                backgroundColor={COLORS.white}
                color={COLORS.black}
                borderColor={COLORS.black}
                outlined
              />
            </View>
          )}

          <View>
            {assignedUser.map(item => {
              const { id, user } = item
              return (
                <View style={styles.listContainer} key={JSON.stringify(item)}>
                  <Image style={styles.listImage} source={UserProfile} />
                  <View style={styles.textContainer}>
                    <Text>
                      {user.first_name} {user.last_name}
                    </Text>
                    <TouchableOpacity>
                      <Icon
                        name="delete"
                        type="antdesign"
                        color={COLORS.primary}
                        size={16}
                        onPress={() => deleteAssignedUser(id)}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </View>
        </>
      </View>
      {unassignedModal && (
        <UnassignedUserModal
          onClose={() => handleChange("unassignedModal", false)}
          onAction={users => handleAssignUser(users)}
          assigned={assignedUser}
        />
      )}
      {deleteModal && (
        <DeleteUserModal
          onClose={() => handleChange("deleteModal", false)}
          onDelete={handleDelete}
        />
      )}
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
    width: "70%",
    marginLeft: 10
  },
  listImage: {
    width: 50,
    borderRadius: 50,
    height: 50
  },
  iconDelete: { marginLeft: hp(1), marginTop: hp(4) },
  imgDiv: { flexDirection: "row", alignItems: "center" }
})

export default SalepersonView
