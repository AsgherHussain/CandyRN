import React, { useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { Icon } from "react-native-elements"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import { AppButton, AppInput } from "../../components"
import { loginUser, signupUser } from "../../api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppContext from "../../store/Context"
import Toast from "react-native-simple-toast"
import { SvgXml } from "react-native-svg"
import logo from "../../assets/svg/logo.svg"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import i18n from "../../i18n"
import { ActivityIndicator } from "react-native"

function LoginScreen({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setUser } = context

  const [state, setState] = useState({
    email: "",
    name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    isEmailValid: false,
    invalidPass: false,
    loading: false,
    showPassword: false,
    isChecked: false,
    showConfirmPassword: false,
    active: 0,
    isAdmin: false,
    showRestrict: false
  })

  const {
    loading,
    showPassword,
    confirm_password,
    phone,
    password,
    active,
    invalidPass,
    showConfirmPassword,
    last_name,
    name,
    isChecked,
    isAdmin,
    email,
    showRestrict
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleLogin = async () => {
    try {
      handleChange("loading", true)
      let payload
      if (isAdmin) {
        payload = {
          email,
          password
        }
      } else {
        payload = {
          phone,
          password
        }
      }
      const res = await loginUser(payload)
      handleChange("loading", false)
      console.warn("res?.data", res?.data)
      // if (res?.data?.user?.flagged && !res?.data?.user?.is_admin) {
      //   handleChange("showRestrict", true)
        // Alert.alert(
        //   i18n.t('Alert'),
        //   i18n.t('Your account is restricted please contact the app owner') +
        //   ' 55-6127-7889'
        // )
      //   return
      // }
      setUser(res?.data?.user)
      await AsyncStorage.setItem("token", res?.data?.token)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user))
      navigation.navigate("AuthLoading")
      Toast.show(i18n.t("Login Successfully!"))
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const handleSignup = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        name,
        last_name,
        phone,
        password,
        // flagged:false
      }
      const res = await signupUser(payload)
      handleChange("loading", false)
      console.warn("res?.data", res?.data)
      Toast.show(i18n.t("Signup Successfully!"))
      handleChange("active", 0)
      handleChange("showRestrict", true)
      // Alert.alert(
      //   i18n.t('Alert'),
      //   i18n.t('Your account is restricted please contact the app owner') +
      //   ' 55-6127-7889'
      // )
      // setUser(res?.data?.user)
      // await AsyncStorage.setItem('token', res?.data?.token)
      // await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user))
      // navigation.navigate('AuthLoading')
      // Toast.show(i18n.t('Signup Successfully!'))
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const checkPass = () => {
    const regex = /^.{6,}$/
    if (regex.test(password)) {
      if (password != "") {
        handleChange("invalidPass", false)
      } else {
        handleChange("password", "")
      }
    } else {
      handleChange("invalidPass", true)
    }
  }

  const changeLanguage = () => {
    try {
      handleChange("loading", true)
      if (i18n.currentLocale() === "en") {
        i18n.locale = "sp"
        AsyncStorage.setItem("language", "sp")
        handleChange("loading", false)
      } else {
        i18n.locale = "en"
        AsyncStorage.setItem("language", "en")
        handleChange("loading", false)
      }
    } catch (error) {}
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <View style={styles.top}>
          <SvgXml xml={logo} width={200} style={{ marginBottom: 20 }} />
          <View style={[styles.tabs, { justifyContent: "center" }]}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleChange("active", 0)}
            >
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                {isAdmin ? i18n.t("Admin Sign In") : i18n.t("Sign In")}
              </Text>
              <View style={active === 0 ? styles.activeline : styles.line} />
            </TouchableOpacity>
            {!isAdmin && (
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleChange("active", 1)}
              >
                <Text
                  style={active === 1 ? styles.activeTabText : styles.tabText}
                >
                  {i18n.t("Sign Up")}
                </Text>
                <View style={active === 1 ? styles.activeline : styles.line} />
              </TouchableOpacity>
            )}
          </View>
          {active === 0 && !isAdmin && (
            <Text style={styles.loginText}>
              {i18n.t("Sign in with your phone number")}
            </Text>
          )}
          {active === 0 ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Your phone number")}
                  placeholder={
                    isAdmin ? i18n.t("Your email") : i18n.t("Your phone number")
                  }
                  name={isAdmin ? "email" : "phone"}
                  keyboardType={isAdmin ? "email-address" : "phone-pad"}
                  prefixBGTransparent
                  value={isAdmin ? email : phone}
                  onChange={handleChange}
                />
              </View>
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Your password")}
                  placeholder={i18n.t("Your password")}
                  onBlur={checkPass}
                  fontFamily={FONT1REGULAR}
                  name={"password"}
                  postfix={
                    <TouchableOpacity
                      onPress={() =>
                        handleChange("showPassword", !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Icon
                          name={"eye-outline"}
                          color={COLORS.black}
                          type={"ionicon"}
                          size={20}
                        />
                      ) : (
                        <Icon
                          name={"eye-off-outline"}
                          color={COLORS.black}
                          type={"ionicon"}
                          size={20}
                        />
                      )}
                    </TouchableOpacity>
                  }
                  value={password}
                  onChange={handleChange}
                  secureTextEntry={!showPassword}
                />
              </View>
              {invalidPass && (
                <View style={styles.textFieldContainer}>
                  <Text style={styles.errorText}>
                    {i18n.t("Password at least 6 characters")}
                  </Text>
                </View>
              )}
              <View style={styles.buttonWidth}>
                <AppButton
                  title={i18n.t("SIGN IN")}
                  loading={loading}
                  disabled={
                    (isAdmin ? !email : !phone) || !password || invalidPass
                  }
                  onPress={handleLogin}
                />
              </View>
              {!isAdmin && (
                <View style={styles.buttonWidth}>
                  <AppButton
                    title={i18n.t("View Products")}
                    onPress={() => navigation.navigate("InventoryList")}
                  />
                </View>
              )}
              {isAdmin && (
                <View style={styles.buttonWidth}>
                  <AppButton
                    title={i18n.t("Cancel")}
                    outlined
                    onPress={() => handleChange("isAdmin", false)}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Your name")}
                  fontFamily={FONT1REGULAR}
                  placeholder={i18n.t("Your name")}
                  name={"name"}
                  value={name}
                  secureTextEntry={false}
                  onChange={handleChange}
                />
              </View>
              
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Your last name")}
                  fontFamily={FONT1REGULAR}
                  placeholder={i18n.t("Your last name")}
                  name={"last_name"}
                  value={last_name}
                  secureTextEntry={false}
                  onChange={handleChange}
                />
                
              </View>
              <View style={styles.textInputContainer}>
                <AppInput
                  fontFamily={FONT1REGULAR}
                  label={i18n.t("Your phone number")}
                  placeholder={i18n.t("Your phone number")}
                  name={"phone"}
                  keyboardType={"phone-pad"}
                  value={phone}
                  onChange={handleChange}
                />
                {/* <PhoneInput
            placeholder='Enter phone number'
            value={phone}
            onChangeText={text => handleChange('phone', text)}
          /> */}
              </View>
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Create password")}
                  fontFamily={FONT1REGULAR}
                  placeholder={i18n.t("Create password")}
                  prefixBGTransparent
                  name={"password"}
                  onBlur={checkPass}
                  postfix={
                    <TouchableOpacity
                      onPress={() =>
                        handleChange("showPassword", !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Icon
                          name={"eye-outline"}
                          color={COLORS.black}
                          type={"ionicon"}
                          size={20}
                        />
                      ) : (
                        <Icon
                          name={"eye-off-outline"}
                          color={COLORS.black}
                          type={"ionicon"}
                          size={20}
                        />
                      )}
                    </TouchableOpacity>
                  }
                  value={password}
                  onChange={handleChange}
                  secureTextEntry={!showPassword}
                />
              </View>
              {invalidPass && (
                <View style={styles.textFieldContainer}>
                  <Text style={styles.errorText}>
                    {i18n.t("Password at least 6 characters")}
                  </Text>
                </View>
              )}
              <View style={styles.textInputContainer}>
                <AppInput
                  label={i18n.t("Confirm new password")}
                  placeholder={i18n.t("Confirm new password")}
                  prefixBGTransparent
                  postfix={
                    <TouchableOpacity
                      onPress={() =>
                        handleChange(
                          "showConfirmPassword",
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <Icon name={"eye-outline"} type={"ionicon"} size={20} />
                      ) : (
                        <Icon
                          name={"eye-off-outline"}
                          color={COLORS.black}
                          type={"ionicon"}
                          size={20}
                        />
                      )}
                    </TouchableOpacity>
                  }
                  name={"confirm_password"}
                  fontFamily={FONT1REGULAR}
                  value={confirm_password}
                  onChange={handleChange}
                  secureTextEntry={!showConfirmPassword}
                />
              </View>
              {confirm_password && password !== confirm_password ? (
                <View style={styles.textFieldContainer}>
                  <Text style={styles.errorText}>
                    {i18n.t("Password doesn't match")}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "90%"
                }}
              >
                <BouncyCheckbox
                  size={25}
                  fillColor={COLORS.primary}
                  unfillColor={COLORS.white}
                  text={""}
                  iconStyle={{ borderColor: COLORS.primary, borderRadius: 0 }}
                  style={{ marginVertical: 20 }}
                  onPress={() => handleChange("isChecked", !isChecked)}
                />
                <Text
                  style={{
                    fontFamily: FONT1REGULAR,
                    color: COLORS.primary,
                    fontSize: hp(1.6),
                    textDecorationLine: "underline"
                  }}
                >
                  {i18n.t("Agree to")}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TermsCondition")}
                >
                  <Text
                    style={{
                      fontFamily: FONT1REGULAR,
                      fontSize: hp(1.6),
                      color: COLORS.primary,
                      textDecorationLine: "underline"
                    }}
                  >
                    {i18n.t("Terms & Conditions,")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  <Text
                    style={{
                      fontFamily: FONT1REGULAR,
                      fontSize: hp(1.6),
                      color: COLORS.primary,
                      textDecorationLine: "underline"
                    }}
                  >
                    {i18n.t("Privacy Policy")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWidth}>
                <AppButton
                  title={i18n.t("Sign Up")}
                  loading={loading}
                  disabled={
                    !name ||
                    !last_name ||
                    !phone ||
                    !password ||
                    !isChecked ||
                    password !== confirm_password ||
                    invalidPass
                  }
                  onPress={handleSignup}
                />
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {active === 0 && !isAdmin && (
        <>
          <View style={[styles.remeberContainer, { marginBottom: 10 }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>
                {i18n.t("Forgot Password?")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.remeberContainer, { marginBottom: 10 }]}>
            <TouchableOpacity onPress={() => handleChange("isAdmin", true)}>
              <Text style={styles.forgotText}>{i18n.t("Login as Admin?")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.remeberContainer}>
            <TouchableOpacity onPress={() => changeLanguage()}>
              <Text style={styles.forgotText}>{i18n.t("Spanish")}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRestrict}
        onRequestClose={() => {
          handleChange("showRestrict", false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text style={styles.modalText}>
              {i18n.t(
                "You can login now"
              )}
            </Text>
            {/* <Text style={styles.modalText}>{"55-6127-7889"}</Text> */}
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton
                  title={i18n.t("Ok")}
                  onPress={() => handleChange("showRestrict", false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    marginTop: 20
  },
  buttonWidth: { width: "80%", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  textInputContainer: { marginBottom: hp("2%"), width: "90%" },
  remeberContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: hp(5)
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
    fontSize: hp(2.5),
    marginBottom: 10,
    fontFamily: FONT1SEMIBOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    textAlign: "center",
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  textInput: {
    color: COLORS.inputText,
    width: "100%",
    fontSize: hp(2),
    paddingLeft: 10
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
    justifyContent: "center"
  },
  modalText: {
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  halfWidth1: {
    width: "48%"
  }
})

export default LoginScreen
