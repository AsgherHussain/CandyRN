import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, AppInput, Header } from '../../components'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import AppContext from '../../store/Context'
import moment from 'moment'
import UserProfile from '../../assets/images/profile.png'
import momenttimezone from 'moment-timezone'
import { sendFeedbackResponse } from '../../api/admin'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from '../../i18n'

function AdminFeedback ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { users, _getFeedbacks, feedbacks } = context
  const [state, setState] = useState({
    loading: false,
    loadingFeedback: false,
    filteredList: users || [],
    saerchText: ''
  })

  useEffect(() => {
    if (users) {
      handleChange('filteredList', users)
    }
  }, [users])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const { loading, loadingFeedback } = state

  const handleSend = async (id, value, index) => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loadingFeedback', true)
      const payload = {
        title: i18n.t('Thanks for the Review!'),
        feedback: id,
        body: value
      }
      await sendFeedbackResponse(payload, token)
      _getFeedbacks()
      handleChange('loadingFeedback', false)
      handleChange(`value${index}`, '')
      Toast.show(i18n.t('Respond feedback successfully!'))
    } catch (error) {
      handleChange('loadingFeedback', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
      } else {
        Toast.show(`${i18n.t('Error')}: ${error}`)
      }
    }
  }

  function convertLocalDateToUTCDate (time, toLocal) {
    const todayDate = moment(new Date()).format('YYYY-MM-DD')
    if (toLocal) {
      const today = momenttimezone.tz.guess()
      const timeUTC = momenttimezone.tz(time, today).format()
      let date = new Date(timeUTC)
      const milliseconds = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
      const localTime = new Date(milliseconds)
      const todayDate1 = momenttimezone.tz(localTime, today).fromNow()
      return todayDate1
    } else {
      const today = momenttimezone.tz.guess()
      const todayDate1 = momenttimezone
        .tz(`${todayDate} ${time}`, today)
        .format()
      const utcTime = moment.utc(todayDate1).format('YYYY-MM-DDTHH:mm')
      return utcTime
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header back tab tabText={i18n.t('Feedback')} rightEmpty />
      <View style={styles.mainBody}>
        <FlatList
          data={feedbacks}
          style={{ width: '100%', height: '80%' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <>
                <View key={index} style={styles.listContainer}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <Image
                        style={styles.listImage}
                        source={
                          item?.user?.profile?.photo
                            ? { uri: item?.user?.profile?.photo }
                            : UserProfile
                        }
                      />
                      <Text style={styles.title}>{item?.user?.name}</Text>
                    </View>
                    <Text style={styles.time}>
                      {convertLocalDateToUTCDate(item?.created_at, true)}
                    </Text>
                  </View>
                  <Text style={styles.content}>{item?.content}</Text>
                </View>
                <View style={styles.sendFeedback}>
                  <AppInput
                    placeholder={i18n.t('Enter response...')}
                    multiline
                    name={`value${index}`}
                    value={state[`value${index}`]}
                    onChange={handleChange}
                    height={100}
                  />
                  <View style={styles.buttonWidth}>
                    <AppButton
                      disabled={!state[`value${index}`] || loadingFeedback}
                      title={i18n.t('SEND')}
                      onPress={() =>
                        handleSend(item?.id, state[`value${index}`], index)
                      }
                    />
                  </View>
                </View>
              </>
            )
          }}
        />
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
    width: '100%',
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR
  },
  sendFeedback: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.primary
  },
  buttonWidth: {
    width: '80%'
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
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  listImage: {
    width: 50,
    borderRadius: 50,
    height: 50,
    marginRight: 10
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
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})

export default AdminFeedback
