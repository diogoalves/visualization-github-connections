import React from 'react';

const Avatar = ({ id, url }) => (
  <defs>
    <pattern
      id={`avatar-${id}`}
      x="0%"
      y="0%"
      height="100%"
      width="100%"
      viewBox="0 0 512 512"
    >
      <image x="0%" y="0%" width="512" height="512" href={url} />
    </pattern>
  </defs>
);

export default Avatar;
