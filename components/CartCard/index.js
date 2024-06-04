import React from 'react'
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import ProductImage from '../../assets/images/product.png'
import DeleteIcon from '../../assets/svg/delete.svg'
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from '../../constants'
import i18n from '../../i18n'

export default function CartCard ({ item, handleRemoveItem }) {
  return (
    <View style={[styles.container]}>
      <Image
        source={
          item?.product?.photos?.length > 0
            ? { uri: item?.product?.photos[0]?.image }
            : ProductImage
        }
        style={[styles.image, { height: 200 }]}
      />
      <View style={styles.rowBetween}>
        <View style={styles.styleDiv}>
          <Text style={styles.styleText}>{i18n.t('Style')}</Text>
          <View
            style={{
              width: 20,
              height: 20,
              marginLeft: 10,
              backgroundColor: item?.style?.toLowerCase(),
              borderWidth: 1,
              borderColor: COLORS.black,
              borderRadius: 20
            }}
          />
        </View>
        <Text style={styles.price}>
          {i18n.t('Product ID')}: {item?.product?.sid}
        </Text>
        <Text style={[styles.price, { textTransform: 'capitalize' }]}>
          {i18n.t('price per piece')}: ${item?.product?.per_item_price}
        </Text>
        <Text style={styles.quantity}>
          {i18n.t('Quantity')}: {item?.quantity}
        </Text>
        <Text style={styles.total}>
          {i18n.t('Total')}: ${item?.total}
        </Text>
        <TouchableOpacity
          style={styles.removeDiv}
          onPress={() => handleRemoveItem(item?.id)}
        >
          <Text style={[styles.quantity, { fontFamily: FONT1SEMIBOLD }]}>
            {i18n.t('Remove')}
          </Text>
          <SvgXml xml={DeleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20
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
    fontFamily: FONT1BOLD,
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
    fontFamily: FONT1LIGHT
  },
  removeDiv: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  styleDiv: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
