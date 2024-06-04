import React, { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import { AppInput, Header } from "../../components"
import { COLORS, FONT1SEMIBOLD } from "../../constants"
import searchIcon from "../../assets/svg/search.svg"
import UserProfile from "../../assets/images/profile.png"
import FlagIcon from "../../assets/svg/flag.svg"
import FlagFill from "../../assets/svg/flagFill.svg"
import AlphabetList from "react-native-flatlist-alphabet"
import AppContext from "../../store/Context"
import { updateUser } from "../../api/admin"
import AsyncStorage from "@react-native-async-storage/async-storage"
import i18n from "../../i18n"

function ListAllUsers({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { users, _getUsers } = context
  const [state, setState] = useState({
    loading: false,
    filteredList: users || [],
    saerchText: ""
  })

  useEffect(() => {
    if (users) {
      handleChange("filteredList", users)
    }
  }, [users])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const { filteredList, loading, saerchText } = state

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = users?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", users)
    }
  }

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

  const _updateUser = async (id, flagged) => {
    try {
      handleChange("loading", true)
      const body = { flagged }
      const token = await AsyncStorage.getItem("token")
      await updateUser(id, body, token)
      _getUsers()
      handleChange("filteredList", [])
      handleChange("loading", false)
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`${i18n.t("Error")}: ${errorText[0]}`)
    }
  }

  const handleFilter = (key, value) => {
    handleChange(key, value)
    filtered(value)
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
      <Header back tab tabText={i18n.t("All Users")} rightEmpty />
      <View style={styles.mainBody}>
        <AppInput
          placeholder={i18n.t("Search users")}
          name={"saerchText"}
          value={saerchText}
          onChange={handleFilter}
          postfix={<SvgXml xml={searchIcon} />}
        />

        {filteredList && filteredList?.length > 0 && (
          <AlphabetList
            data={filteredList?.length > 0 && setListData(filteredList)}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={20}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * index,
              index
            })}
            updateCellsBatchingPeriod={25}
            initialNumToRender={20}
            windowSize={41}
            indexLetterSize={14}
            letterItemStyle={{ fontFamily: FONT1SEMIBOLD, height: 30 }}
            renderSectionHeader={section => {
              return <View style={{ height: 0 }} />
            }}
            style={{ width: "100%", height: "78%", marginTop: 20 }}
            renderItem={(item, index) => {
              return (
                <View key={index} style={styles.listContainer}>
                  <Image
                    style={styles.listImage}
                    source={
                      item?.profile?.photo
                        ? { uri: item?.profile?.photo }
                        : UserProfile
                    }
                  />
                  <View style={styles.textContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UserOrders", {
                          userID: item?.id,
                          user: item
                        })
                      }
                    >
                      <Text>{item?.name + item?.last_name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => _updateUser(item?.id, !item?.flagged)}
                    >
                      <SvgXml xml={item?.flagged ? FlagFill : FlagIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
            indexLetterColor={COLORS.primary}
          />
        )}
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
    width: "90%",
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

export default ListAllUsers
