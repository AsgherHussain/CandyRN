import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../../constants'
import i18n from '../../i18n'
import AppContext from '../../store/Context'

function AuthLoading ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {
    setUser,
    _getCart,
    _getProducts,
    _getUsers,
    _getNotifications,
    _getFeedbacks,
    _getCategories,
    _getBrands,
    _getAdminProducts,
    _getAdminOrders,
    _getAdminOrdersProcess,
    _getAdminConfirmOrders,
    _getInvoices,
    _getColorsAndSizes
  } = context

  useEffect(() => {
    _bootstrapAsync()
    navigation.addListener('focus', () => {
      _bootstrapAsync()
    })
  }, [])
  const _bootstrapAsync = async () => {
    const userUID = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('user')
    const lang = await AsyncStorage.getItem('language')
    if(lang){
      i18n.locale = lang
    }else{
      i18n.locale = 'sp'
    }
    if (userUID && user) {
      const userData = JSON.parse(user)
      setUser(userData)
      _getProducts()
      _getCart()
      _getUsers()
      _getCategories()
      _getBrands()
      if (userData?.is_admin) {
        _getNotifications()
        _getFeedbacks()
        _getAdminProducts('')
        _getAdminOrdersProcess()
        _getAdminOrders('')
        _getAdminOrders('?half_pack=True', true)
        _getAdminConfirmOrders()
        _getInvoices()
        _getColorsAndSizes()
        navigation.navigate('AdminPanel')
        return
      }
      if (!userData?.profile?.city) {
        navigation.navigate('Profile')
      } else {
        navigation.navigate('MainTabNav')
      }
    } else {
      navigation.navigate('Login')
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default AuthLoading
