import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native"
import { COLORS, FONT1BOLD, FONT1REGULAR } from "../../constants"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Icon } from "react-native-elements"
export default function AppInput({
  prefix,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  postfix,
  secureTextEntry,
  keyboardType,
  maxLength,
  prefixBGTransparent,
  backgroundColor,
  height,
  inputLabel,
  dropdown,
  pickerItems,
  disabled,
  multiline,
  width,
  fontFamily,
  prefixStyle,
  borderWidth,
  borderRadius,
  returnKeyType
}) {
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const getValue = data => {
    const res = pickerItems?.filter(e => e.id === data)
    return res && res[0].name
  }
  return (
    <>
      {inputLabel && <Text style={styles.lebel}>{inputLabel}</Text>}
      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor ? backgroundColor : "transparent",
            height: height ? height : hp("7%"),
            borderRadius: borderRadius || 6,
            borderWidth: borderWidth || 0,
            width: width ? width : "100%"
          }
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            { borderColor: focused ? COLORS.primary : "transparent" }
          ]}
        >
          <View style={styles.left}>
            {prefix && (
              <View
                style={[
                  prefixStyle || styles.prefix,
                  {
                    backgroundColor: prefixBGTransparent
                      ? "transparent"
                      : COLORS.inputPrefixBG
                  }
                ]}
              >
                {prefix}
              </View>
            )}
            {dropdown && pickerItems ? (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
                onPress={() => setOpen(!open)}
              >
                <Text>{(value && getValue(value)) || placeholder}</Text>
                <Icon name={"down"} type={"antdesign"} />
              </TouchableOpacity>
            ) : (
              <TextInput
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false)
                  onBlur && onBlur()
                }}
                returnKeyType={returnKeyType || "done"}
                secureTextEntry={secureTextEntry || false}
                value={value}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                editable={disabled ? false : true}
                maxLength={maxLength || null}
                keyboardType={keyboardType || "default"}
                onChangeText={text => onChange(name, text)}
                placeholderTextColor={COLORS.placeholder}
                style={[
                  styles.textInput,
                  {
                    fontFamily: fontFamily || FONT1REGULAR,
                    textAlignVertical: multiline ? "top" : "center",
                    opacity: focused ? 1 : 0.7
                  }
                ]}
              />
            )}
          </View>
          {postfix && <View style={styles.postfix}>{postfix}</View>}
        </View>
      </View>
      {open &&
        pickerItems?.map(res => (
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: COLORS.primary,
              height: 40,
              backgroundColor: COLORS.white
            }}
            onPress={() => {
              onChange(name, res.id)
              setOpen(!open)
            }}
          >
            <Text style={{ fontFamily: FONT1REGULAR, marginLeft: 10 }}>
              {res.name}
            </Text>
          </TouchableOpacity>
        ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 6,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: hp("1%"),
    justifyContent: "center"
  },
  inputContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1
  },
  left: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center"
  },
  textInput: {
    color: COLORS.inputText,
    width: "80%",
    fontSize: hp(2)
  },
  lebel: {
    color: COLORS.darkBlack,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  checkIcon: {
    backgroundColor: COLORS.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  prefix: {
    width: hp("5%"),
    height: hp("5%"),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  }
})
