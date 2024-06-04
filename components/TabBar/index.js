import React, { Fragment } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import Tab1IconActive from '../../assets/svg/tabs/homeFill.svg'
import Tab1Icon from '../../assets/svg/tabs/Home.svg'
import Tab4IconActive from '../../assets/svg/tabs/inventoryFill.svg'
import Tab4Icon from '../../assets/svg/tabs/inventory.svg'
import Tab3IconActive from '../../assets/svg/tabs/settingsFill.svg'
import Tab3Icon from '../../assets/svg/tabs/settings.svg'
import Tab2Icon from '../../assets/svg/tabs/cart.svg'
import Tab2IconActive from '../../assets/svg/tabs/cartFill.svg'
import profileIcon from '../../assets/svg/tabs/profileIcon.svg'
import profileFill from '../../assets/svg/tabs/profileFill.svg'
import { COLORS } from '../../constants'

function TabBar ({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index]?.key].options

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <Fragment>
      <View style={styles.container}>
        {state?.routes.length > 0 &&
          state?.routes?.map((route, index) => {
            if (route) {
              const { options } = descriptors[route?.key]
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name

              const isFocused = state.index === index

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route?.key
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                  navigation.emit({
                    type: 'tabPress',
                    target: route?.key
                  })
                }
              }

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route?.key
                })
              }

              const _getIcon = () => {
                switch (label) {
                  case 'Home':
                    return (
                      <View
                        style={
                          isFocused ? styles.activeTab : styles.inActiveTab
                        }
                      >
                        <SvgXml
                          xml={isFocused ? Tab1IconActive : Tab1Icon}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                  case 'User':
                    return (
                      <View
                        style={
                          isFocused ? styles.activeTab : styles.inActiveTab
                        }
                      >
                        <SvgXml
                          xml={isFocused ? profileFill : profileIcon}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                  case 'Cart':
                    return (
                      <View
                        style={
                          isFocused ? styles.activeTab : styles.inActiveTab
                        }
                      >
                        <SvgXml
                          xml={isFocused ? Tab2IconActive : Tab2Icon}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                  case 'Settings':
                    return (
                      <View
                        style={
                          isFocused ? styles.activeTab : styles.inActiveTab
                        }
                      >
                        <SvgXml
                          xml={isFocused ? Tab3IconActive : Tab3Icon}
                          style={{ opacity: isFocused ? 1 : 0.8 }}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                  default:
                    return (
                      <View
                        style={
                          isFocused ? styles.activeTab : styles.inActiveTab
                        }
                      >
                        <SvgXml
                          xml={isFocused ? Tab4IconActive : Tab4Icon}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                }
              }

              return (
                <TouchableOpacity
                  key={label}
                  accessibilityRole='button'
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  activeOpacity={0.75}
                  onLongPress={onLongPress}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.white,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {_getIcon()}
                </TouchableOpacity>
              )
            }
          })}
      </View>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: hp(7),
    paddingBottom: hp('2%'),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12
  },
  activeTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    height: hp('7%'),
    backgroundColor: COLORS.white
  },
  inActiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    height: hp('7%'),
    backgroundColor: COLORS.white
  }
})

export default TabBar
