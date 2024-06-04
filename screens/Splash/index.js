/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import logo from '../../assets/svg/Splash.svg';
import { COLORS } from '../../constants';
import { getSplashScreen } from '../../api/setting';

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splashFile: null,
      show: false,
    };
  }

  async loadSplashImage() {
    try {
      const savedSplashData = await getSplashScreen();
      if (savedSplashData && savedSplashData.data && savedSplashData.data[0]) {
        this.setState({
          splashFile: { uri: savedSplashData.data[0].image },
          show: true,
        });
      } else {
        this.setState({ show: true });
      }
    } catch (error) {
      console.error('Error loading splash image from AsyncStorage:', error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.show) {
      setTimeout(() => {
        this.props.navigation.navigate('AuthLoading');
      }, 3000);
    }
  }

  componentDidMount() {
    this.loadSplashImage();
  }

  render = () => (
    <View style={styles.container}>
      {this.state.show ? (
        this.state.splashFile != null ? (
          <Image
            source={{ uri: this.state.splashFile.uri }}
            style={{ flex: 1 }}
          />
        ) : (
          <SvgXml xml={logo} width={'100%'} height={'100%'} />
        )
      ) : (
        <View />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
  },
});

export default Splash;
