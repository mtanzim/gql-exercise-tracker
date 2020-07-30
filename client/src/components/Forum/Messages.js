import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { DELETE_MESSAGE, GET_MESSAGES, SUBSCRIBE_MESSAGES } from "./api";

export const Messages = () => {
  const { authState } = useContext(AuthContext);
  const userId = authState.user.id;
  const { loading, error, data } = useQuery(GET_MESSAGES);
  const { data: newData } = useSubscription(SUBSCRIBE_MESSAGES, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { cache } = client;
      const {
        data: { messageAdded },
      } = subscriptionData;
      const { messages: current } = cache.readQuery({
        query: GET_MESSAGES,
      });
      // TODO: define custom merge functions

      const isNew =
        !current.some((c) => c.id === messageAdded.id) &&
        messageAdded.userId !== userId;
      if (isNew) {
        const updated = [messageAdded].concat(current);
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { messages: updated },
        });
      }
    },
  });

  const [delMessage] = useMutation(DELETE_MESSAGE, {
    update(
      cache,
      {
        data: { deleteOnemessage },
      }
    ) {
      const { messages: current } = cache.readQuery({
        query: GET_MESSAGES,
      });
      const updated = current.filter((c) => c.id !== deleteOnemessage.id);
      cache.writeQuery({
        query: GET_MESSAGES,
        data: { messages: updated },
      });
    },
  });

  if (loading) {
    return <p>{"Loading..."}</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const { messages } = data;

  return (
    <React.Fragment>
      <h4>Messages</h4>
      {loading && <p>Loading...</p>}
      <h6>New</h6>
      {newData ? (
        <code>
          Just Posted: {newData.messageAdded.message} by{" "}
          {newData.messageAdded.user.name}!
        </code>
      ) : (
        <code>Listening...</code>
      )}
      <h6>Last 5</h6>
      <ul>
        {messages?.length &&
          messages.map((m) => (
            <li key={m.id}>
              {m.message} - {m.user.name} - {m.timestamp} {"   "}
              {userId === m.userId && (
                <button onClick={() => delMessage({ variables: { id: m.id } })}>
                  Delete
                </button>
              )}
            </li>
          ))}
      </ul>
    </React.Fragment>
  );
};
