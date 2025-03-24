import React from "react";
import "../styles/About.css";

export default function About() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About EasyFit</h1>
                <p className="tagline">Your Morning Outfit Planning Made Easy</p>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        EasyFit is designed for busy professionals and anyone who wants to streamline their
                        morning routine. We understand that choosing the perfect outfit can be time-consuming,
                        so we've created a platform that helps you plan and organize your outfits in advance,
                        making your mornings stress-free and efficient.
                    </p>
                </section>

                <section className="about-section features">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Outfit Planning</h3>
                            <p>Plan your outfits days in advance using our virtual mannequin</p>
                        </div>
                        <div className="feature-card">
                            <h3>Weekly Schedule</h3>
                            <p>Schedule different outfits for each day of the week</p>
                        </div>
                        <div className="feature-card">
                            <h3>Weather Integration</h3>
                            <p>Get outfit suggestions based on upcoming weather forecast</p>
                        </div>
                        <div className="feature-card">
                            <h3>Smart Organization</h3>
                            <p>Categorize outfits by occasion, weather, and dress code</p>
                        </div>
                        <div className="feature-card">
                            <h3>Quick Picks</h3>
                            <p>Access your favorite pre-planned outfits with just one click</p>
                        </div>
                        <div className="feature-card">
                            <h3>Time Saver</h3>
                            <p>Reduce your morning routine by having outfits ready to go</p>
                        </div>
                    </div>
                </section>

                <section className="about-section how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Upload Wardrobe</h3>
                            <p>Add your clothing items once to your virtual closet</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Create Outfits</h3>
                            <p>Plan and save different combinations for various occasions</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Schedule</h3>
                            <p>Assign outfits to specific days and get morning notifications</p>
                        </div>
                    </div>
                </section>

                <section className="about-section team">
                    <h2>Why EasyFit?</h2>
                    <p>
                        Created by people who understand the morning rush, EasyFit is your solution to
                        the daily "what to wear" dilemma. Our team combines expertise in fashion and
                        technology to help you look your best without the stress of last-minute decisions.
                        Whether you're a busy professional, a parent on the go, or someone who wants to
                        optimize their morning routine, EasyFit is here to make your life easier.
                    </p>
                </section>

                <section className="about-section contact">
                    <h2>Get Started Today</h2>
                    <p>
                        Ready to transform your morning routine? Join EasyFit now and experience
                        stress-free outfit planning! Questions? Contact us at <a href="mailto:support@easyfit.com">support@easyfit.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}