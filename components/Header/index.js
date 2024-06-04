import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONT1BOLD, FONT1SEMIBOLD } from '../../constants'
import leftIcon from '../../assets/svg/left.svg'
import logoIcon from '../../assets/svg/logo.svg'
import menuIcon from '../../assets/svg/menu.svg'
import { useNavigation } from '@react-navigation/native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'

export default function Header({
  title,
  rightEmpty,
  leftEmpty,
  back,
  logo,
  menu,
  menuClick,
  tab,
  tabText,
  titleCap,
  color,
  titleUpp,
  backPress,
  icon,
}) {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.header,
        {
          alignItems: tab ? 'flex-start' : 'center'
        },
      ]}
    >
      {leftEmpty && <View style={{ width: '10%' }} />}
      {back && (
        <TouchableOpacity
          onPress={() => (backPress ? backPress() : navigation.goBack())}
          style={styles.menuView}
        >
          <SvgXml xml={leftIcon} />
        </TouchableOpacity>
      )}
      {logo && <SvgXml xml={logoIcon} width={'50%'} />}
      {tab && (
        <View style={styles.tab}>
          <Text
            style={[
              styles.activeTabText,
              {
                textTransform: titleCap
                  ? 'capitalize'
                  : titleUpp
                  ? 'uppercase'
                  : 'none'
              },
            ]}
          >
            {tabText}
          </Text>
          <View style={styles.activeline} />
        </View>
      )}
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: color || COLORS.darkGrey,
              textTransform: titleCap
                ? 'capitalize'
                : titleUpp
                ? 'uppercase'
                : 'none'
            },
          ]}
        >
          {title}
        </Text>
      )}
      {menu && (
        <TouchableOpacity onPress={menuClick} style={styles.menuView}>
          <SvgXml xml={menuIcon} />
        </TouchableOpacity>
      )}
      {icon && icon}
      {rightEmpty && <View style={{ width: '10%' }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '90%',

    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  menuView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 45,
  },
  title: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    marginLeft: 20,
    fontFamily: FONT1BOLD,
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD,
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5,
  },
  tab: {
    width: '60%',
    marginBottom: 20,
    alignItems: 'center'
  },
});
