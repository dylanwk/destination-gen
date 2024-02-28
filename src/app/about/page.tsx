import React from 'react';

const Page = () => {
  const name = 'John Doe';
  const age = 25;
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page</p>
      <div>{name}</div>
    </div>
  );
};

export default Page;
