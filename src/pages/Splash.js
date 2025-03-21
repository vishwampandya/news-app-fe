import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuzzarBriefSplash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/article-view');
        }, 2000); // 2000 milliseconds = 5 seconds

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [navigate]);

    // Define styles directly in the component
    const styles = {
      container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#5D4FFF",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
      },
      content: {
        textAlign: "center",
      },
      logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1rem",
      },
      logo: {
        width: "80px",
        height: "80px",
        objectFit: "contain",
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
        marginTop: "1rem",
        color: "white",
        fontSize: "0.875rem",
        fontWeight: "300",
      },
      taglineWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      line: {
        width: "2.5rem",
        height: "1px",
        backgroundColor: "white",
      },
      lineLeft: {
        marginRight: "0.75rem",
      },
      lineRight: {
        marginLeft: "0.75rem",
      },
      tagline: {
        fontStyle: "italic",
      },
    }
  
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.logoContainer}>
            {/* Using the logo from public folder */}
            <img src="/splash_screen_logo.png" alt="Buzzar Brief Logo" style={styles.logo} />
          </div>
          <h1 style={styles.title}>
            BUZZAR
            <br />
            BRIEF
          </h1>
          <div style={styles.taglineContainer}>
            <div style={styles.taglineWrapper}>
              <div style={{ ...styles.line, ...styles.lineLeft }}></div>
              <p style={styles.tagline}>Business ki Batein Brief me</p>
              <div style={{ ...styles.line, ...styles.lineRight }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  