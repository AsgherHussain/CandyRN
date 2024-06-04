import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Icon } from "react-native-elements"
import { SvgXml } from "react-native-svg"
import { AppInput, Header } from "../../components"
import { COLORS, FONT1SEMIBOLD } from "../../constants"
import searchIcon from "../../assets/svg/search.svg"
import UserProfile from "../../assets/images/profile.png"
import FlagIcon from "../../assets/svg/flag.svg"
import FlagFill from "../../assets/svg/flagFill.svg"
import AlphabetList from "react-native-flatlist-alphabet"
import AppContext from "../../store/Context"
import { getSalesPerson } from "../../api/salesperson"
import AsyncStorage from "@react-native-async-storage/async-storage"
import i18n from "../../i18n"
import { useFocusEffect } from "@react-navigation/native"

function ListAllSalepersons({ navigation }) {
  // Context
  const [state, setState] = useState({
    loading: false,
    filteredList: [],
    saerchText: ""
  })

  useFocusEffect(
    useCallback(() => {
      _getSalesPersons()
    }, [])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const { filteredList, loading, saerchText } = state

  const setListData = data => {
    if (data?.length > 0) {
      const list = []
      data?.forEach(element => {
        const newObj = {
          ...element,
          key: element?.id,
          value: element?.name || "No name"
        }
        list.push(newObj)
      })
      return list
    } else {
      return []
    }
  }

  const _getSalesPersons = async (id, flagged) => {
    try {
      handleChange("loading", true)
      const body = { flagged }
      const token = await AsyncStorage.getItem("token")
      const res = await getSalesPerson(token)
      handleChange("filteredList", res?.data)
      handleChange("loading", false)
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={"large"} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        back
        tab
        tabText={i18n.t("Salepersons")}
        icon={
          <TouchableOpacity
            onPress={() => navigation.navigate("NewSalesperson")}
            style={{ marginTop: 10 }}
          >
            <Icon
              name="plus"
              type="antdesign"
              color={COLORS.primary}
              size={22}
            />
          </TouchableOpacity>
        }
      />
      <View style={styles.mainBody}>
        <FlatList
          data={filteredList?.length > 0 && setListData(filteredList)}
          keyExtractor={(item, index) => JSON.stringify(item)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.listContainer}
                onPress={() =>
                  navigation.navigate("SalepersonProfile", {
                    userID: item?.id,
                    user: item
                  })
                }
              >
                <Image style={styles.listImage} source={UserProfile} />
                <View style={styles.textContainer}>
                  <Text>{`${item?.first_name} ${item?.last_name}`}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: COLORS.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  mainBody: {
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  listImage: {
    width: 50,
    borderRadius: 50,
    height: 50
  },
  buttonWidth: {
    width: "80%"
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 70
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
    marginLeft: 10
  },
  tab: {
    width: "50%",
    marginBottom: 20,
    alignItems: "center"
  }
})

export default ListAllSalepersons
