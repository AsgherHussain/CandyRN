import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import { setPassword } from '../../api/auth'
import Toast from 'react-native-simple-toast'
import logo from '../../assets/svg/logo.svg'
import i18n from '../../i18n'

function SetPasswrod ({ navigation, route }) {
  // State
  const [state, setState] = useState({
    password: '',
    confirm_password: '',
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    invalidPass: false
  })

  const {
    loading,
    showPassword,
    showConfirmPassword,
    confirm_password,
    password,
    invalidPass
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handlePassword = async () => {
    try {
      const token = route?.params?.token
      handleChange('loading', true)
      const payload = {
        password_1: password,
        password_2: confirm_password
      }
      const res = await setPassword(payload, token)
      handleChange('loading', false)
      navigation.navigate('Login')
      Toast.show(res?.data?.detail)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`${i18n.t('Error')}: ${errorText}`)
    }
  }

  const checkPass = () => {
    const regex = /^.{6,}$/
    if (regex.test(password)) {
      if (password != '') {
        handleChange('invalidPass', false)
      } else {
        handleChange('password', '')
      }
    } else {
      handleChange('invalidPass', true)
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SvgXml xml={logo} width={200} style={{ marginBottom: 20 }} />
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('Set New Password')}</Text>
          <View style={styles.activeline} />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Create new password')}
            placeholder={i18n.t('Create new password')}
            name={'password'}
            value={password}
            prefixBGTransparent
            onBlur={checkPass}
            postfix={
              <TouchableOpacity
                onPress={() => handleChange('showPassword', !showPassword)}
              >
                {showPassword ? (
                  <Icon name={'eye-outline'} type={'ionicon'} size={20} />
                ) : (
                  <Icon
                    name={'eye-off-outline'}
                    color={COLORS.black}
                    type={'ionicon'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            }
            onChange={handleChange}
            secureTextEntry={!showPassword}
          />
        </View>
        {invalidPass && (
          <View style={styles.textFieldContainer}>
            <Text style={styles.errorText}>
              {i18n.t('Password at least 6 characters')}
            </Text>
          </View>
        )}
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Confirm new password')}
            placeholder={i18n.t('Confirm new password')}
            prefixBGTransparent
            postfix={
              <TouchableOpacity
                onPress={() =>
                  handleChange('showConfirmPassword', !showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <Icon name={'eye-outline'} type={'ionicon'} size={20} />
                ) : (
                  <Icon
                    name={'eye-off-outline'}
                    color={COLORS.black}
                    type={'ionicon'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            }
            name={'confirm_password'}
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
        <View style={styles.buttonWidth}>
          <AppButton
            title={i18n.t('SUBMIT')}
            loading={loading}
            disabled={
              !password ||
              !confirm_password | (password !== confirm_password) ||
              invalidPass
            }
            onPress={handlePassword}
          />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            outlined
            title={i18n.t('CANCEL')}
            backgroundColor={COLORS.white}
            color={COLORS.primary}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  backContainer: { width: '90%', alignItems: 'flex-start', marginBottom: 30 },

  textFieldContainer: { width: '90%', marginBottom: 10 },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6'
  },
  resendView: { width: '80%' },
  buttonWidth: { width: '80%', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  hLine: { height: 1, width: 100, backgroundColor: COLORS.grey },
  textInputContainer: { marginBottom: hp('2%'), width: '90%' },
  loginText: {
    color: COLORS.black,
    width: '90%',
    fontSize: hp('4%'),
    fontFamily: FONT1BOLD
  },
  dontacount: { color: COLORS.darkGrey },
  checkedBox: {
    backgroundColor: 'transparent',
    marginBottom: -10,
    borderWidth: 0,
    width: '100%'
  },
  lightText: {
    color: COLORS.black,
    textAlign: 'center',
    width: '80%',
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.5,
    fontFamily: FONT1REGULAR
  },
  signUp: { color: COLORS.darkBlack, textDecorationLine: 'underline' },
  errorText: {
    fontFamily: FONT1REGULAR,
    color: COLORS.alertButon
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tab: {
    width: '60%',
    marginBottom: 20,
    alignItems: 'center'
  }
})

export default SetPasswrod
