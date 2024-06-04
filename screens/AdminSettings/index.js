/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppButton, Header } from '../../components';
import { COLORS, FONT1BOLD, FONT1SEMIBOLD } from '../../constants';
import AppContext from '../../store/Context';
import i18n from '../../i18n';
import logo from '../../assets/svg/Splash.svg';
import { addSplashScreen, getSplashScreen } from '../../api/setting';
function generateUniqueName(prefix = '') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000); // Add randomness in case of fast successive calls
  const uniqueName = `${prefix}${timestamp}_${random}`;
  return uniqueName;
}
function AdminSettings({ navigation }) {
  // Context
  const context = useContext(AppContext);
  // State
  const [state, setState] = useState({
    showSplash: { show: false, save: false },
    showConfirmSplash: false,
    splashFile: null,
  });
  const [serverFormData,setServerFormData] = useState(null);

  const { showSplash, showConfirmSplash, splashFile } = state;

  const loadSplashImage = async () => {
    try {
      const savedSplashData = await getSplashScreen();
      if (savedSplashData && savedSplashData.data && savedSplashData.data[0]) {
        handleChange('splashFile', {
          uri: savedSplashData.data[0].image,
        });
      } else {
        handleChange('splashFile', null);
      }
    } catch (error) {
      console.error('Error loading splash image from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadSplashImage();
  }, []);

  const _uploadImage = async type => {
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker;

    OpenImagePicker({
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(async response => {
        const uri = response.path;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        const photo = {
          uri: `data:${response.mime};base64,${response.data}`,
          name: `image${1}`,
          type: response.mime,
          data: response.data,
        };

        try {
          setServerFormData({
            uri: uploadUri,
            name: `${
              response.filename ||
              `${
                generateUniqueName('image') + `.${response.mime.split('/')[1]}`
              }`
            }`,
            type: response.mime,
          });
          handleChange('splashFile', photo);
          handleChange('showSplash', { show: true, save: true });
        } catch (e) {
          console.log('Error Catch', e);
        }
      })
      .catch(err => console.log('Error', err));
  };

  const _saveImage = async () => {
    try {
      console.log('save splash');
      const formData = new FormData();
      formData.append('image', serverFormData);
      const token = await AsyncStorage.getItem('token');
      const uploadImage = await addSplashScreen(formData, token);
      if (uploadImage && uploadImage.status === 201) {
        await AsyncStorage.setItem('splashImageData', uploadImage.data.image);
        handleChange('showConfirmSplash', false);
      }
    } catch (error) {
      handleChange('showConfirmSplash', false);
      loadSplashImage();
      console.log('Error saving splash image to AsyncStorage:', error);
    }
  };

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }));
  };

  const selectSplash = () => {
    handleChange('showSplash', { show: false, upload: false });
    if (splashFile && showSplash.save) {
      handleChange('showConfirmSplash', true);
    }
  };

  const list = [
    { title: i18n.t('VIEW'), route: '' },
    { title: i18n.t('UPLOAD'), route: '' },
  ];

  return (
    <View style={styles.container}>
      <Header back tab titleUpp tabText={i18n.t('Settings')} rightEmpty />
      <View style={styles.mainBody}>
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('SplashScreen')}</Text>
        </View>
        <View style={styles.buttonWidth}>
          {list.map((item, index) => (
            <AppButton
              key={index}
              marginTop={hp(5)}
              outlined
              fontSize={hp(2)}
              onPress={() =>
                item.title === i18n.t('UPLOAD')
                  ? _uploadImage()
                  : handleChange('showSplash', { show: true, save: false })
              }
              title={item.title}
              backgroundColor={COLORS.white}
            />
          ))}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmSplash}
        onRequestClose={() => {
          handleChange('showConfirmSplash', false);
          loadSplashImage();
        }}
        style={{ flex: 1 }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Text style={styles.modalText}>{i18n.t('Confirm Change')}</Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton title={i18n.t('Yes')} onPress={() => _saveImage()} />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={i18n.t('No')}
                  outlined
                  backgroundColor={COLORS.white}
                  onPress={() => {
                    handleChange('showConfirmSplash', false);
                    loadSplashImage();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSplash.show}
        onRequestClose={selectSplash}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={selectSplash}
          style={styles.splashContainer}
        >
          {splashFile != null ? (
            <Image source={{ uri: splashFile.uri }} style={{ flex: 1 }} />
          ) : (
            <SvgXml xml={logo} width={'100%'} height={'100%'} />
          )}
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  mainBody: {
    width: '90%',
  },
  buttonWidth: {
    marginBottom: 20,
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.modalBG,
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: 20,
    paddingVertical: 50,
    elevation: 5,
  },
  rowAround: {
    width: '100%',
    marginVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontFamily: FONT1BOLD,
    fontSize: hp(4),
    marginBottom: 20,
  },
  halfWidth1: {
    width: '48%',
  },
  mainBody: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWidth: {
    width: '80%',
    marginBottom: 30,
  },
  activeTabText: {
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD,
  },
  tab: {
    width: '90%',
    marginTop: 20,
    alignItems: 'flex-start',
  },
});

export default AdminSettings;
