import React, { useState, useEffect } from 'react';
import './ComplaintHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
const ComplaintHistory = ({ onClose }) => {
    const { id: complaintId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [currentImageSet, setCurrentImageSet] = useState([]);
    useEffect(() => {
        const fetchComplaintHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/api/complaints/${complaintId}/history/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch complaint history');
                }

                const data = await response.json();

                // Fetch department names for each action
                const historyWithNames = await Promise.all(data.map(async (action) => {
                    let toDeptName = action.to_department_name;
                    let fromDeptName = action.from_department_name;

                    // If names aren't included in the initial response, fetch them
                    if (!toDeptName && action.to_department) {
                        toDeptName = await fetchDepartmentName(action.to_department);
                    }
                    if (!fromDeptName && action.from_department) {
                        fromDeptName = await fetchDepartmentName(action.from_department);
                    }

                    return {
                        ...action,
                        to_department_name: toDeptName,
                        from_department_name: fromDeptName
                    };
                }));

                setHistory(historyWithNames);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchDepartmentName = async (departmentId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/departments/${departmentId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) {
                    return "Unknown Department";
                }
                const data = await response.json();
                return data.name || "Unknown Department";
            } catch {
                return "Unknown Department";
            }
        };

        fetchComplaintHistory();
    }, [complaintId]);

    const getActionIcon = (action) => {
        switch (action) {
            case 'accepted':
                return '✅';
            case 'rejected':
                return '❌';
            case 'forwarded':
                return '➡️';
            case 'reassigned':
            case 'reassigned by admin':
                return '🔄';
            case 'disposed':
                return '🗃️';
            case 'admin_review':
                return '⚠️';
            default:
                return '📝';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleImageClick = (images, index) => {
        setCurrentImageSet(images); // ✅ Save the set
        setCurrentImage(images[index].url);
        setImageIndex(index);
    };

    const handlePrevImage = () => {
        const newIndex = (imageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        setCurrentImage(currentImageSet[newIndex].url);
        setImageIndex(newIndex);
    };

    const handleNextImage = () => {
        const newIndex = (imageIndex + 1) % currentImageSet.length;
        setCurrentImage(currentImageSet[newIndex].url);
        setImageIndex(newIndex);
    };

    const closeImageModal = () => {
        setCurrentImage(null);
    };

    if (loading) return <div className="loading">Loading history...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="complaint-history-modal">
            <div className="modal-header">
                <h3>Complaint #{complaintId} History</h3>
                <button className="close-btn" onClick={() => window.close()}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <div className="timeline-container">
                <div className="timeline">
                    {history.map((item) => {
                        const currentImageSet = item.action_details?.resolution_images || [];
                        return (
                            <div key={item.id} className={`timeline-item ${item.action.replace(' ', '-')}`}>
                                <div className="timeline-icon">
                                    {getActionIcon(item.action)}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <span className="action">{item.action}</span>
                                        <span className="timestamp">{formatTimestamp(item.timestamp)}</span>
                                    </div>
                                    <div className="performed-by">
                                        By: <strong>{item.performed_by_name}</strong>
                                    </div>

                                    {item.from_department_name && (
                                        <div className="department">
                                            From: <strong>{item.from_department_name}</strong>
                                        </div>
                                    )}

                                    {item.to_department_name && (
                                        <div className="department">
                                            To: <strong>{item.to_department_name}</strong>
                                        </div>
                                    )}

                                    {item.remarks && (
                                        <div className="remarks">
                                            <strong>Remarks:</strong> {item.remarks}
                                        </div>
                                    )}

                                    {item.action_details && (
                                        <div className="action-details">
                                            <div>
                                                Status changed from <strong>{item.action_details.previous_status}</strong> to <strong>{item.action_details.new_status}</strong>
                                            </div>

                                            {currentImageSet.length > 0 && (
                                                <div className="resolution-images">
                                                    <strong>Resolution Images:</strong>
                                                    <div className="image-grid">
                                                        {currentImageSet.map((img, index) => (
                                                            <div
                                                                key={index}
                                                                className="image-thumbnail"
                                                                onClick={() => handleImageClick(currentImageSet, index)}
                                                            >
                                                                <img src={`http://127.0.0.1:8000${img.url}`} alt={`Resolution ${index + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {currentImage && (
                <div className="image-modal-overlay" onClick={closeImageModal}>
                    <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="nav-btn prev-btn" onClick={handlePrevImage}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <img src ={`http://127.0.0.1:8000${currentImage}`} alt="Resolution" className="modal-image" />
                        <button className="nav-btn next-btn" onClick={handleNextImage}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <button className="close-image-btn" onClick={closeImageModal}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintHistory;