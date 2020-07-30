import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_MESSAGE, GET_MESSAGES } from "./api";

export const PostMessage = () => {
  const [message, setMessage] = useState("");

  const [addMessage, { error }] = useMutation(CREATE_MESSAGE, {
    update(
      cache,
      {
        data: { createMessage },
      }
    ) {
      const { messages: current } = cache.readQuery({
        query: GET_MESSAGES,
      });
      const updated = current.concat([createMessage]);
      cache.writeQuery({
        query: GET_MESSAGES,
        data: { messages: updated },
      });
    },
  });

  const handleChange = (e) => setMessage(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    addMessage({ variables: { message } });
    setMessage("");
  };

  return (
    <React.Fragment>
      <h4>Post New</h4>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleChange} value={message} />
        <br />
        <button type="submit">Post</button>
      </form>
      {error && <p>error</p>}
    </React.Fragment>
  );
};
