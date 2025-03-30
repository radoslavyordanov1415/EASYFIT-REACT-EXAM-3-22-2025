import React from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import "../styles/Footer.css";

export default function Footer() {
    return (
        <div className="footer">
            <div className="socialMedia">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon />
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                    <XIcon />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                </a>
            </div>
            <p>&copy; 2025 EasyFit.com</p>
        </div>
    );
}