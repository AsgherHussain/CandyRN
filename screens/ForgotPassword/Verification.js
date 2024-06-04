import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton } from '../../components'
import { verifyEmail, forgotpassword } from '../../api/auth'
import AppContext from '../../store/Context'
import Toast from 'react-native-simple-toast'
import { Icon } from 'react-native-elements'
import logo from '../../assets/svg/logo.svg'
import { SvgXml } from 'react-native-svg'
import i18n from '../../i18n'

function Verification ({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const { setUser, isForgot } = context

  // State
  const [state, setState] = useState({
    otp: '',
    loading: false
  })

  const { otp, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleVerify = async () => {
    try {
      handleChange('loading', true)
      const phone = route?.params.phone
      const payload = {
        phone,
        otp
      }
      const res = await verifyEmail(payload)
      if (res?.status === 200) {
        handleChange('loading', false)
        navigation.navigate('SetPasswrod', { token: res?.data?.token })
        // navigation.navigate('SetPasswrod')
        Toast.show(i18n.t('Setup new password!'))
      } else {
        handleChange('loading', false)
        Toast.show(i18n.t('Something went wrong!'))
      }
    } catch (error) {
      handleChange('loading', false)
      Toast.show(i18n.t(`Error: Invalid OTP!`))
    }
  }

  const handleResendOTP = async () => {
    try {
      handleChange('loading', true)
      const phone = route?.params.phone
      const payload = {
        phone
      }
      const res = await forgotpassword(payload)
      if (res?.status === 200) {
        handleChange('loading', false)
        Toast.show(`${i18n.t('OTP has been sent to')} ${phone}`)
      } else {
        handleChange('loading', false)
        Toast.show(i18n.t('Something went wrong!'))
      }
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`${i18n.t('Error')}: ${error.message}`)
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
          <Text style={styles.activeTabText}>{i18n.t('Enter Code')}</Text>
          <View style={styles.activeline} />
        </View>
        <View style={styles.otpContainer}>
          <OTPInputView
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            placeholderTextColor={COLORS.primary}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={otp => {
              handleChange('otp', otp)
            }}
            secureTextEntry
            style={{
              width: '50%',
              backgroundColor: COLORS.white,
              height: 40
            }}
          />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            title={i18n.t('SUBMIT')}
            loading={loading}
            disabled={!otp}
            onPress={handleVerify}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.resendView}>
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.forgotText}>
              {i18n.t('Haven’t received it?')}{' '}
              <Text style={styles.signUp}>{i18n.t('Resend OTP!')}</Text>
            </Text>
          </TouchableOpacity>
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
  underlineStyleBase: {
    // borderRadius: 10,
    height: 40,
    borderWidth: 0,
    color: COLORS.primary,
    fontFamily: FONT1REGULAR,
    fontSize: hp('3%')
  },
  underlineStyleHighLighted: {
    borderWidth: 0
  },
  resendView: { marginTop: hp('5%'), width: '90%', alignItems: 'center' },
  buttonWidth: { width: '80%', marginBottom: 20 },
  forgotText: {
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    marginTop: -5,
    marginLeft: 8
  },
  loginText: {
    color: COLORS.black,
    width: '90%',
    fontSize: hp('4%'),
    fontFamily: FONT1BOLD
  },
  bottom: {
    marginBottom: hp('5%')
  },
  otpContainer: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
    height: 50,
    borderRadius: 10,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  keyIcon: {
    marginHorizontal: 10
  },
  signUp: {
    color: COLORS.black,
    fontFamily: FONT1BOLD,
    textDecorationLine: 'underline'
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
    alignItems: 'center'
  }
})

export default Verification
