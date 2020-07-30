import { useQuery, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { GET_MESSAGES, DELETE_MESSAGE } from "./api";
import { AuthContext } from "../../AuthContext";

export const Messages = () => {
  const { loading, error, data } = useQuery(GET_MESSAGES);
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

  const { authState } = useContext(AuthContext);
  const userId = authState.user.id;

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
