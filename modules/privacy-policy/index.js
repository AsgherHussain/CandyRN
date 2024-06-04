import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import {
  getAdminConfirmOrders,
  getAdminOrders,
  getAdminProducts,
  getBrands,
  getCategories,
  getColors,
  getFeedbacks,
  getInvoices,
  getNotifications,
  getSizes,
  getUserOrders,
  getUsers
} from '../../api/admin'
import { getCart, getMyOrders, getProducts } from '../../api/customer'
import RootStackNav from '../../navigation/RootStackNav'
import AppContext from '../../store/Context'

function AppMenu () {
  const [productLoading, setProductLoading] = useState(false)
  const [user, setUser] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [users, setUsers] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [adminProducts, setAdminProducts] = useState([])
  const [adminOrders, setAdminOrders] = useState([])
  const [catalogAdminProducts, setCatalogAdminProducts] = useState([])
  const [adminOrdersProcessing, setAdminOrdersProcessing] = useState([])
  const [adminOrdersHalf, setAdminOrdersHalf] = useState([])
  const [adminOrdersConfirm, setAdminOrdersConfirm] = useState([])
  const [adminOrdersActive, setAdminOrdersActive] = useState([])
  const [adminOrdersHistory, setAdminOrdersHistory] = useState([])
  const [myOrdersCompleted, setMyOrdersCompleted] = useState([])
  const [myOrders, setMyOrders] = useState([])
  const [allInvoices, setAllInvoices] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])

  const _getProducts = async payload => {
    try {
      setProductLoading(true)
      const queryParams = payload ? payload : ''
      const token = await AsyncStorage.getItem('token')
      const res = await getProducts(queryParams, token)
      setProducts(res?.data)
      setProductLoading(false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      setProductLoading(false)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getCart = async () => {
    try {
      setCartLoading(true)
      const token = await AsyncStorage.getItem('token')
      const res = await getCart(token)
      setCart(res?.data)
      setCartLoading(false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      setCartLoading(false)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getUsers = async payload => {
    try {
      const body = payload || ''
      const token = await AsyncStorage.getItem('token')
      const res = await getUsers(body, token)
      setUsers(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getNotifications(token)
      setNotifications(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getFeedbacks(token)
      setFeedbacks(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getCategories(token)
      setCategories(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getBrands = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getBrands(token)
      setBrands(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminProducts = async (payload, inventory) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const body = payload ? payload : ''
      const res = await getAdminProducts(body, token)
      if (inventory) {
        setAdminProducts(res?.data)
      } else {
        setCatalogAdminProducts(res?.data)
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminOrders = async (payload, half_pack) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const body = payload ? payload : ''
      const res = await getAdminOrders(body, token)
      if (half_pack) {
        setAdminOrdersHalf(res?.data)
      } else {
        setAdminOrders(res?.data)
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminOrdersProcess = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const body = '?processing=True'
      const res = await getAdminOrders(body, token)
      setAdminOrdersProcessing(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getUserOrders = async (payload, history) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const body = payload ? payload : ''
      const res = await getUserOrders(body, token)
      if (history) {
        setAdminOrdersHistory(res?.data)
      } else {
        setAdminOrdersActive(res?.data)
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAdminConfirmOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getAdminConfirmOrders(token)
      setAdminOrdersConfirm(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getMyOrders = async (payload, completed) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const body = payload ? payload : ''
      const res = await getMyOrders(body, token)
      if (completed) {
        setMyOrdersCompleted(res?.data?.reverse())
      } else {
        setMyOrders(res?.data)
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getInvoices = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getInvoices(token)
      setAllInvoices(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }
  const _getColorsAndSizes = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const colors = await getColors(token)
      const sizes = await getSizes(token)
      setColors(colors?.data)
      setSizes(sizes?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        products,
        _getProducts,
        productLoading,
        cartLoading,
        cart,
        _getCart,
        users,
        _getUsers,
        notifications,
        _getNotifications,
        feedbacks,
        _getFeedbacks,
        categories,
        _getCategories,
        brands,
        _getBrands,
        adminProducts,
        catalogAdminProducts,
        _getAdminProducts,
        adminOrders,
        adminOrdersHalf,
        adminOrdersConfirm,
        adminOrdersActive,
        adminOrdersHistory,
        _getAdminOrders,
        myOrders,
        myOrdersCompleted,
        _getMyOrders,
        _getAdminConfirmOrders,
        _getUserOrders,
        allInvoices,
        _getInvoices,
        _getColorsAndSizes,
        colors,
        sizes,
        adminOrdersProcessing,
        _getAdminOrdersProcess
      }}
    >
      <RootStackNav />
    </AppContext.Provider>
  )
}

export default {
  title: 'AppMenu',
  navigator: AppMenu
}
