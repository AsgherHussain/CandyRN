import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import { loginUser, signupUser, updateProfile } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../store/Context'
import Toast from 'react-native-simple-toast'
import { SvgXml } from 'react-native-svg'
import logo from '../../assets/svg/logo.svg'
import PhoneInput from 'react-native-phone-number-input'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import profileIcon from '../../assets/images/profile.png'
import ImagePicker from 'react-native-image-crop-picker'
import i18n from '../../i18n'

function Profile ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setUser, user } = context

  const [state, setState] = useState({
    name: user?.name,
    email: user?.email,
    shipping_address: '',
    city: '',
    zip_code: '',
    selectState: '',
    country: '',
    avatarSourceURL: '',
    photo: null
  })

  const {
    loading,
    phone,
    email,
    name,
    shipping_address,
    city,
    zip_code,
    selectState,
    country,
    avatarSourceURL,
    photo
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _uploadImage = async type => {
    handleChange('uploading', true)
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      cropping: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange('uploading', false)
        } else {
          const uri = response.path
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          const photo = {
            uri: uploadUri,
            name: 'userimage1.png',
            type: response.mime
          }
          handleChange('avatarSourceURL', uploadUri)
          handleChange('photo', photo)
          handleChange('uploading', false)
          Toast.show(i18n.t('Profile Add Successfully'))
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const handleProfile = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const user_id = user?.id
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      photo && formData.append('profile.photo', photo)
      formData.append('profile.shipping_address', shipping_address)
      formData.append('profile.city', city)
      formData.append('profile.zip_code', zip_code)
      formData.append('profile.state', selectState)
      formData.append('profile.country', country)
      const res = await updateProfile(formData, user_id, token)
      context?.setUser(res?.data)
      await AsyncStorage.setItem('user', JSON.stringify(res?.data))
      handleChange('loading', false)
      navigation.navigate('AuthLoading')
      Toast.show(i18n.t(`Your profile has been updated!`))
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t('Error')}: ${JSON.stringify(errorText[0])}`)
    }
  }

  const checkPass = () => {
    const regex = /^.{5,}$/
    if (regex.test(zip_code)) {
      if (zip_code != '') {
        handleChange('invalidPass', false)
      } else {
        handleChange('zip_code', '')
      }
    } else {
      handleChange('zip_code', '')
      alert(i18n.t('Invalid zip code'))
      handleChange('invalidPass', true)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <View style={styles.top}>
        <SvgXml xml={logo} width={200} style={{ marginBottom: 20 }} />
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('Create Profile')}</Text>
          <View style={styles.activeline} />
        </View>
        <TouchableOpacity onPress={_uploadImage} style={styles.userView}>
          <Image
            source={avatarSourceURL ? { uri: avatarSourceURL } : profileIcon}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{i18n.t('Upload photo')}</Text>
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Full name')}
            placeholder={i18n.t('Full name')}
            name={'name'}
            prefixBGTransparent
            value={name}
            onChange={handleChange}
          />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Email (optional)')}
            placeholder={i18n.t('Email (optional)')}
            name={'email'}
            prefixBGTransparent
            value={email}
            onChange={handleChange}
          />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Shipping address (optional)')}
            placeholder={i18n.t('Shipping address (optional)')}
            name={'shipping_address'}
            prefixBGTransparent
            value={shipping_address}
            onChange={handleChange}
          />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('City')}
            placeholder={i18n.t('City')}
            name={'city'}
            prefixBGTransparent
            value={city}
            onChange={handleChange}
          />
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.textInputContainerHalf}>
            <AppInput
              label={i18n.t('ZIP code')}
              placeholder={i18n.t('ZIP code')}
              name={'zip_code'}
              keyboardType={'phone-pad'}
              prefixBGTransparent
              value={zip_code}
              onBlur={checkPass}
              onChange={handleChange}
            />
          </View>
          <View style={styles.textInputContainerHalf}>
            <AppInput
              label={i18n.t('State')}
              placeholder={i18n.t('State')}
              name={'selectState'}
              prefixBGTransparent
              value={selectState}
              onChange={handleChange}
            />
          </View>
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={i18n.t('Country (MEX)')}
            placeholder={i18n.t('Country (MEX)')}
            name={'country'}
            prefixBGTransparent
            value={country}
            onChange={handleChange}
          />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            title={i18n.t('CONFIRM')}
            loading={loading}
            disabled={!name || !city || !zip_code || !selectState || !country}
            onPress={handleProfile}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  buttonWidth: { width: '80%', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  textInputContainer: { marginBottom: hp('2%'), width: '90%' },
  textInputContainerHalf: { marginBottom: hp('2%'), width: '48%' },
  remeberContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: hp(5)
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD,
    textDecorationLine: 'underline'
  },
  signUpText: {
    marginTop: 20
  },
  loginText: {
    color: COLORS.black,
    fontSize: hp(2.5),
    marginBottom: '5%',
    fontFamily: FONT1REGULAR
  },
  backContainer: { width: '90%', alignItems: 'flex-start', marginBottom: 30 },
  signUp: {
    color: COLORS.secondary,
    fontFamily: FONT1BOLD,
    textDecorationLine: 'underline'
  },
  line: {
    width: '100%',
    backgroundColor: COLORS.grey,
    height: 5
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tabs: {
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tab: {
    width: '50%',
    alignItems: 'center'
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
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  userView: {
    alignItems: 'center',
    marginVertical: 30
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80
  },
  name: {
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  }
})

export default Profile
