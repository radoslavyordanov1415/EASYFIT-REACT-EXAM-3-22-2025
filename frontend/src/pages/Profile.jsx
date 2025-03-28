import { useEffect, useState, useRef } from "react";
import { useAuth } from "../components/context/AuthenticationContex";
import { Link } from "react-router-dom";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/Profile.css";

const OutfitPreview = ({ outfit }) => {
    return (
        <div className="outfit-preview">
            <img
                src={outfit.mannequinImage || "/placeholder.svg"}
                alt="Mannequin"
                className="mannequin-base"
            />
            {Object.entries(outfit.appliedClothing || {}).map(([key, item]) => (
                <img
                    key={key}
                    src={item.imageUrl}
                    alt={`Clothing item ${key}`}
                    className="clothing-layer"
                    style={{
                        position: "absolute",
                        left: item.x ? `${item.x + 2}px` : "50%",
                        top: item.y ? `${item.y}px` : "50%",
                        width: item.width ? `${item.width}px` : "100px",
                        height: item.height ? `${item.height}px` : "100px",
                        transform: item.x ? "none" : "translate(-50%, -50%)",
                    }}
                />
            ))}
        </div>
    );
};

export default function Profile() {
    const { isLoggedIn, user } = useAuth();
    const [userStats, setUserStats] = useState({
        totalOutfits: 0,
        recentOutfits: [],
        favoriteSeasons: {},
        favoriteOccasions: {},
    });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: "", type: "" });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const statsResponse = await fetch("http://localhost:5005/api/outfits/stats", {
                    credentials: "include",
                });
                const statsData = await statsResponse.json();
                setUserStats(statsData);

                const recentResponse = await fetch("http://localhost:5005/api/outfits/recent", {
                    credentials: "include"
                });
                if (!recentResponse.ok) throw new Error("Failed to fetch recent outfits");
                const recentData = await recentResponse.json();
                setUserStats(prev => ({ ...prev, recentOutfits: recentData.outfits }));
            } catch (err) {
                console.error("Profile data fetch error:", err);
                setAlert({
                    message: "Failed to load profile data",
                    type: "error"
                });
            } finally {
                setLoading(false);
            }
        };
        if (isLoggedIn) fetchProfileData();
    }, [isLoggedIn]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    if (loading) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                {user && (
                    <>
                        <div className="profile-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>Welcome, {user.username}!</h2>
                            <p>Email: {user.email}</p>
                        </div>
                    </>
                )}
            </div>

            {alert.message && <AlertBox message={alert.message} type={alert.type} />}

            <div className="profile-stats">
                <div className="stats-card">
                    <h3>Your Outfit Stats</h3>
                    <p>Total Outfits: {userStats.totalOutfits}</p>
                    <div className="stats-details">
                        <div className="stats-column">
                            <h4>Favorite Seasons</h4>
                            <ul>
                                {Object.entries(userStats.favoriteSeasons).length ? (
                                    Object.entries(userStats.favoriteSeasons)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 3)
                                        .map(([season, count]) => (
                                            <li key={season}>{season}: {count} outfits</li>
                                        ))
                                ) : (
                                    <li>No data available</li>
                                )}
                            </ul>
                        </div>
                        <div className="stats-column">
                            <h4>Favorite Occasions</h4>
                            <ul>
                                {Object.entries(userStats.favoriteOccasions).length ? (
                                    Object.entries(userStats.favoriteOccasions)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 3)
                                        .map(([occasion, count]) => (
                                            <li key={occasion}>{occasion}: {count} outfits</li>
                                        ))
                                ) : (
                                    <li>No data available</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-recent">
                <h3>Recent Outfits</h3>
                {userStats.recentOutfits.length ? (
                    <div className="outfits-grid">
                        {userStats.recentOutfits.map((outfit) => (
                            <div key={outfit._id} className="outfit-card">
                                <div className="outfit-header">
                                    <h4>{outfit.name || "Unnamed Outfit"}</h4>
                                    <p>Created: {formatDate(outfit.createdAt)}</p>
                                </div>
                                <Link to={`/outfit/${outfit._id}`} className="outfit-content">
                                    <OutfitPreview outfit={outfit} />
                                    <div className="outfit-summary">
                                        <p>Season: {outfit.season || "Not specified"}</p>
                                        <p>Occasion: {outfit.occasion || "Not specified"}</p>
                                        <p>Fit Type: {outfit.fitType || "Not specified"}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-outfits">You haven't created any outfits yet.</p>
                )}

                <div className="profile-actions">
                    <Link to="/catalog" className="view-all-btn">View All Outfits</Link>
                    <Link to="/create" className="create-btn">Create New Outfit</Link>
                </div>
            </div>
        </div>
    );
}