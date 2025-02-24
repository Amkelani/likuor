import React, {useState} from 'react';
import {View, Text, ViewStyle, TextStyle, TouchableOpacity, Image, Alert} from 'react-native';
import axios from 'axios';
import {text} from '../../text';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {BASE_URL, ENDPOINTS, storeTokens} from '../../config';
import UserStore from './UserStore'
import addressStore from "./AddressStore";


const SignIn: React.FC = (): JSX.Element => {
    const navigation = useAppNavigation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [eyeOffIcon, setEyeOffIcon] = useState(true);
    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
        setEyeOffIcon(!eyeOffIcon);
    };
    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={false}/>;
    };
    const renderLogo = () => {
        return <View style={{
            flexDirection: 'column-reverse',
            alignItems: 'center'
        }}>
            <Image source={require('../../../assets/logo-without-background-Photoroom.png')}
                   style={{width: 300, height: 300, resizeMode: "contain"}}/>
        </View>
    }
    const renderWelcome = () => {
        return <text.H1 style={{marginBottom: 14}}>Welcome Back!</text.H1>;
    };

    const renderDescription = () => {
        return <text.T16 style={{marginBottom: 30}}>Sign in to continue</text.T16>;
    };

    const renderInputFields = () => {
        return (
            <React.Fragment>
                <components.InputField
                    type='email'
                    value={email}
                    placeholder='Please enter your email'
                    onChangeText={(text) => setEmail(text)}
                    containerStyle={{marginBottom: 14}}
                />
                <components.InputField
                    type='password'
                    value={password}
                    eyeOffIcon={eyeOffIcon}
                    secureTextEntry={secureTextEntry}
                    toggleSecureTextEntry={toggleSecureTextEntry}
                    placeholder='Please enter your password'
                    onChangeText={(text) => setPassword(text)}
                    containerStyle={{marginBottom: 20}}
                />
            </React.Fragment>
        );
    };

    const renderForgotPassword = () => {
        const textStyles: TextStyle = {
            ...theme.fonts.textStyle_14,
            color: theme.colors.mainTurquoise,
        };

        return (
            <Text
                onPress={() => navigation.navigate('ForgotPassword')}
                style={{...textStyles}}
            >
                Forgot password?
            </Text>
        );
    };

    const renderRememberMe = () => {
        return (
            <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => setRememberMe(!rememberMe)}
            >
                <View
                    style={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#E6EFF8',
                        borderRadius: 4,
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {rememberMe && (
                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                backgroundColor: theme.colors.mainTurquoise,
                            }}
                        />
                    )}
                </View>
                <text.T14>Remember me</text.T14>
            </TouchableOpacity>
        );
    };


    const renderAdditionalButtons = () => {
        const containerStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
        };

        return (
            <View style={{...containerStyle}}>
                {/*{renderRememberMe()}*/}
                {renderForgotPassword()}
            </View>
        );
    };

    const renderContent = () => {
        const styles: ViewStyle = {
            flexGrow: 1,
            backgroundColor: theme.colors.white,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
            // justifyContent: 'center',
            // marginTop: 10,
        };

        return (
            <components.KAScrollView contentContainerStyle={{...styles}}>
                {renderLogo()}
                {renderWelcome()}
                {renderDescription()}
                {renderInputFields()}
                {renderAdditionalButtons()}
                {renderButton()}
                {renderDonTHaveAccount()}
            </components.KAScrollView>
        );
    };

    const renderButton = () => {
        return (
            <View>
                <components.Button
                    title={'Sign in'}
                    loading={loading}
                    containerStyle={{marginBottom: 20}}
                    onPress={async () => {
                        if (!email || !password) {
                            Alert.alert('Authentication Failed', 'Email and password required!');
                        } else {
                            if (!loading) {
                                try {
                                    setLoading(true);
                                    const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.login}`, {
                                        username: email,
                                        password: password,
                                    });
                                    if (response.data.success) {
                                        UserStore.setEmail(response.data.user)
                                        addressStore.setAddress(response.data.address)
                                        await storeTokens(response.data.access, response.data.refresh)
                                        setLoading(false);
                                        navigation.navigate('TabNavigator');
                                    } else {
                                        setLoading(false);
                                        Alert.alert('Authentication Failed', response.data.error);
                                    }
                                } catch (error) {
                                    setLoading(false);
                                    Alert.alert('Error', 'Something went wrong. Please try again.');
                                }
                            }
                        }
                    }}
                />
            </View>
        );
    };

    const renderDonTHaveAccount = () => {
        return (
            <components.ParsedText
                parse={[
                    {
                        pattern: /Sign up./,
                        style: {color: theme.colors.mainTurquoise},
                        onPress: () => navigation.navigate('SignUp'),
                    },
                ]}
            >
                Don’t have an account? Sign up.
            </components.ParsedText>
        );
    };

    // const renderFooter = () => {
    //   const styles: ViewStyle = {
    //     backgroundColor: theme.colors.white,
    //     width: '48%',
    //     height: 50,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderBottomLeftRadius: 10,
    //     borderBottomRightRadius: 10,
    //   };
    //
    //   const containerStyle: ViewStyle = {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginHorizontal: 20,
    //     justifyContent: 'space-between',
    //     marginTop: 10,
    //     marginBottom: homeIndicatorHeight() === 0 ? 20 : 10,
    //   };
    //
    //   return (
    //     <View style={{...containerStyle}}>
    //       <View style={{...styles}}>
    //         <svg.FacebookSvg />
    //       </View>
    //       <View style={{...styles}}>
    //         <svg.GoogleSvg />
    //       </View>
    //     </View>
    //   );
    // };

    const renderHomeIndicator = () => {
        return <components.HomeIndicator/>;
    };

    return (
        <components.SmartView>
            {renderStatusBar()}
            {renderHeader()}
            {renderContent()}
            {/*{renderFooter()}*/}
            {renderHomeIndicator()}
        </components.SmartView>
    );
};

export default SignIn;
