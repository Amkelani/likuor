import React from 'react';
import {View, Text, ScrollView} from 'react-native';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';


// @ts-ignore
const TrackYourOrder: React.FC = ({route}): JSX.Element => {
  const navigation = useAppNavigation();
  const {order_status, order_id, date, time} = route.params;
  const orderStatuses = [
    { title: 'Order Confirmed', description: 'Your order has been confirmed' },
    { title: 'Preparing', description: 'Our bartender is preparing your drink' },
    { title: 'Shipping', description: 'Driver is on the way' },
    { title: 'Delivered', description: 'Knock Knock !!' },
  ];
  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return <components.Header goBack={true} title='Track your order' />;
  };
  const getStatus = (order_status, status) => {
    const statusOrder = ['Order Confirmed', 'Preparing', 'Shipping', 'Delivered'];
    return statusOrder.indexOf(order_status) <= statusOrder.indexOf(status);
  };
  console.log(order_status)
  const renderDescription = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.mainTurquoise,
          borderRadius: 10,
          marginHorizontal: 20,
          padding: 20,
          marginBottom: 10,
        }}
      >
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 14}}
        >
          <text.T14 style={{marginRight: 14, textTransform: 'none'}}>
            Your order:
          </text.T14>
          <text.H5 style={{color: theme.colors.mainTurquoise}}>{order_id}</text.H5>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <text.T14 style={{marginRight: 14, textTransform: 'none'}}>
            Date:
          </text.T14>
          <text.H5 style={{color: theme.colors.mainTurquoise}}>
            {date} at {time}
          </text.H5>
        </View>
      </View>
    );
  };

  const renderOrderStatus = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.white,
          marginHorizontal: 20,
          borderRadius: 10,
          padding: 30,
        }}
      >
        {orderStatuses.map((orderStatus, index) => (
            <components.OrderStatus
                key={index}
                title={orderStatus.title}
                description={orderStatus.description}
                status={getStatus(orderStatus.title, order_status)}
                containerStyle={{ marginBottom: 7 }}
            />
        ))}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingTop: 10}}
        showsVerticalScrollIndicator={false}
      >
        {renderDescription()}
        {renderOrderStatus()}
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={{paddingHorizontal: 20, paddingBottom: 10, paddingTop: 20}}>
        <components.Button title='Chat support' onPress={() => {}} />
      </View>
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
      {renderButton()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default TrackYourOrder;
