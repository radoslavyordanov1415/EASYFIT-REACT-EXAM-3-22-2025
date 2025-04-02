import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/Catalog.css";
import { fetchOutfits, deleteOutfit } from "../api/apiHelper.js"; // Import API functions

export default function Catalog() {
    const [outfits, setOutfits] = useState([]);
    const [filteredOutfits, setFilteredOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState({
        season: "",
        fitType: ""
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, outfitId: null });
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        const loadOutfits = async () => {
            try {
                const data = await fetchOutfits();
                setOutfits(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadOutfits();
    }, []);

    const handleDelete = async (outfitId) => {
        try {
            await deleteOutfit(outfitId);
            setOutfits((prev) => prev.filter((o) => o._id !== outfitId));
        } catch (err) {
            console.error("Error deleting outfit:", err);
        }
    };

    const handleEdit = (outfitId) => {
        navigate(`/edit/${outfitId}`);
    };

    const handleViewDetails = (outfitId) => {
        navigate(`/outfit/${outfitId}`);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDeleteClick = (outfitId) => {
        setDeleteConfirmation({ show: true, outfitId });
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteOutfit(deleteConfirmation.outfitId);
            setOutfits((prev) => prev.filter((outfit) => outfit._id !== deleteConfirmation.outfitId));
            setAlert({ message: "Outfit deleted successfully", type: "success" });
        } catch (err) {
            setAlert({ message: "Failed to delete outfit", type: "error" });
        } finally {
            setDeleteConfirmation({ show: false, outfitId: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, outfitId: null });
    };

    useEffect(() => {
        let result = [...outfits];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(outfit =>
                outfit.name?.toLowerCase().includes(searchLower) ||
                outfit.description?.toLowerCase().includes(searchLower) ||
                outfit.season?.toLowerCase().includes(searchLower) ||
                outfit.fitType?.toLowerCase().includes(searchLower)
            );
        }

        if (filterBy.season) {
            result = result.filter(outfit =>
                outfit.season?.toLowerCase() === filterBy.season.toLowerCase()
            );
        }
        if (filterBy.fitType) {
            result = result.filter(outfit =>
                outfit.fitType?.toLowerCase() === filterBy.fitType.toLowerCase()
            );
        }

        setFilteredOutfits(result);
    }, [outfits, searchTerm, filterBy]);

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h2>Outfit Catalog</h2>
                <Link to="/create" className="new-outfit-btn">
                    Create New Outfit
                </Link>
            </div>

            <div className="catalog-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search outfits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={filterBy.season}
                        onChange={(e) => setFilterBy(prev => ({ ...prev, season: e.target.value }))}
                    >
                        <option value="">All Seasons</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                    </select>

                    <select
                        value={filterBy.fitType}
                        onChange={(e) => setFilterBy(prev => ({ ...prev, fitType: e.target.value }))}
                    >
                        <option value="">All Fit Types</option>
                        <option value="Slim">Slim</option>
                        <option value="Regular">Regular</option>
                        <option value="Loose">Loose</option>
                        <option value="Oversized">Oversized</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Loading outfits..." />
            ) : filteredOutfits.length === 0 ? (
                <div className="no-outfits">
                    <p>No outfits found. Create your first outfit!</p>
                </div>
            ) : (
                <div className="outfits-grid">
                    {filteredOutfits.map((outfit) => (
                        <div key={outfit._id} className="outfit-card">
                            <div className="outfit-header">
                                <h3>{outfit.name || "Unnamed Outfit"}</h3>
                                <p>Created: {formatDate(outfit.createdAt)}</p>
                            </div>
                            <div className="outfit-content">
                                <div
                                    className="outfit-preview"
                                    onClick={() => handleViewDetails(outfit._id)}
                                    style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}
                                >
                                    <img
                                        src={outfit.mannequinImage || "/placeholder.svg"}
                                        alt="Mannequin"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                    {Object.entries(outfit.appliedClothing || {}).map(([key, item]) => {
                                        return (
                                            <img
                                                key={key}
                                                src={item.imageUrl || "/placeholder.svg"}
                                                alt={`Clothing item ${key}`}
                                                style={{
                                                    position: "absolute",
                                                    left: item.x ? `${item.x + 2}px` : "50%",
                                                    top: item.y ? `${item.y}px` : "50%",
                                                    width: item.width ? `${item.width}px` : "100px",
                                                    height: item.height ? `${item.height}px` : "100px",
                                                    objectFit: "cover",
                                                    zIndex: 10,
                                                    transform: item.x ? "none" : "translate(-50%, -50%)",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="outfit-summary">
                                    <p>Season: {outfit.season || "Not specified"}</p>
                                    <p>Occasion: {outfit.occasion || "Not specified"}</p>
                                    <p>Comfort Level: {outfit.comfortLevel || "Not specified"}</p>
                                    <p>Budget: {outfit.budget || "Not specified"}</p>
                                    <p>Fit Type: {outfit.fitType || "Not specified"}</p>

                                    <button onClick={() => handleViewDetails(outfit._id)} className="view-details-btn">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="outfit-actions">
                                <button
                                    onClick={() => handleDeleteClick(outfit._id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                                <button onClick={() => handleEdit(outfit._id)} className="edit-btn">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteConfirmation.show && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this outfit?</p>
                        <div className="confirmation-buttons">
                            <button onClick={handleConfirmDelete} className="delete-btn">Delete</button>
                            <button onClick={handleCancelDelete} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}