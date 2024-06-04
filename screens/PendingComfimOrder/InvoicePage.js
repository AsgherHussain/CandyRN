import React, { useCallback, useContext, useState } from "react"
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AppButton, AppInput, Header } from "../../components"
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from "../../constants"
import ProductImage from "../../assets/images/product.png"
import uploadImage from "../../assets/svg/uploadImage.svg"
import { SvgXml } from "react-native-svg"
import { sendInvoice, updateInvoice } from "../../api/admin"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-simple-toast"
import moment from "moment"
import AppContext from "../../store/Context"
import ImagePicker from "react-native-image-crop-picker"
import RNHTMLtoPDF from "react-native-html-to-pdf"
import i18n from "../../i18n"
import { Icon } from "react-native-elements"

export default function InvoicePage({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const { _getInvoices } = context
  const [state, setState] = useState({
    loading: false,
    loadingEdit: false,
    isEdit: false,
    active: 0,
    orderData: route?.params?.data || null,
    tracking_number_id: route?.params?.data?.tracking_number_id,
    discount: route?.params?.data?.discount,
    shipping_cost: route?.params?.data?.shipping_cost,
    packing_video: route?.params?.data?.packing_video || null
  })

  const {
    loading,
    loadingConfirm,
    orderData,
    tracking_number_id,
    shipping_cost,
    discount,
    loadingEdit,
    packing_video,
    isEdit
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }
  const checkLinkUrl = () => {
    const regex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    if (regex.test(tracking_number_id)) {
      if (tracking_number_id != "") {
        // handleChange('tracking_number_id', '')
      } else {
        handleChange("tracking_number_id", "")
      }
    } else {
      alert("Please enter valid URL")
      handleChange("tracking_number_id", "")
    }
  }

  const _uploadImage = async type => {
    handleChange("uploading", true)
    let OpenImagePicker =
      type == "camera"
        ? ImagePicker.openCamera
        : type == ""
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      mediaType: "video"
    })
      .then(async response => {
        const uri = response.path
        const uploadUri =
          Platform.OS === "ios" ? uri.replace("file://", "") : uri
        const photo = {
          uri: uploadUri,
          name: `image${1}.mp4`,
          type: response.mime
        }
        // handleChange('packing_video', uploadUri)
        handleChange("packing_video", photo)
        handleChange("uploading", false)

        Toast.show(i18n.t("Video Added Successfully"))
      })
      .catch(err => {
        handleChange("uploading", false)
      })
  }

  const _sendInvoice = async () => {
    try {
      handleChange("loadingConfirm", true)
      const token = await AsyncStorage.getItem("token")
      const payload = `?id=${orderData?.id}`
      const res = await sendInvoice(payload, token)
      // navigation.navigate('AdminPanel')
      handleChange("loadingConfirm", false)
      Toast.show(i18n.t(`Invoice has been submitted!`))
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      handleChange("loadingConfirm", false)
      Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const customer = orderData?.orders?.length > 0 && orderData?.orders[0]?.user
  const _updateInvoice = async () => {
    try {
      handleChange("loadingEdit", true)
      const token = await AsyncStorage.getItem("token")
      let options = {
        html: `
  <div style="width: 90%;display:flex;flex-direction:column; margin-bottom: 20px;">
    <div style="margin-bottom:10px;display:flex;align-items:flex-end;justify-content:space-between">
        <div>
            <div style="font-size:34px;font-weight:bold;">
                INVOICE
            </div>
            <div style="font-size:20px;font-weight:bold;">
                # ${orderData?.sid}
            </div>
        </div>
        <div>
            <div style="font-size:12px; font-weight:bold;text-align:right">Candy Premium</div>
            <div style="font-size:12px; margin-top:10px;text-align:right">Calle Rep de Venezuela 123;</div>
            <div style="font-size:12px; margin-top:10px;text-align:right">Col Centro, CP. 06000; CDMX</div>
            <div style="font-size:12px; margin-top:10px;text-align:right">TEL: 55-8780-6857</div>
        </div>
    </div>
    <div style="height:5px;width:100%;background-color:#000;margin-top:10px;margin-bottom:30px"></div>

    <div style="margin-bottom:0px;display:flex;align-items:flex-start;justify-content:space-between">
        <div>
            <div style="font-size:12px;margin-top:20px;font-weight:bold;">Billed To:</div>
            <div style="font-size:12px; font-weight:bold;">${
              customer?.name
            }</div>
            <div style="font-size:12px;">${
              customer?.profile?.shipping_address +
              ", " +
              customer?.profile?.country +
              ", " +
              customer?.profile?.zip_code
            }</div>
            <div style="font-size:12px;">T: ${customer?.phone}</div>
        </div>
        <div style="font-size:14px;font-weight:bold;margin-top:20px; text-align: right">
            <div>Date Issued</div>
            <div>${moment(orderData?.date_time).format("MM/DD/YYYY")}</div>
        </div>
    </div>
    <div style="height:1px;width:100%;background-color:#000;margin-top:10px;margin-bottom:50px"></div>
    <div style="padding-top: 1px;display:block;">
        <div style="content: '';width:100%; margin-top:20px;">
            ${orderData?.orders
              ?.map(
                i => `
            <div style="float: left;width: 50%;display:flex;align-items:center;">
                <img src=${
                  i?.product?.photos?.length > 0
                    ? i?.product?.photos[0]?.image
                    : ProductImage
                }

                style="height:200px;object-fit:contain; width:100px;margin-right:10px"
                />
                <div>
                    <div style="font-size:12px; margin-top:10px">Product: ${
                      i?.product?.sid
                    }</div>
                    <div style="font-size:12px; margin-top:10px">Size: ${
                      i?.items
                    }</div>
                    <div style="display:flex;margin-top:10px">
                        <div style="font-size:12px;">Color</div>
                        <div style="
                      width: 18px;
                      height: 18px;
                      margin-left: 10px;
                      background-color: ${i?.style?.toLowerCase()};
                      border: 1px solid #000;
                      border-radius: 18px
                    "></div>
                    </div>
                    <div style="font-size:12px; color:red; margin-top:10px">
                        Price: ${i?.product?.per_item_price}
                    </div>
                    <div style="font-size:12px; margin-top:10px">Packs: ${
                      i?.num_packs
                    }</div>
                    <div style="font-size:12px; margin-top:10px">order Qty: ${
                      i?.quantity
                    }</div>
                    <div style="font-size:12px; margin-top:10px">Total Amount: $${
                      i?.total
                    }</div>
                </div>
            </div>`
              )
              .join("")}
        </div>
    </div>
</div>
<div style="width:100%;display:flex;flex-direction: column;margin-top:80px;">
    <div style="width:100%;margin-top: 20px;">
        <div style="width: 100%; height: 1px; margin-bottom: 0px; background-color: #000;"></div>
        <div style="display:flex;align-items:center;margin-top:20px;margin-bottom:10px;justify-content:space-between;">
            <div style="display:flex;flex-direction:column;margin-top:20px">
                <div style="display:flex;align-items:center;text-align:left;margin-bottom:10px;">
                    <div style="width:180px">Total Quantity:</div>
                    <div style='font-weight:bold;text-align:right;width:40%'>${getTotalQuantity(
                        orderData?.orders
                        )}</div>
                </div>
                <div style="display:flex;align-items:center;text-align:left;margin-bottom:10px;">
                    <div style="width:180px">Subtotal:</div>
                    <div style='font-weight:bold;text-align:right;width:40%'> $${
                        orderData?.sub_total
                        }</div>
                </div>
                <div style="display:flex;align-items:center;margin-bottom:10px;">
                    <div style="width:180px">Shipping Cost:</div>
                    <div style='font-weight:bold;text-align:right;width:40%'>$${shipping_cost}</div>
                </div>
                <div style="display:flex;align-items:center;margin-bottom:10px;">
                    <div style="width:180px">Discount:</div>
                    <div style='font-weight:bold;text-align:right;width:40%'>$${discount}</div>
                </div>
            </div>
            <div style='font-size:18px;font-weight:bold;text-align:right;'>Total Amount: $${Number(
                orderData?.sub_total
                ) +
                Number(shipping_cost) -
                Number(discount)} </div>
        </div>
        <div style="width:100%; height:4px; margin-bottom:20px; background-color:#000;"></div>
        <div style="display:flex;margin-bottom:10px;">
            <div style="font-weight:bold; width:150px">Tracking Link: </div>
        </div>
        <div style="display:flex;margin-bottom:10px;">
            <a href={${tracking_number_id}} style="text-align:left;font-size:12px;">${tracking_number_id ||
                ''}</a>
        </div>
        <div style="display:flex;margin-bottom:10px;">
            <div style='font-weight:bold; width:150px'>Packing Video: </div>
        </div>
        <div style="display:flex;margin-bottom:10px;">
            <a style="text-align:left;font-size:12px;" href={${ orderData?.packing_video }}>${orderData?.packing_video
                || ''}</a>
        </div>

        </div>
</div>

        `,
        fileName: "test",
        directory: "Documents",
        base64: true
      }
      let file = await RNHTMLtoPDF.convert(options)
      const payload = new FormData()
      payload.append("tracking_number_id", tracking_number_id)
      packing_video &&
        typeof packing_video !== "string" &&
        payload.append("packing_video", packing_video)
      file?.filePath &&
        payload.append("file", {
          uri: "file://" + file.filePath,
          name: Date.now() + `invoice.pdf`,
          type: "application/pdf"
        })
      payload.append("shipping_cost", shipping_cost)
      payload.append("discount", discount)
      const res = await updateInvoice(orderData?.id, payload, token)
      handleChange("loadingEdit", false)
      handleChange("isEdit", false)
      _getInvoices()
      handleChange("orderData", res?.data)
      Toast.show(i18n.t(`Invoice has been updated!`))
    } catch (error) {
      handleChange("loadingEdit", false)
      const errorText =
        error?.response?.data && Object?.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`${i18n.t("Error")}: ${errorText[0]}`)
      } else {
        Toast.show(`${i18n.t("Error")}: ${JSON.stringify(error)}`)
      }
    }
  }

  const getTotalQuantity = orders => {
    let total = 0
    orders?.forEach(element => {
      if (element?.quantity) {
        total = total + Number(element?.quantity)
      }
    })
    return total
  }

  const openVideo = useCallback(
    async url => {
      const final = url.startsWith("https://") ? url : "https://" + url
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(final)

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(final)
      } else {
        Alert.alert(`${i18n.t("Don't know how to open this URL:")} ${final}`)
      }
    },
    [orderData?.packing_video]
  )
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Header
        title={`Invoice: # ${orderData?.sid}`}
        back
        rightEmpty
        color={COLORS.darkBlack}
      />
      <View style={styles.mainBody}>
        <Text style={styles.dateText}>
          {i18n.t("Date")}: {moment(orderData?.date_time).format("MM/DD/YYYY")}
        </Text>
        <Text style={styles.text}>{i18n.t("Seller")}:</Text>
        <Text style={styles.text1}>Candy Premium</Text>
        <Text style={styles.text}>{i18n.t("Email")}:</Text>
        <Text style={styles.text1}>invoicecandy@gmail.com</Text>
        <Text style={styles.text}>{i18n.t("Address")}:</Text>
        <Text style={styles.text1}>
          Calle Rep de Venezuela 123; Col Centro, CP. 06000; CDMX
        </Text>
        <Text style={styles.text}>{i18n.t("Phone")}:</Text>
        <Text style={styles.text1}>55-8780-6857</Text>

        <Text style={[styles.text, { marginTop: 20 }]}>
          {i18n.t("Customer")}:
        </Text>
        <Text style={styles.text1}>{customer?.name}</Text>
        <Text style={styles.text}>{i18n.t("Phone")}:</Text>
        <Text style={styles.text1}>{customer?.phone}</Text>
        <Text style={styles.text}>{i18n.t("Shipping Address")}:</Text>
        <Text style={styles.text1}>
          {customer?.profile?.shipping_address +
            customer?.profile?.country +
            ", " +
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
                {i18n.t("Product")}: {order?.product?.sid}
              </Text>
              <Text style={styles.price}>
                {i18n.t("Size")}: {order?.items}
              </Text>
              <View style={styles.styleDiv}>
                <Text style={styles.price}>{i18n.t("Color")}</Text>
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
                {i18n.t("Price")}: ${order?.product?.per_item_price}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t("Packs")}: {order?.num_packs}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t("order Qty")}: {order?.quantity}
              </Text>
              <Text style={styles.quantity}>
                {i18n.t("Total Amount")}: ${order?.total}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.hline} />
        <View style={[styles.flexEnd, { marginVertical: 10 }]}>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t("Subtotal")}:</Text>
            <Text style={styles.text1}> ${orderData?.sub_total}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t("Total Quantity")}:</Text>
            <Text style={styles.text1}>
              {" "}
              {getTotalQuantity(orderData?.orders)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t("Shipping Cost")}:</Text>
            <Text style={styles.text1}>$</Text>
            <AppInput
              placeholder={i18n.t("Shipping Cost")}
              value={shipping_cost}
              width={100}
              onChange={handleChange}
              name={"shipping_cost"}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{i18n.t("Discount")}:</Text>
            <Text style={styles.text1}>$</Text>
            <AppInput
              placeholder={i18n.t("Discount")}
              value={discount}
              width={100}
              onChange={handleChange}
              name={"discount"}
            />
          </View>
          <Text style={styles.total}>
            {i18n.t("Total Amount")}: ${orderData?.total}
          </Text>
        </View>
        <View style={styles.hline} />
        <Text style={[styles.text1, { marginTop: 20 }]}>
          {i18n.t("Tracking Link")}:{" "}
        </Text>
        {tracking_number_id && !isEdit ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => openVideo(tracking_number_id)}>
              <Text style={[styles.link]}>{orderData?.tracking_number_id}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChange("isEdit", true)}>
              <Icon name="edit" type="antdesign" color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <AppInput
            placeholder={i18n.t("Tracking Link")}
            value={tracking_number_id}
            onBlur={checkLinkUrl}
            onChange={handleChange}
            name={"tracking_number_id"}
          />
        )}
        <Text style={[styles.text1, { marginTop: 20 }]}>
          {i18n.t("Packing Video")}:{" "}
        </Text>
        {typeof orderData?.packing_video === "string" && (
          <TouchableOpacity onPress={() => openVideo(orderData?.packing_video)}>
            <Text style={[styles.link]}>{orderData?.packing_video}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={_uploadImage}
          style={{ alignItems: "center", marginTop: 20 }}
        >
          <SvgXml xml={uploadImage} />
        </TouchableOpacity>
        <AppButton
          title={i18n.t("Update Invoice")}
          loading={loadingEdit}
          onPress={_updateInvoice}
        />
        <AppButton
          title={i18n.t("Submit the Invoice")}
          loading={loadingConfirm}
          onPress={_sendInvoice}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    backgroundColor: COLORS.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  flexEnd: {
    alignItems: "flex-end",
    width: "100%"
  },
  mainBody: {
    width: "90%",
    marginBottom: 20,
    height: "80%"
  },
  dateText: {
    fontFamily: FONT1SEMIBOLD,
    textAlign: "center",
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
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 50
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
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
    width: "100%",
    backgroundColor: COLORS.grey,
    height: 5
  },
  activeline: {
    width: "100%",
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  image: {
    width: "40%",
    marginRight: 10
  },
  rowBetween: {
    width: "50%",
    justifyContent: "space-between"
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
    width: "100%",
    height: 1,
    backgroundColor: COLORS.primary
  },
  styleDiv: {
    flexDirection: "row",
    alignItems: "center"
  }
})
