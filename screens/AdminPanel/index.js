import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext } from "react"
import { View, StyleSheet, Text, ScrollView } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AppButton, Header } from "../../components"
import { COLORS, FONT1SEMIBOLD } from "../../constants"
import i18n from "../../i18n"
import AppContext from "../../store/Context"

function AdminPanel({ navigation }) {
  // Context
  const context = useContext(AppContext);
  const setUser = context?.setUser;
  const list = [
    { title: i18n.t('LIST OF ALL USERS'), route: 'ListAllUsers' },
    { title: i18n.t('SALESPERSONS'), route: 'ListAllSalepersons' },
    // { title: 'PUSH NOTIFICATIONS', route: 'Notifications' },
    // { title: 'FEEDBACK', route: 'AdminFeedback' },
    { title: i18n.t('UPLOAD CONTENT'), route: 'UploadContent' },
    { title: i18n.t('MANAGE LISTING'), route: 'ListProduct' },
    // { title: 'INVOICES', route: '' },
    {
      title: i18n.t('PENDING & CONFIRMED ORDERS'),
      route: 'PendingComfimOrder'
    },
    { title: i18n.t('INVOICES'), route: 'Invoices' },
    { title: i18n.t('SETTINGS'), route: 'AdminSettings' },
    { title: i18n.t('Logout'), route: '' },
  ];

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.navigate('AuthLoading');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header leftEmpty logo rightEmpty />
      <View style={styles.mainBody}>
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('Categories')}</Text>
          <View style={styles.activeline} />
        </View>
        <View style={styles.buttonWidth}>
          {list.map((item, index) => (
            <AppButton
              key={index}
              marginTop={hp(5)}
              outlined
              fontSize={hp(2)}
              onPress={() =>
                item.title === i18n.t('Logout')
                  ? logout()
                  : navigation.navigate(item.route)
              }
              title={item.title}
              backgroundColor={COLORS.white}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
  mainBody: {
    width: '100%',
    alignItems: 'center'
  },
  buttonWidth: {
    width: '80%',
    marginBottom: 30,
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
    width: '50%',
    marginBottom: 20,
    alignItems: 'center'
  },
});

export default AdminPanel;
