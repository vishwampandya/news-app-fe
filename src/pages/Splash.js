import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import home_backdrop from '../assets/home_backdrop.png';
import logo from '../assets/logo_v2.png';

export default function BuzzarBriefSplash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/customize-feed');
        }, 2000); // 2000 milliseconds = 2 seconds

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [navigate]);

    // Define styles directly in the component
    const styles = {
      container: {
        height: "100vh",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        backgroundImage: `url(${home_backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      content: {
        textAlign: "center",
      },
      logoContainer: {
        width: "200px",
        marginBottom: "10px",
        left: "-2px",
        display: "flex",
        position: "relative",
      },
      logo: {
        width: "100%",
        height: "100%",
      },
      title: {
        fontSize: "3rem",
        fontWeight: "bold",
        letterSpacing: "0.2em",
        color: "white",
        marginBottom: "0.5rem",
        lineHeight: "1.2",
        textTransform: "uppercase",
      },
      taglineContainer: {
        position: "absolute",
        top: "140%",
        padding: "5px",
        left: "50%",
        color: "white",
        fontFamily: "Poppins",
        transform: "translate(-50%, -50%)",
        border: "0.5px solid white",
        borderRadius: "80px",
        fontSize: "10.52px",
        letterSpacing: "0.88px",
        width: "198px",
        fontWeight: "400",
        fontStyle: "italic",
      },
    }
  
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Buzzar Brief Logo" style={styles.logo} />
            <div style={styles.taglineContainer}>
              Business ki Batein Brief me
            </div>
          </div>
        </div>
      </div>
    )
}