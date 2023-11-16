import React from 'react';

function SignIn() {
  return (
    <div>
      <h2>Sign In to Hauler</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
