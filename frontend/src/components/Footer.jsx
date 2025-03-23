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
                <InstagramIcon /> <FacebookIcon /> <XIcon /> <LinkedInIcon />
            </div>
            <p>&copy; 2025 EasyFit.com</p>
        </div>
    )
}