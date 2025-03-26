import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthenticationContex';
import AlertBox from '../../AlertBox';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import '../../../styles/Community.css';

export default function Community() {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isLoggedIn, user } = useAuth();
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, outfitId: null });

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await fetch('http://localhost:5005/api/outfits/community/all', {
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to fetch outfits');

                const data = await response.json();
                setOutfits(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOutfits();
    }, []);

    const handleReaction = async (outfitId, reactionType) => {
        if (!isLoggedIn) return;

        try {
            const response = await fetch(
                `http://localhost:5005/api/outfits/${outfitId}/${reactionType}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) throw new Error('Reaction failed');

            const updatedOutfit = await response.json();

            setOutfits(prevOutfits =>
                prevOutfits.map(outfit => {
                    if (outfit._id === updatedOutfit._id) {
                        return {
                            ...outfit,
                            ...updatedOutfit,
                            userId: {
                                ...outfit.userId,
                                ...updatedOutfit.userId,
                            },
                        };
                    }
                    return outfit;
                })
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (outfitId) => {
        try {
            const response = await fetch(
                `http://localhost:5005/api/outfits/delete/${outfitId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) throw new Error('Delete failed');

            setOutfits(outfits.filter(outfit => outfit._id !== outfitId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClick = (outfitId) => {
        setDeleteConfirmation({ show: true, outfitId });
    };

    const handleConfirmDelete = async () => {
        try {
            await handleDelete(deleteConfirmation.outfitId);
        } finally {
            setDeleteConfirmation({ show: false, outfitId: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, outfitId: null });
    };

    if (loading) return <div className="loading">Loading community outfits...</div>;
    if (error) return <AlertBox message={error} type="error" />;

    return (
        <div className="community-container">
            <h1>Community Outfits</h1>
            <div className="outfits-grid">
                {outfits.map(outfit => (
                    <div key={outfit._id} className="outfit-card">
                        <Link to={`/outfit/${outfit._id}`}>
                            <div className="outfit-preview" style={{
                                position: 'relative',
                                width: '395px',
                                height: '600px',
                                margin: '0 auto',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={outfit.mannequinImage}
                                    alt="Mannequin"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                                {Object.entries(outfit.appliedClothing || {}).map(([key, item]) => (
                                    <img
                                        key={key}
                                        src={item.imageUrl}
                                        alt={`Clothing item ${key}`}
                                        style={{
                                            position: 'absolute',
                                            left: `${item.x}px`,
                                            top: `${item.y}px`,
                                            width: `${item.width}px`,
                                            height: `${item.height}px`,
                                            objectFit: 'cover',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </Link>
                        <div className="outfit-actions">
                            {/* Check if the current user is NOT the owner */}
                            {user?._id !== outfit.userId?._id ? (
                                <>
                                    <button onClick={() => handleReaction(outfit._id, 'like')}>
                                        <ThumbUpIcon style={{ color: outfit.likes?.includes(user?._id) ? 'green' : 'inherit' }} /> {outfit.likes?.length || 0}
                                    </button>
                                    <button onClick={() => handleReaction(outfit._id, 'dislike')}>
                                        <ThumbDownAltIcon style={{ color: outfit.dislikes?.includes(user?._id) ? 'red' : 'inherit' }} /> {outfit.dislikes?.length || 0}
                                    </button>
                                </>
                            ) : (
                                // If the user is the owner, only display the counts
                                <>
                                    <button disabled style={{ cursor: 'default' }}>
                                        <ThumbUpIcon /> {outfit.likes?.length || 0}
                                    </button>
                                    <button disabled style={{ cursor: 'default' }}>
                                        <ThumbDownAltIcon /> {outfit.dislikes?.length || 0}
                                    </button>
                                </>
                            )}
                            <Link to={`/outfit/${outfit._id}`}>
                                <ChatIcon /> {outfit.comments?.length || 0}
                            </Link>
                            {user?._id === outfit.userId?._id && (
                                <div className="owner-actions">
                                    <Link to={`/edit/${outfit._id}`}>Edit</Link>
                                    <button onClick={() => handleDeleteClick(outfit._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        <div className="outfit-author">
                            {outfit.userId?.avatar ? (
                                <img
                                    src={outfit.userId.avatar}
                                    alt={outfit.userId?.username}
                                />
                            ) : (
                                <PersonIcon />
                            )}
                            <span>{outfit.userId?.username}</span>
                        </div>
                    </div>
                ))}
            </div>
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