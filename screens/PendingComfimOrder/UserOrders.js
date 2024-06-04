import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Switch } from 'react-native-elements'
import { AppButton, ImageViews, Header } from '../../components'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgXml } from 'react-native-svg'
import Toast from 'react-native-simple-toast'
import { generateInvoice, getUserOrders } from '../../api/admin'
import ProductImage from '../../assets/images/product.png'
import { useFocusEffect } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import i18n from '../../i18n'
import { deleteOrder, getMyOrdersTotal } from '../../api/customer'
import {
  COLORS,
  FONT1BOLD,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  FONT2BOLD,
  FONT2MEDIUM,
  FONT2SEMIBOLD,
} from '../../constants'
import AppContext from '../../store/Context'
import deleteIcon from '../../assets/svg/delete.svg'
import userProfileIcon from '../../assets/svg/userProfile.svg'
import {
  getOrderColor,
  hexToColorName,
  sumCancelledOrderTotal,
} from '../../utils/helperMethod'

export default function UserOrders({ navigation, route }) {
  const userID = route?.params?.userID;
  // const userID = "0f331349-c7d4-4843-a645-f741f8829a5c"
  const user = route?.params?.user;
  // Context
  const context = useContext(AppContext);
  const {
    // adminProductsLoading,
    // adminOrdersActive,
    // adminOrdersHistory,
    // _getUserOrders
  } = context;
  const [state, setState] = useState({
    loading: false,
    active: 0,
    ids: [],
    page: 0,
    limit: 50,
    adminProductsLoadingActive: false,
    adminProductsLoadingHistory: false,
    adminProductsLoadingHalf: false,
    halfOrders: [],
    adminOrdersActive: [],
    adminOrdersHistory: [],
    isRefreshing: false,
    isImageViewVisible: false,
    loadingDelete: false,
    images: [],
    halftotal: 0,
    completedtotal: 0,
    activetotal: 0,
    hideCanceledOrders: false,
    hideCanceledOrdersTotal: 0,
  });

  const {
    loading,
    loadingConfirm,
    active,
    ids,
    adminProductsLoadingActive,
    adminProductsLoadingHistory,
    adminProductsLoadingHalf,
    adminOrdersActive,
    isRefreshing,
    adminOrdersHistory,
    halfOrders,
    limit,
    page,
    isImageViewVisible,
    images,
    loadingDelete,
    halftotal,
    completedtotal,
    activetotal,
    hideCanceledOrders,
    hideCanceledOrdersTotal,
  } = state;
  useFocusEffect(
    useCallback(() => {
      if (userID) {
        getData();
      }
    }, [userID])
  );
  const getData = resetPage => {
    const payload = `?l=${limit}&o=${
      resetPage ? 0 : page
    }&status=Pending,Processing,Confirmed&user=${userID}`;
    const payload1 = `?l=${limit}&o=${
      resetPage ? 0 : page
    }&status=Completed&user=${userID}`;
    const payload2 = `?l=${limit}&o=${
      resetPage ? 0 : page
    }&status=Unmatched,Cancelled,Pending&user=${
      userID || user?.id
    }&half_pack=True`;
    const payloadTotalUnmatched = `?status=Unmatched&user=${userID}`;

    _getUserOrdersActive(payload, resetPage);
    _getUserOrdersHistory(payload1, resetPage);
    _getUserOrdersHalf(payload2, resetPage, payloadTotalUnmatched);
  };

  const onScrollHandler = () => {
    getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }));
  };

  const _getUserOrdersActive = async (payload, resetPage) => {
    try {
      if (resetPage) {
        handleChange('adminOrdersActive', []);
      }
      handleChange('adminProductsLoadingActive', true);
      const token = await AsyncStorage.getItem('token');
      const body = payload ? payload : ''
      const res = await getUserOrders(body, token);
      const resTotal = await getMyOrdersTotal(body, token);
      handleChange('activetotal', resTotal?.data?.total);
      handleChange(
        'adminOrdersActive',
        resetPage ? res?.data : [...adminOrdersActive, ...res?.data]
      );
      handleChange('page', resetPage ? 0 + limit : page + limit);
      handleChange('isRefreshing', false);
      handleChange('adminProductsLoadingActive', false);
    } catch (error) {
      handleChange('adminProductsLoadingActive', false);
      const errorText = Object.values(error?.response?.data);
      alert(`Error: ${errorText[0]}`);
    }
  };
  const _getUserOrdersHistory = async (payload, resetPage) => {
    try {
      if (resetPage) {
        handleChange('adminOrdersHistory', []);
      }
      handleChange('adminProductsLoadingHistory', true);
      const token = await AsyncStorage.getItem('token');
      const body = payload ? payload : ''
      const res = await getUserOrders(body, token);
      const resTotal = await getMyOrdersTotal(body, token);
      handleChange('completedtotal', resTotal?.data?.total);
      handleChange(
        'adminOrdersHistory',
        resetPage ? res?.data : [...adminOrdersHistory, ...res?.data]
      );
      handleChange('page', resetPage ? 0 + limit : page + limit);
      handleChange('isRefreshing', false);
      handleChange('adminProductsLoadingHistory', false);
    } catch (error) {
      handleChange('adminProductsLoadingHistory', false);
      const errorText = Object.values(error?.response?.data);
      alert(`Error: ${errorText[0]}`);
    }
  };
  const _getUserOrdersHalf = async (
    payload,
    resetPage,
    payloadTotalUnmatched
  ) => {
    try {
      if (resetPage) {
        handleChange('halfOrders', []);
      }
      handleChange('adminProductsLoadingHalf', true);
      const token = await AsyncStorage.getItem('token');
      const body = payload ? payload : ''
      const res = await getUserOrders(body, token);
      const resTotal = await getMyOrdersTotal(payloadTotalUnmatched, token);
      handleChange('halftotal', resTotal?.data?.total);
      handleChange(
        'halfOrders',
        resetPage ? res?.data : [...halfOrders, ...res?.data]
      );
      if (halfOrders) {
        handleChange(
          'hideCanceledOrdersTotal',
          sumCancelledOrderTotal(halfOrders)
        );
      }

      handleChange('page', resetPage ? 0 + limit : page + limit);
      handleChange('isRefreshing', false);
      handleChange('adminProductsLoadingHalf', false);
    } catch (error) {
      handleChange('adminProductsLoadingHalf', false);
      const errorText = Object.values(error?.response?.data);
      alert(`Error: ${errorText[0]}`);
    }
  };

  const _deleteOrder = async id => {
    try {
      handleChange('adminProductsLoading', true);
      handleChange('loadingDelete', true);
      const token = await AsyncStorage.getItem('token');
      const payload = `?order=${id}`;
      await deleteOrder(payload, token);
      onRefresh();
      handleChange('loadingDelete', false);
      Toast.show(i18n.t('Order has been canceled!'));
    } catch (error) {
      const errorText = Object.values(error?.response?.data);
      handleChange('loadingDelete', false);
      Toast.show(`${i18n.t('Error')}: ${errorText[0]}`);
    }
  };

  const _generateInvoice = async () => {
    try {
      handleChange('loadingConfirm', true);
      const token = await AsyncStorage.getItem('token');
      const payload = `?ids=${ids.toString()}`;
      const res = await generateInvoice(payload, token);
      navigation.navigate('PendingComfimOrder');
      handleChange('ids', []);
      navigation.navigate('InvoicePage', { data: res?.data });
      handleChange('loadingConfirm', false);
      Toast.show(i18n.t('Invoice has been generated!'));
    } catch (error) {
      const errorText = Object.values(error?.response?.data);
      handleChange('loadingConfirm', false);
      Toast.show(`${i18n.t('Error')}: ${errorText[0]}`);
    }
  };

  const totalAmount = () => {
    // if (active === 0) {
    //   return activetotal
    // } else if (active === 1) {
    //   return completedtotal
    // } else {
    //   if (hideCanceledOrders) {
    //     return halftotal - hideCanceledOrdersTotal
    //   }
    //   return halftotal
    // }
    const list =
      active === 2
        ? halfOrders
        : active === 0
        ? adminOrdersActive
        : adminOrdersHistory;
    let total = 0;
    list?.forEach(element => {
      if (element?.total && element?.status !== 'Cancelled') {
        total = total + Number(element?.total);
      }
    });
    if (active === 2 && hideCanceledOrders) {
      return total.toFixed(2) - hideCanceledOrdersTotal;
    }
    return total.toFixed(2);
  };

  const sortByDate = array => {
    return array?.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date_time) - new Date(a.date_time);
    });
  };

  const showImage = ({ images, id, price, style }) => {
    const list = [];
    images?.map(item => {
      list.push({ uri: item?.image, id, price, style });
    });
    handleChange('images', list);
    handleChange('isImageViewVisible', true);
  };

  const sortByStatus = array => {
    return array?.sort((a, b) => {
      return b.status < a.status ? -1 : 1;
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        back
        titleCap
        title={user?.name}
        icon={
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfiles', { userID })}
          >
            <SvgXml xml={userProfileIcon} />
          </TouchableOpacity>
        }
      />
      <View style={styles.mainBody}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange('active', 0)}
          >
            <View style={styles.row}>
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t('Active')}
              </Text>
            </View>
            <View style={active === 0 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange('active', 1)}
          >
            <View style={styles.row}>
              <Text
                style={active === 1 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t('History')}
              </Text>
            </View>
            <View style={active === 1 ? styles.activeline : styles.line} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleChange('active', 2)}
          >
            <View style={styles.row}>
              <Text
                style={active === 2 ? styles.activeTabText : styles.tabText}
              >
                {i18n.t('Pending Half Packs')}
              </Text>
            </View>
            <View style={active === 2 ? styles.activeline : styles.line} />
          </TouchableOpacity>
        </View>
        {(active === 0
          ? adminProductsLoadingActive
          : active === 1
          ? adminProductsLoadingHistory
          : adminProductsLoadingHalf) && (
          <ActivityIndicator size={'small'} color={COLORS.primary} />
        )}
        <FlatList
          data={
            active === 2
              ? sortByStatus(
                  sortByDate(
                    hideCanceledOrders
                      ? halfOrders.filter(i => i.status !== 'Cancelled')
                      : halfOrders
                  )
                )
              : active === 0
              ? sortByDate(adminOrdersActive)
              : sortByDate(adminOrdersHistory)
          }
          key={'_'}
          onEndReached={onScrollHandler}
          onEndReachedThreshold={0}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          style={{ height: active === 0 ? '63%' : '72%' }}
          ListEmptyComponent={() => {
            return (
              <Text style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}>
                {(
                  active === 0
                    ? adminProductsLoadingActive
                    : active === 1
                    ? adminProductsLoadingHistory
                    : adminProductsLoadingHalf
                )
                  ? ''
                  : i18n.t('No List')}
              </Text>
            );
          }}
          keyExtractor={item => '_' + item?.id}
          renderItem={({ item, index }) => {
            const statusOfOrder =
              active === 2
                ? item?.status === 'Unmatched'
                  ? i18n.t('Unmatched')
                  : item?.status === 'Pending'
                  ? i18n.t('Pending')
                  : i18n.t('Canceled')
                : active === 0
                ? i18n.t('Pending')
                : i18n.t('Completed');
            return (
              <View key={index} style={[styles.container1]}>
                <TouchableOpacity
                  style={[styles.image, { maxHeight: 350, minHeight: 200 }]}
                  onPress={() => {
                    showImage({
                      images:
                        item?.product?.photos?.length > 0
                          ? item?.product?.photos
                          : [{ image: 'Static Image' }],
                      id: item?.product?.sid,
                      price: item?.product?.per_item_price,
                      style: item?.style?.toLowerCase(),
                    });
                  }}
                >
                  <Image
                    source={
                      item?.product?.photos?.length > 0
                        ? { uri: item?.product?.photos[0]?.image }
                        : ProductImage
                    }
                    style={[styles.image, { width: '100%', minHeight: 200 }]}
                  />
                  <View
                    style={[
                      styles.statusContainer,
                      {
                        backgroundColor: item?.status
                          ? getOrderColor(item?.status).bgColor
                          : ''
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderTitle,
                        {
                          color: item?.status
                            ? getOrderColor(item?.status).color
                            : ''
                        },
                      ]}
                    >
                      {statusOfOrder}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={active === 1 ? 0 : 1}
                  onPress={() =>
                    active === 1
                      ? navigation.navigate('CustomerInvoice', { data: item })
                      : console.log()
                  }
                  style={styles.rowBetween}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.price}>
                      {i18n.t('Product')}:{' '}
                      <Text style={styles.boldText}>{item?.product?.sid}</Text>
                    </Text>
                    {active === 0 && item?.status === 'Confirmed' && (
                      <BouncyCheckbox
                        size={25}
                        fillColor={COLORS.primary}
                        unfillColor={COLORS.white}
                        isChecked={ids.includes(item?.id)}
                        text=""
                        iconStyle={{
                          borderColor: COLORS.primary,
                          borderRadius: 0,
                        }}
                        textStyle={{
                          fontFamily: FONT1REGULAR,
                          color: COLORS.primary,
                          textDecorationLine: 'underline'
                        }}
                        disableBuiltInState
                        style={{ marginLeft: 20 }}
                        onPress={() => {
                          if (ids.some(e => e === item?.id)) {
                            const removed = ids.filter(e => e !== item?.id);
                            handleChange('ids', removed);
                          } else {
                            handleChange('ids', [...ids, item?.id]);
                          }
                        }}
                      />
                    )}
                  </View>

                  <Text style={styles.price}>
                    {i18n.t('Size')}:{' '}
                    <Text style={styles.boldText}>{item?.items}</Text>
                  </Text>
                  <View style={styles.styleDiv}>
                    <Text style={styles.price}>
                      {i18n.t('Color')}:{' '}
                      <Text style={styles.boldText}>
                        {hexToColorName(item?.style)}
                      </Text>
                    </Text>
                    {/* {item?.styles?.map((style, index) => ( */}
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        backgroundColor: item?.style?.toLowerCase(),
                        borderWidth: 1,
                        borderColor: COLORS.black,
                        borderRadius: 20,
                      }}
                    />
                    {/* ))} */}
                  </View>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
                  <Text style={styles.total}>
                    {i18n.t('Price')}: {item?.product?.per_item_price} $
                  </Text>
                  {/* </View> */}
                  {/* {active === 0 && item?.status !== "Confirmed" && (
                    <Text style={styles.quantity}>Need to Confirm</Text>
                  )} */}
                  {/* <Text
                    style={[
                      styles.quantity,
                      {
                        fontFamily: FONT1BOLD,
                        color:
                          item?.status === "Cancelled"
                            ? COLORS.darkRed
                            : active === 2 || active === 0
                            ? COLORS.pending
                            : COLORS.completed
                      }
                    ]}
                  >
                    {statusOfOrder}
                  </Text> */}
                  {/* <Text style={styles.quantity}>Packs: {1}</Text> */}
                  <Text style={styles.quantity}>
                    {i18n.t('Packs')}:{' '}
                    <Text style={styles.boldText}>{item?.num_packs}</Text>
                  </Text>
                  <Text style={styles.quantity}>
                    {i18n.t('order Qty')}:{' '}
                    <Text style={styles.boldText}>{item?.quantity}</Text>
                  </Text>
                  <Text
                    style={[
                      styles.quantity,
                      styles.boldText,
                      { color: COLORS.green },
                    ]}
                  >
                    {i18n.t('Total Amount')}: {item?.total}$
                  </Text>
                  {active === 2 && item?.status === 'Unmatched' && (
                    <TouchableOpacity
                      disabled={loadingDelete}
                      onPress={() => _deleteOrder(item?.id)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={[
                          styles.quantity,
                          {
                            fontSize: hp(1.8),
                            fontFamily: FONT2MEDIUM,
                            marginRight: 10,
                          },
                        ]}
                      >
                        {i18n.t('Cancel')}
                      </Text>
                      <SvgXml xml={deleteIcon} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <View style={styles.hline} />
        {active > 1 && (
          <View style={styles.swtichDiv}>
            <Switch
              color={COLORS.switchColor}
              value={hideCanceledOrders}
              onValueChange={value => handleChange('hideCanceledOrders', value)}
            />
            <Text style={styles.switchText}>
              {i18n.t('Hide Canceled Orders')}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.total,
            {
              textAlign: 'right',
              width: '100%',
              marginTop: 5,
              borderWidth: 0,
              color: COLORS.green,
              fontSize: hp(2.5),
            },
          ]}
        >
          {i18n.t('Total Amount')}: {totalAmount()}$
        </Text>
        {active === 0 && (
          <View style={{ width: '90%' }}>
            <AppButton
              title={i18n.t('Generate Invoice')}
              disabled={ids.length === 0}
              loading={loadingConfirm}
              onPress={_generateInvoice}
            />
          </View>
        )}
      </View>
      <ImageViews
        images={images}
        isImageViewVisible={isImageViewVisible}
        handleChange={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  mainBody: {
    width: '90%',
    // height: '90%',
    alignItems: 'center'
  },
  hline: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  activeTabText: {
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD,
  },

  tabs: {
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tab: {
    width: '33%',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabText: {
    color: COLORS.grey,
    fontSize: hp(1.6),
    marginBottom: 10,
    fontFamily: FONT1SEMIBOLD,
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(1.6),
    fontFamily: FONT1SEMIBOLD,
  },
  line: {
    width: '100%',
    backgroundColor: COLORS.grey,
    height: 5,
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5,
  },
  container1: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 30,
    flex: 1,
  },
  image: {
    width: '40%',
    marginRight: 10,
  },
  rowBetween: {
    width: '50%',
    justifyContent: 'space-between'
  },
  styleText: {
    color: COLORS.black,
    fontSize: hp(3),
    fontFamily: FONT1BOLD,
  },
  price: {
    fontSize: hp(2),
    fontFamily: FONT1REGULAR,
    color: COLORS.black,
  },
  quantity: {
    color: COLORS.black,
    fontSize: hp(1.9),
    fontFamily: FONT1REGULAR,
    padding: 2,
  },
  total: {
    color: COLORS.black,
    fontSize: hp(2.1),
    fontFamily: FONT1BOLD,
    borderWidth: 1,
    padding: 6,
    marginVertical: 5,
    width: '90%'
  },
  removeDiv: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  styleDiv: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusContainer: { position: 'absolute', top: 0, left: 0 },
  orderTitle: {
    padding: 8,
    fontWeight: '600',
    fontFamily: FONT2SEMIBOLD,
  },
  boldText: { fontFamily: FONT2SEMIBOLD, fontSize: hp(1.8) },
  swtichDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  switchText: {
    fontSize: hp(2.2),
    fontFamily: FONT1MEDIUM,
    marginLeft: 8,
  },
});
