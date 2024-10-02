import React from 'react';

const LoginButton = () => {
  const LoginButtonStyle = {
    "borderRadius": "8px",
    "border": "1px solid transparent",
    "padding": "0.6em 1.2em",
    "fontSize": "1em",
    "fontWeight": "500",
   " fontFamily": "inherit",
    "backgroundColor": "#464646",
    "cursor": "pointer",
    "transition": "border-color 0.25s",
  };

  const LoginButtonHoverStyle = {
    backgroundColor: 'darkgreen',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type="submit"
      style={
        isHovered
          ? { ...LoginButtonStyle, ...LoginButtonHoverStyle }
          : LoginButtonStyle
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        console.log('login');
      }}
    >
      login
    </button>
  );
};

export default LoginButton;
