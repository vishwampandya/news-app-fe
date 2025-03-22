import React from 'react';

/**
 * MobileBox - A simple React component with max width set to average mobile size
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the box
 * @param {string} props.backgroundColor - Background color of the box (default: white)
 * @param {string} props.textColor - Text color inside the box (default: black)
 * @param {number} props.padding - Padding inside the box in pixels (default: 16)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement}
 */
const MobileBox = ({
  children,
  backgroundColor = '#6253F5',
  textColor = 'black',
  className = '',
}) => {
  const boxStyle = {
    maxWidth: '375px', // Average mobile screen width
    width: '100%',
    height: '100%',
    backgroundColor,
    color: textColor,
  };

  return (
    <div style={boxStyle} className={className}>
      {children}
    </div>
  );
};

export default MobileBox;