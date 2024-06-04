import React, { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView
} from "react-native"
import { CheckBox } from "react-native-elements"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import { AppButton, AppInput, Header } from "../../components"
import { COLORS, FONT1SEMIBOLD } from "../../constants"
import searchIcon from "../../assets/svg/search.svg"
import UserProfile from "../../assets/images/profile.png"
import FlagIcon from "../../assets/svg/flag.svg"
import FlagFill from "../../assets/svg/flagFill.svg"
import AppContext from "../../store/Context"
import i18n from "../../i18n"

const { height, width } = Dimensions.get("screen")

const filterSecondArray = (firstArray, secondArray) => {
  return secondArray.filter(item => {
    return !firstArray.some(({ user }) => user.id === item.id)
  })
}

function UnassignedUserModal({ assigned = [], onClose, onAction }) {
  // Context
  const context = useContext(AppContext)
  const { users } = context
  const [state, setState] = useState({
    filteredList: users || [],
    saerchText: ""
  })
  const [assignedUser, setAssignedUser] = useState([])

  useEffect(() => {
    if (users) {
      handleChange("filteredList", filterSecondArray(assigned, users))
    }
  }, [users])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const { filteredList, saerchText } = state

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
      handleChange("filteredList", filterSecondArray(assigned, users))
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

  const handleFilter = (key, value) => {
    handleChange(key, value)
    filtered(value)
  }

  const handleToggle = item => {
    setAssignedUser(prevState => {
      const exists = prevState.some(prevItem => prevItem.id === item.id)
      if (exists) {
        return prevState.filter(prevItem => prevItem.id !== item.id)
      } else {
        return [...prevState, item]
      }
    })
  }

  return (
    <Modal>
      <SafeAreaView style={styles.container}>
        <Header
          back
          tab
          tabText={i18n.t("Unassigned Users")}
          rightEmpty
          backPress={onClose}
        />
        <View style={styles.mainBody}>
          <AppInput
            placeholder={i18n.t("Search users")}
            name={"saerchText"}
            value={saerchText}
            onChange={handleFilter}
            postfix={<SvgXml xml={searchIcon} />}
          />
          <View style={{ height: height / 1.6 }}>
            {filteredList && filteredList?.length > 0 && (
              <FlatList
                data={filteredList?.length > 0 && setListData(filteredList)}
                keyExtractor={(item, index) => JSON.stringify(item)}
                renderItem={({ item, index }) => {
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
                        <TouchableOpacity>
                          <Text>{item?.name + item?.last_name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <CheckBox
                            checked={assignedUser.some(
                              prevItem => prevItem.id === item.id
                            )}
                            onPress={() => handleToggle(item)}
                            // Use ThemeProvider to make change for all checkbox
                            iconType="material-community"
                            checkedIcon="checkbox-marked"
                            uncheckedIcon="checkbox-blank-outline"
                            checkedColor="grey"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                }}
                indexLetterColor={COLORS.primary}
              />
            )}
          </View>
          <View style={styles.buttonWidth}>
            <AppButton
              title={i18n.t("ASSIGN USERS")}
              onPress={() => onAction(assignedUser)}
              width={width / 1.1}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    width: "83%",
    marginLeft: 10
  },
  tab: {
    width: "50%",
    marginBottom: 20,
    alignItems: "center"
  }
})

export default UnassignedUserModal
