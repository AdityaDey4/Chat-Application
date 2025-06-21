import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    previewMap: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageStatusToSeen: (state, action) => {
      const receiverId = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.receiverId === receiverId ? { ...msg, status: "seen" } : msg
      );
    },
    updateMessageStatusToDelivered: (state, action) => {
      const receiverId = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.receiverId === receiverId && msg.status === "sent"
          ? { ...msg, status: "delivered" }
          : msg
      );
    },
    setMessagePreviews : (state, action) => {
      state.previewMap = action.payload;
    }
  },
});
export const { setMessages, addMessage, updateMessageStatusToSeen, updateMessageStatusToDelivered, setMessagePreviews } =
  messageSlice.actions;
export default messageSlice.reducer;
