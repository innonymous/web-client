import { Message } from './Message';

function Messages(props) {
  const { messages = [] } = props;

  return (
    <div className="messages">
      {messages.length ? (
        console.log('Done'),
        messages.map((message) => <Message key={messaage.uuid} {...message} />)
      ) : (
        <h5>No results found. Please check mistakes.</h5>
      )}
    </div>
  );
}

export { Messages };