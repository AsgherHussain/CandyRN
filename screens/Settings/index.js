import React, { useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import profileIcon from '../../assets/images/profile.png'
import { SvgXml } from 'react-native-svg'
import leftIcon from '../../assets/svg/left.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../store/Context'
import i18n from '../../i18n'
import Toast from 'react-native-simple-toast'
import { deleteProfile } from '../../api/auth'

function Settings ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const setUser = context?.setUser
  const user = context?.user
  // State
  const [state, setState] = useState({
    showLogout: false,
    showdelete: false,
    loadingDelete: false
  })

  const { showLogout, showdelete, loadingDelete } = state
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    navigation.navigate('AuthLoading')
  }

  const _deleteProfile = async () => {
    try {
      handleChange('loadingDelete', true)
      const token = await AsyncStorage.getItem('token')
      const user_id = user?.id
      await deleteProfile(user_id, token)
      logout()
      handleChange('loadingDelete', false)
      handleChange('showdelete', false)
      Toast.show(i18n.t(`Your account has been deleted`))
    } catch (error) {
      handleChange('loadingDelete', false)
      const errorText = Object.values(error.response?.data)
      Toast.show(`${i18n.t('Error')}: ${JSON.stringify(errorText[0])}`)
    }
  }

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const list = [
    { title: i18n.t('Privacy Policy'), route: 'PrivacyPolicy' },
    { title: i18n.t('Terms & Conditions'), route: 'TermsCondition' },
    { title: i18n.t('Send Feedback'), route: 'FeedBack' },
    { title: i18n.t('Delete Account'), route: '' }
  ]

  return (
    <View style={styles.container}>
      <Header back tab titleUpp tabText={i18n.t('Settings')} rightEmpty />
      <View style={styles.mainBody}>
        <View style={styles.userView}>
          <Image
            source={
              user?.profile?.photo ? { uri: user?.profile?.photo } : profileIcon
            }
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ProfileView')}>
            <Text style={styles.name}>
              {user?.name + ' ' + user?.last_name}
            </Text>
          </TouchableOpacity>
        </View>
        {list.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listView}
            onPress={() =>
              item?.title === i18n.t('Delete Account')
                ? handleChange('showdelete', true)
                : navigation.navigate(item?.route)
            }
          >
            <Text
              style={[
                styles.listTitle,
                {
                  color:
                    item?.title === i18n.t('Delete Account')
                      ? COLORS.darkRed
                      : COLORS.primary
                }
              ]}
            >
              {item.title}
            </Text>
            {item?.route !== '' && (
              <SvgXml
                xml={leftIcon}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          marginTop={hp(5)}
          title={i18n.t('Log Out')}
          onPress={() => handleChange('showLogout', true)}
        />
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showLogout}
        onRequestClose={() => {
          handleChange('showLogout', false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Text style={styles.modalText}>{i18n.t('Are you sure?')}</Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton title={i18n.t('Yes')} onPress={logout} />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={i18n.t('No')}
                  outlined
                  backgroundColor={COLORS.white}
                  onPress={() => handleChange('showLogout', false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showdelete}
        onRequestClose={() => {
          handleChange('showdelete', false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Text style={styles.modalText}>{i18n.t('Are you sure?')}</Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton
                  title={i18n.t('Yes')}
                  loading={loadingDelete}
                  onPress={_deleteProfile}
                />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={i18n.t('No')}
                  outlined
                  backgroundColor={COLORS.white}
                  onPress={() => handleChange('showdelete', false)}
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
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center'
  },
  mainBody: {
    width: '90%'
  },
  buttonWidth: {
    marginBottom: 20,
    width: '80%'
  },
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginRight: 10
  },
  name: {
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50
  },
  listTitle: {
    fontFamily: FONT1SEMIBOLD,
    fontSize: hp(2.8)
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

export default Settings
