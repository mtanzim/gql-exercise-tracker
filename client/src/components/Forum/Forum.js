import React from "react";
import { Messages } from "./Messages";
import { PostMessage } from "./PostMessage";

export const Forum = () => {
  return (
    <React.Fragment>
      <h1>Forum</h1>
      <PostMessage />
      <Messages />
    </React.Fragment>
  );
};
