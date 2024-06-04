import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1SEMIBOLD } from '../../constants'
import i18n from '../../i18n'

function Home ({ navigation }) {
  return (
    <View style={styles.container}>
      <Header leftEmpty logo rightEmpty />
      <View style={styles.mainBody}>
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('Categories')}</Text>
          <View style={styles.activeline} />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            marginTop={hp(5)}
            outlined
            onPress={() => navigation.navigate('Products', { halfpack: false })}
            title={i18n.t('Orders')}
            backgroundColor={COLORS.white}
          />
          <AppButton
            marginTop={hp(5)}
            outlined
            onPress={() => navigation.navigate('Products', { halfpack: true })}
            title={i18n.t('HALF PACKS')}
            backgroundColor={COLORS.white}
          />
          <AppButton
            marginTop={hp(5)}
            onPress={() => navigation.navigate('Inventory')}
            outlined
            title={i18n.t('INVENTORY')}
            backgroundColor={COLORS.white}
          />
        </View>
      </View>
      <View />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center'
  },
  mainBody: {
    width: '100%',
    alignItems: 'center'
  },
  buttonWidth: {
    width: '80%'
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    textTransform: 'uppercase',
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tab: {
    width: '50%',
    marginBottom: 20,
    alignItems: 'center'
  }
})

export default Home
