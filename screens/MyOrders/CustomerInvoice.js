import React, { useCallback, useContext, useState } from 'react'
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, AppInput, Header } from '../../components'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import ProductImage from '../../assets/images/product.png'
import uploadImage from '../../assets/svg/uploadImage.svg'
import { SvgXml } from 'react-native-svg'
import { getInvoiceDetails, sendInvoice, updateInvoice } from '../../api/admin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import moment from 'moment'
import AppContext from '../../store/Context'
import ImagePicker from 'react-native-image-crop-picker'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import { useFocusEffect } from '@react-navigation/native'
import i18n from '../../i18n'

export default function CustomerInvoice ({ navigation, route }) {
  const data = route?.params?.data
  // Context
  const context = useContext(AppContext)
  const { _getInvoices } = context
  const [state, setState] = useState({
    loading: false,
    loadingEdit: false,
    active: 0,
    orderData: route?.params?.data || null,
    tracking_number_id: route?.params?.data?.tracking_number_id,
    discount: route?.params?.data?.discount,
    shipping_cost: route?.params?.data?.shipping_cost,
    packing_video: null
  })

  const {
    loading,
    loadingConfirm,
    orderData,
    tracking_number_id,
    shipping_cost,
    discount,
    loadingEdit,
    packing_video
  } = state

  useFocusEffect(
    useCallback(() => {
      if (data) {
        _getInvoiceDetails()
      }
    }, [data])
  )

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
      mediaType: 'video'
    })
      .then(async response => {
        const uri = response.path
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        const photo = {
          uri: uploadUri,
          name: `image${1}.mp4`,
          type: response.mime
        }
        // handleChange('packing_video', uploadUri)
        handleChange('packing_video', photo)
        handleChange('uploading', false)

        Toast.show(i18n.t('Video Added Successfully'))
      })
      .catch(err => {
        handleChange('uploading', false)
      })
  }

  const _sendInvoice = async () => {
    try {
      handleChange('loadingConfirm', true)
      const token = await AsyncStorage.getItem('token')
      const payload = `?id=${orderData?.id}`
      const res = await sendInvoice(payload, token)
      // navigation.navigate('AdminPanel')
      handleChange('loadingConfirm', false)
      Toast.show(i18n.t(`Invoice has been sent!`))
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange('loadingConfirm', false)
      Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
    }
  }

  const _getInvoiceDetails = async () => {
    try {
      handleChange('loadingConfirm', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getInvoiceDetails(data?.invoice, token)
      handleChange('orderData', res?.data)
      handleChange('shipping_cost', res?.data?.shipping_cost)
      handleChange('discount', res?.data?.discount)
      handleChange('loadingConfirm', false)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange('loadingConfirm', false)
      Toast.show(`${i18n.t('Error')}: ${errorText[0]}`)
    }
  }

  const customer = orderData?.orders?.length > 0 && orderData?.orders[0]?.user
  const getTotalQuantity = orders => {
    let total = 0
    orders?.forEach(element => {
      if (element?.quantity) {
        total = total + Number(element?.quantity)
      }
    })
    return total
  }

  const openVideo = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(orderData?.packing_video)

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(orderData?.packing_video)
    } else {
      Alert.alert(
        `${i18n.t("Don't know how to open this URL:")} ${
          orderData?.packing_video
        }`
      )
    }
  }, [orderData?.packing_video])
  const openLink = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(orderData?.tracking_number_id)

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(orderData?.tracking_number_id)
    } else {
      Alert.alert(
        `${i18n.t("Don't know how to open this URL:")} ${
          orderData?.tracking_number_id
        }`
      )
    }
  }, [orderData?.tracking_number_id])
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header
        title={`${i18n.t('Invoice')}: # ${orderData?.sid}`}
        back
        rightEmpty
        color={COLORS.darkBlack}
      />
      <View style={styles.mainBody}>
        <Text style={styles.dateText}>
          {i18n.t('Date')}: {moment(orderData?.date_time).format('MM/DD/YYYY')}
        </Text>
        <Text style={styles.text}>{i18n.t('Seller')}:</Text>
        <Text style={styles.text1}>Candy Premium</Text>
        <Text style={styles.text}>{i18n.t('Email')}:</Text>
        <Text style={styles.text1}>invoicecandy@gmail.com</Text>
        <Text style={styles.text}>{i18n.t('Address')}:</Text>
        <Text style={styles.text1}>
          Calle Rep de Venezuela 123; Col Centro, CP. 06000; CDMX
        </Text>
        <Text style={styles.text}>{i18n.t('Phone')}:</Text>
        <Text style={styles.text1}>55-8780-6857</Text>

        <Text style={[styles.text, { marginTop: 20 }]}>
          {i18n.t('Customer')}:
        </Text>
        <Text style={styles.text1}>{customer?.name}</Text>
        <Text style={styles.text}>{i18n.t('Phone')}:</Text>
        <Text style={styles.text1}>{customer?.phone}</Text>
        <Text style={styles.text}>{i18n.t('Shipping Address')}:</Text>
        <Text style={styles.text1}>
          {customer?.profile?.shipping_address +
            customer?.profile?.country +
            ', ' +
            customer?.profile?.zip_code}
        </Text>
        {orderData?.orders?.map((order, index) => (
          <View key={index} style={[styles.productContainer]}>
            <Image
              source={
                order?.product?.photos?.length > 0
                  ? { uri: order?.product?.photos[0]?.image }
                  : ProductImage
              }
              style={[styles.image, { height: 200 }]}
            />
            <View style={[styles.rowBetween]}>
              <Text style={styles.price}>
                {i18n.t('Product')}: {order?.product?.sid}
              </Text>
              <Text style={styles.price}>
                {i18n.t('Size')}: {order?.product?.size_variance}
              </Text>
              <View style={styles.styleDiv}>
                <Text style={styles.price}>{i18n.t('Color')}</Text>
                {/* {order?.style?.map((style, index) => ( */}
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 10,
                    backgroundColor: order?.style?.toLowerCase(),
                    borderWidth: 1,
                    borderColor: COLORS.black,
                    borderRadius: 20
                  }}
                />
                {/* ))} */}
              </View>
              <Text style={styles.total}>
                {i18n.t('Price')}: ${order?.product?.per_item_price}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t('Packs')}: {order?.num_packs}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t('order Qty')}: {order?.quantity}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t('Total Amount')}: ${order?.total}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.hline} />
        <View style={[styles.flexEnd, { marginVertical: 10 }]}>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t('Subtotal')}:</Text>
            <Text style={styles.text1}> ${orderData?.sub_total} </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t('Total Quantity')}:</Text>
            <Text style={styles.text1}>
              {' '}
              {getTotalQuantity(orderData?.orders)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t('Shipping Cost')}:</Text>
            <Text style={styles.text1}>${shipping_cost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t('Discount')}:</Text>
            <Text style={styles.text1}>${discount}</Text>
          </View>
          <Text style={styles.total}>
            {i18n.t('Total Amount')}: ${orderData?.total}
          </Text>
        </View>
        <View style={styles.hline} />
        <Text style={[styles.text1, { marginTop: 20 }]}>
          {i18n.t('Tracking Link')}:{' '}
        </Text>
        {typeof orderData?.tracking_number_id === 'string' && (
          <TouchableOpacity onPress={openLink}>
            <Text style={[styles.link]}>{orderData?.tracking_number_id}</Text>
          </TouchableOpacity>
        )}
        {/* <AppInput
          placeholder={'Tracking Link'}
          value={tracking_number_id}
          onChange={handleChange}
          name={'tracking_number_id'}
        /> */}
        <Text style={[styles.text1, { marginTop: 20 }]}>
          {i18n.t('Packing Video')}:{' '}
        </Text>
        {typeof orderData?.packing_video === 'string' && (
          <TouchableOpacity onPress={openVideo}>
            <Text style={[styles.link]}>{orderData?.packing_video}</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          onPress={_uploadImage}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <SvgXml xml={uploadImage} />
        </TouchableOpacity> */}
        {/* <AppButton
          title={'Update Invoice'}
          loading={loadingEdit}
          onPress={_updateInvoice}
        /> */}
        <AppButton
          title={i18n.t('Send PDF Link to SMS')}
          loading={loadingConfirm}
          disabled={!orderData?.file}
          onPress={_sendInvoice}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    backgroundColor: COLORS.white
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  flexEnd: {
    alignItems: 'flex-end',
    width: '100%'
  },
  mainBody: {
    width: '90%',
    marginBottom: 20,
    height: '80%'
  },
  dateText: {
    fontFamily: FONT1SEMIBOLD,
    textAlign: 'center',
    marginTop: -10,
    color: COLORS.darkBlack,
    fontSize: hp(2)
  },
  text: {
    fontFamily: FONT1REGULAR,
    color: COLORS.darkBlack,
    fontSize: hp(2.2)
  },
  link: {
    fontFamily: FONT1REGULAR,
    color: COLORS.link,
    fontSize: hp(2.2)
  },
  text1: {
    fontFamily: FONT1SEMIBOLD,
    color: COLORS.darkBlack,
    fontSize: hp(2.2)
  },
  productContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 50
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
  image: {
    width: '40%',
    marginRight: 10
  },
  rowBetween: {
    width: '50%',
    justifyContent: 'space-between'
  },
  styleText: {
    color: COLORS.black,
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  price: {
    fontSize: hp(2.5),
    fontFamily: FONT1REGULAR,
    color: COLORS.black
  },
  quantity: {
    color: COLORS.black,
    fontSize: hp(2.5),
    fontFamily: FONT1REGULAR
  },
  total: {
    color: COLORS.totalprice,
    fontSize: hp(2.5),
    fontFamily: FONT1BOLD
  },
  hline: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.primary
  },
  styleDiv: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
