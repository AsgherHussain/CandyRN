import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, AppInput, Header } from '../../components'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import AppContext from '../../store/Context'
import { createNotifications } from '../../api/admin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import i18n from '../../i18n'

function CreateNotification ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { _getNotifications } = context
  const [state, setState] = useState({
    loading: false,
    content: '',
    title: ''
  })

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)
      const payload = {
        title,
        content
      }
      await createNotifications(payload, token)
      _getNotifications()
      handleChange('loading', false)
      navigation.navigate('Notifications')
      Toast.show(i18n.t('Notification successfully created!'))
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
      } else {
        Toast.show(`${i18n.t('Error')}: ${error}`)
      }
    }
  }

  const { loading, title, content } = state

  return (
    <View style={styles.container}>
      <Header
        back
        tab
        tabText={i18n.t('Create Push Notifications')}
        rightEmpty
      />
      <View style={styles.mainBody}>
        <AppInput
          placeholder={i18n.t('Notification name')}
          name={'title'}
          value={title}
          onChange={handleChange}
        />
        <AppInput
          placeholder={i18n.t('Notification Content')}
          name={'content'}
          height={150}
          multiline
          value={content}
          onChange={handleChange}
        />
        <View style={styles.buttonWidth}>
          <AppButton
            title={i18n.t('CREATE NOTIFICATION')}
            loading={loading}
            disabled={!title || !content}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  mainBody: {
    width: '90%',
    height: '85%',
    alignItems: 'center'
  },
  title: {
    color: COLORS.darkBlack,
    fontSize: hp(2.8),
    fontFamily: FONT1SEMIBOLD
  },
  time: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  content: {
    color: COLORS.darkBlack,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR
  },
  buttonWidth: {
    width: '80%',
    marginTop: 20
  },
  activeTabText: {
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  listContainer: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginLeft: 10
  },
  rowBetween: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default CreateNotification
