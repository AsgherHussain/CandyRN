import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, Header, CartCard } from '../../components'
import {
  COLORS,
  FONT1BOLD,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  FONT2REGULAR
} from '../../constants'
import AppContext from '../../store/Context'
import { useFocusEffect } from '@react-navigation/native'
import { removeItemFromCart, submitToCart } from '../../api/customer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import i18n from '../../i18n'

function Cart ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { cartLoading, cart, _getCart } = context
  const [state, setState] = useState({
    date: Date.now(),
    loading: false
  })
  const [isFlagUser, setIsFlagUser] = useState(false)
  const [reservationModal, setReservationModal] = useState(false)
  const { loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const getUserType = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("user")
      const parsedUserDetails = JSON.parse(userDetails)
      setIsFlagUser(parsedUserDetails?.flagged)
    } catch (error) {
      __DEV__ && console.error("Error retrieving user details:", error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      _getCart()
      getUserType()
    }, [])
  )

  const handleRemoveItem = async id => {
    try {
      handleChange('loading', true)
      const payload = {
        item: id
      }
      const token = await AsyncStorage.getItem('token')
      await removeItemFromCart(payload, token)
      Toast.show(i18n.t(`Product removed from the cart!`))
      _getCart()
      handleChange('loading', false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange('loading', false)
      Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
    }
  }

  const _submitToCart = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      await submitToCart(token)
      if (isFlagUser) {
        setReservationModal(true)
      } else {
        Toast.show(i18n.t(`Your order has been submitted!`))
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    } finally {
      _getCart()
      handleChange("loading", false)
    }
  }

  console.warn('cart[0]?.orders', cart[0]?.orders)

  return (
    <View style={styles.container}>
      <Header back tab titleUpp tabText={i18n.t('Cart')} rightEmpty />
      {cartLoading && (
        <ActivityIndicator size={'small'} color={COLORS.primary} />
      )}
      <FlatList
        data={
          (cart?.length > 0 &&
            cart[0]?.orders?.length > 0 &&
            cart[0]?.orders) ||
          []
        }
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        keyExtractor={(item, index) => item?.product?.sid + index}
        ListEmptyComponent={() => {
          return (
            <Text
              style={{
                fontFamily: FONT1REGULAR,
                color: COLORS.primary,
                textAlign: 'center'
              }}
            >
              {i18n.t('Cart is empty')}
            </Text>
          )
        }}
        renderItem={({ item, index }) => {
          return (
            <CartCard
              key={index}
              item={item}
              handleRemoveItem={handleRemoveItem}
            />
          )
        }}
      />
      <View style={styles.hline} />
      <Text style={styles.totalprice}>
        {i18n.t('total price')}: ${cart?.length > 0 && cart[0]?.total}
      </Text>
      <View style={styles.buttonWidth}>
        <AppButton
          title={isFlagUser ? i18n.t("RESERVE") : i18n.t("BUY")}
          loading={loading}
          onPress={_submitToCart}
          disabled={cart[0].orders?.length > 0 ? false : true}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={reservationModal}
        onRequestClose={() => {
          setReservationModal(false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text style={styles.modalText}>{i18n.t("Reserve Modal Text")}</Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton
                  title={i18n.t("Ok")}
                  onPress={() => setReservationModal(false)}
                  backgroundColor={"#fff"}
                  outlined={true}
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
    width: '100%',
    alignItems: 'center'
  },
  buttonWidth: {
    width: '80%',
    marginBottom: 20
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
  row: {
    flexDirection: 'row',
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
  flatList: {
    width: '90%'
  },
  rowAround: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center'
  },
  totalprice: {
    color: COLORS.totalprice,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginBottom: 30,
    marginTop: 10,
    width: '90%',
    textAlign: 'right'
  },
  hline: {
    width: '90%',
    height: 1,
    backgroundColor: COLORS.primary,
    marginTop: 20
  },
  modalView: {
    width: "90%",
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 20,
    paddingVertical: 25,
    paddingBottom:10,
    elevation: 5
  },
  rowAround: {
    width: "100%",
    marginVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  modalText: {
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: FONT1BOLD,
    fontSize: hp(3.5)
  },
  halfWidth1: {
    width: "48%"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.modalBG
  },
})

export default Cart
