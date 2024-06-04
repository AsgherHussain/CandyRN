import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { validateEmail } from '../../utils/ValidateEmail'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import Toast from 'react-native-simple-toast'
import { forgotpassword, resendOTP } from '../../api/auth'
import AppContext from '../../store/Context'
import { Icon } from 'react-native-elements'
import logo from '../../assets/svg/logo.svg'
import i18n from '../../i18n'

function ForgotPassword ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setIsForgot } = context

  // State
  const [state, setState] = useState({
    phone: '',
    isEmailValid: false,
    loading: false
  })

  const { phone, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const onSubmit = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        phone
      }
      const res = await forgotpassword(payload)
      handleChange('loading', false)
      Toast.show(`${i18n.t('OTP has been sent to')} ${phone}`)
      navigation.navigate('Verification', { phone })
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
      } else {
        Toast.show(`${i18n.t('Error')}: ${error.message}`)
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SvgXml xml={logo} width={200} style={{ marginBottom: 20 }} />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleChange('active', 0)}
        >
          <Text style={styles.activeTabText}>{i18n.t('Forgot Password')}</Text>
          <View style={styles.activeline} />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Your phone number')}
            placeholder={i18n.t('Your phone number')}
            keyboardType={'phone-pad'}
            name={'phone'}
            prefixBGTransparent
            value={phone}
            onChange={handleChange}
          />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            title={i18n.t('SEND CODE TO PHONE')}
            loading={loading}
            disabled={!phone}
            onPress={() => onSubmit()}
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
  header: { width: '90%', marginBottom: '10%' },
  buttonWidth: { width: '80%', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  hLine: { height: 1, width: 100, backgroundColor: COLORS.grey },
  textInputContainer: {
    marginBottom: hp('2%'),
    marginTop: hp('5%'),
    width: '90%'
  },
  remeberContainer: {
    alignItems: 'flex-end',
    width: '90%',
    marginBottom: hp('2%')
  },
  forgotText: { color: COLORS.black, fontFamily: FONT1REGULAR },
  orText: {
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    marginHorizontal: 10
  },
  invalid: {
    color: COLORS.alertButon,
    fontFamily: FONT1REGULAR
  },
  loginText: {
    color: COLORS.black,
    width: '90%',
    fontSize: hp('4%'),
    fontFamily: FONT1BOLD
  },
  lightText: {
    color: COLORS.black,
    width: '90%',
    lineHeight: 22,
    fontFamily: FONT1REGULAR
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

export default ForgotPassword
