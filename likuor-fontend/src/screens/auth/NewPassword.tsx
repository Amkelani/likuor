import React, {useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {validatePassword} from "./regexValidation";
import {BASE_URL, ENDPOINTS} from "../../config";
import axios from "axios";
import UserStore from "./UserStore";

const NewPassword: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return <components.Header goBack={true} title='Reset password' />;
  };

  const renderDescription = () => {
    const descriptionStyle = {
      ...theme.fonts.DMSans_400Regular,
      fontSize: 16,
      lineHeight: 16 * 1.7,
      color: theme.colors.textColor,
      marginBottom: 30,
    };

    return (
      <Text style={{...descriptionStyle}}>Enter new password and confirm.</Text>
    );
  };

  const renderInputField = () => {
    return (
      <React.Fragment>
        <components.InputField
          type='password'
          value={password}
          eyeOffIcon={true}
          placeholder='Enter password...'
          secureTextEntry={true}
          containerStyle={{marginBottom: 14}}
          onChangeText={(text) => setPassword(text)}
        />
        <components.InputField
          type='password'
          eyeOffIcon={true}
          value={confirmPassword}
          placeholder='Confirm password'
          secureTextEntry={true}
          containerStyle={{marginBottom: 20}}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </React.Fragment>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='change password'
        onPress={async () => {
          if (!password) {
            Alert.alert('Sign up failed', "password is required!");
          } else if (password != confirmPassword) {
            Alert.alert('Sign up failed', "Password does not match.");
          } else if (!validatePassword(password)) {
            Alert.alert('Sign up failed', "Password must contain the following: \n\n" +
                "> At least 8 characters long\n" +
                "> Contains at least one lowercase letter\n" +
                "> Contains at least one uppercase letter\n" +
                "> Contains at least one numeric digit\n" +
                "> Contains at least one special character ");
          }
          else {
            try {
              const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.updateUser}`, {
                    username: UserStore.getEmail(),
                    password: password
                  },
                  {
                    validateStatus: function (status) {
                      return status >= 200 && status < 500;
                    }
                  });
              console.log(response.data)
              if (response.data.success) {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'ForgotPasswordSentEmail'}],
                });
              } else {
                Alert.alert('Sign up failed', response.data.error);
              }
            } catch (error) {
              Alert.alert('User registration failed', 'Please email us on support@likour.com');
            }
          }
        }}
      />
    );
  };

  const renderContent = () => {
    const contentContainerStyle = {
      flexGrow: 1,
      marginHorizontal: 20,
      paddingTop: 10,
    };

    const blockStyle = {
      backgroundColor: theme.colors.white,
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderRadius: 10,
    };

    return (
      <ScrollView contentContainerStyle={{...contentContainerStyle}}>
        <View style={{...blockStyle}}>
          {renderDescription()}
          {renderInputField()}
          {renderButton()}
        </View>
      </ScrollView>
    );
  };

  const renderHomeIndicator = () => {
    return <components.HomeIndicator />;
  };

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default NewPassword;
