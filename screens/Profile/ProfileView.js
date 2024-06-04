import React, { useState, useContext } from 'react'
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
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import { updateProfile } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../store/Context'
import leftIcon from '../../assets/svg/left.svg'
import Toast from 'react-native-simple-toast'
import { SvgXml } from 'react-native-svg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import profileIcon from '../../assets/images/profile.png'
import ImagePicker from 'react-native-image-crop-picker'
import i18n from '../../i18n'
import { Modal } from 'react-native'

function ProfileView ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { user } = context

  const [state, setState] = useState({
    name: user?.name,
    last_name: user?.last_name,
    email: user?.email,
    shipping_address: user?.profile?.shipping_address || '',
    city: user?.profile?.city || '',
    zip_code: user?.profile?.zip_code || '',
    selectState: user?.profile?.state || '',
    country: user?.profile?.country || '',
    avatarSourceURL: user?.profile?.photo || '',
    photo: null,
    isUpdate: false,
    modal: false
  })

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
    modal
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
          handleChange('modal', false)
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
      formData.append('last_name', last_name)
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
      Toast.show(i18n.t(`Your profile has been updated!`))
      handleChange('isUpdate', false)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t('Error')}: ${JSON.stringify(errorText[0])}`)
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%'
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
              {user?.name + ' ' + user?.last_name}
            </Text>
            <View style={styles.activeline} />
          </View>
          <View style={{ width: '10%' }} />
        </View>
        <TouchableOpacity
          onPress={() =>
            isUpdate ? handleChange('modal', true) : console.log()
          }
          style={styles.userView}
        >
          <Image
            source={avatarSourceURL ? { uri: avatarSourceURL } : profileIcon}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange('isUpdate', !isUpdate)}>
          <Text style={styles.name}>{i18n.t('Edit Profile')}</Text>
        </TouchableOpacity>
        {isUpdate ? (
          <>
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
                label={i18n.t('Last name')}
                placeholder={i18n.t('Last name')}
                name={'last_name'}
                prefixBGTransparent
                value={last_name}
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
                disabled={
                  !name || !city || !zip_code || !selectState || !country
                }
                onPress={handleProfile}
              />
            </View>
          </>
        ) : (
          <View style={{ width: '90%', marginTop: 20 }}>
            <Text style={styles.name}>
              {i18n.t('Shipping Address')}: {shipping_address}
            </Text>
            <Text style={styles.name}>
              {i18n.t('Full name')}: {name + ' ' + last_name}
            </Text>
            <Text style={styles.name}>
              {i18n.t('City')}: {city}
            </Text>
            <Text style={styles.name}>
              {i18n.t('ZIP')}: {zip_code}
            </Text>
            <Text style={styles.name}>
              {i18n.t('State')}: {selectState}
            </Text>
            <Text style={styles.name}>
              {i18n.t('Country')}: {country}
            </Text>
            <Text style={styles.name}>
              {i18n.t('Email')}: {email}
            </Text>
          </View>
        )}
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          handleChange('modal', false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Text style={styles.modalText}>{i18n.t('Select Option')}</Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton
                  title={i18n.t('Open Camera')}
                  onPress={() => _uploadImage('camera')}
                />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={i18n.t('Open Gallery')}
                  outlined
                  backgroundColor={COLORS.white}
                  onPress={() => _uploadImage('gallery')}
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
  menuView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 45
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
    textTransform: 'capitalize',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.modalBG
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: 20,
    paddingVertical: 50,
    elevation: 5
  },
  rowAround: {
    width: '100%',
    marginVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontFamily: FONT1BOLD,
    fontSize: hp(4),
    marginBottom: 20
  },
  halfWidth1: {
    width: '48%'
  }
})

export default ProfileView
