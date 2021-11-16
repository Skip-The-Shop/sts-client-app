import React, {useEffect, useState, useContext} from 'react';
import moment from 'moment';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  getMessagesByTypeAndTarget,
  createMessage,
} from '../../../api/messages.api';
import {AuthContext} from '../../../hooks/getAuth';
const Messages = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const {TargetTypeCode, TargetId} = route.params;
  const getMessages = () => {
    getMessagesByTypeAndTarget({TargetId, TargetTypeCode}).then(m => {
      m.forEach(mes => {
        mes['_id'] = mes.MessageId;
        mes['user'] = {
          _id: mes.UserId,
        };
        mes['createdAt'] = mes.Created;
        mes['text'] = mes.MessageText;
      });
      console.log({m});
      setMessages(m);
    });
  };
  useEffect(() => {
    getMessages();
  }, []);
  const sendMessage = () => {
    createMessage({
      TargetId,
      TargetTypeCode,
      MessageText: message,
      UserId: user.UserId,
    }).then(() => {
      getMessages();
    });
  };
  return (
    <GiftedChat
      messages={messages}
      onInputTextChanged={data => setMessage(data)}
      onSend={sendMessage}
      user={{
        _id: user.UserId,
      }}
    />
  );
};

export default Messages;
