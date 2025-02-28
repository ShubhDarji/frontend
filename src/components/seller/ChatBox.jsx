import React, { useState } from "react";
import { Card, Input, Button, List, Avatar } from "antd";
import { dummyMessages } from "../../data/dummyData";

const { TextArea } = Input;

const ChatBox = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { sender: "You", text: message }]);
    setMessage("");
  };

  return (
    <Card title="Chat with Customer" style={{ maxWidth: 400 }}>
      <List
        dataSource={messages}
        renderItem={(msg, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={<Avatar>{msg.sender[0]}</Avatar>}
              title={msg.sender}
              description={msg.text}
            />
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: "auto" }}
      />
      <TextArea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button type="primary" block onClick={sendMessage} style={{ marginTop: 10 }}>
        Send
      </Button>
    </Card>
  );
};

export default ChatBox;
