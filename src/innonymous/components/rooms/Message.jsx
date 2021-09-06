import React from 'react';

function Message(props) {
    const {
        uuid,
        user_uuid,
        time,
        data,
    } = props;

    return <div>
        <span>{data}</span>
  </div>
}

export { Message };