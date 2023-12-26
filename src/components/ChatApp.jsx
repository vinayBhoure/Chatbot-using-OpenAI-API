import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Message,
  MessageList,
  ChatContainer,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";
function ChatApp() {
  const [typing, setTyping] = useState(false);
  const [messageList, setMessageList] = useState([
    {
      message: "Hey, I'm chat gpt, how can i help you",
      sender: "Chat GPT",
    },
  ]);

  const sendHandler = async (message) => {
    const newMessage = {
      message: message,
      sender: "User",
      direction: "outgoing",
    };

    const newMessageList = [...messageList, newMessage];
    console.log(newMessageList);
    setMessageList(newMessageList);
    //update the messsage list by adding the new message into the array of all messages

    setTyping(true);
    // asking to chatgpt for the

    await messageChatGPT(newMessageList);
  };

  async function messageChatGPT(newMessageList) {
    let apiMessage = newMessageList.map((message) => {
      let role = "";
      if (message.sender === "Chat GPT") {
        role = "assistant";
      } else {
        role = "User";
      }

      return {
        role: role,
        content: message.message,
      };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [...apiMessage],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        if (data.status !== 200) {
          console.log("Error");
        }
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessageList([
          ...newMessageList,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="main relative h-screen w-[600px] mx-auto">
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              typing && <TypingIndicator content="Chat GPT is typing" />
            }
          >
            {messageList.map((message, index) => {
              return <Message key={index} model={message} />;
            })}
          </MessageList>

          <MessageInput
            placeholder="Write your message here"
            onSend={sendHandler}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatApp;
