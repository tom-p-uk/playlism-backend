import Expo from 'exponent-server-sdk';
const expo = new Expo();

export const sendPushNotifications = async (pushToken, text) => {
  try {
    const receipts = await expo.sendPushNotificationsAsync([{
      to: pushToken,
      sound: 'default',
      body: text,
    }]);

    console.log(receipts);
    return { success: { receipts } };
  } catch (err) {
    console.log(err);
  }
};
