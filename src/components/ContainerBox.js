import React from 'react';

/**
 *  C - A simple React component with max width set to average mobile size
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the box
 * @param {string} props.backgroundColor - Background color of the box (default: white)
 * @param {string} props.textColor - Text color inside the box (default: black)
 * @param {number} props.padding - Padding inside the box in pixels (default: 16)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement}
 */
const ContainerBox = ({
  children,
  backgroundColor = '#6253F5',
  textColor = 'black',
  padding = 0,
  className = '',
}) => {
  const boxStyle = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor,
    color: textColor,
    padding: `${padding}px`,
  };

  return (
    <div style={boxStyle} className={className}>
      {children}
    </div>
  );
};

export default ContainerBox;