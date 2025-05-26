import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";
import { getEnabledPlatforms } from "../services/platformService";

const CreatePost = ({ showAlert }) => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    platforms: [],
    scheduled_at: null,
    status: "scheduled",
  });
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadPlatforms();

    // Set default datetime to 1 hour from now
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1);
    setFormData((prev) => ({
      ...prev,
      scheduled_at: defaultDate.toISOString().slice(0, 16),
    }));
  }, []);

  const loadPlatforms = async () => {
    try {
      const result = await getEnabledPlatforms();
      if (result.success) {
        setPlatforms(result.platforms);
      } else {
        showAlert("error", result.error || "Failed to load platforms");
      }
    } catch (error) {
      showAlert("error", "Error loading platforms");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.platforms.length === 0) {
      showAlert("error", "Please select at least one platform");
      return;
    }

    if (formData.status === "scheduled" && !formData.scheduled_at) {
      showAlert("error", "Scheduled date is required");
      return;
    }

    setLoading(true);

    try {
      const result = await createPost({
        ...formData,
        platforms: formData.platforms
          .map((platformtype) => {
            const platform = platforms.find((p) => p.type === platformtype);
            return platform ? platform.id : null;
          })
          .filter(Boolean),
        image: formData.image
      });

      if (result.success) {
        showAlert("success", "Post created successfully!");
        navigate("/dashboard");
      } else {
        showAlert("error", result.error || "Failed to create post");
      }
    } catch (error) {
      showAlert("error", error.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [name]: value,
        };

        // Update character count for content field
        if (name === "content") {
          setCharacterCount(value.length);
        }

        // Set scheduled_at to null if status is not "scheduled"
        if (name === "status" && value !== "scheduled") {
          updatedData.scheduled_at = null;
        }

        return updatedData;
      });
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handlePlatformChange = (platformtype) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformtype)
        ? prev.platforms.filter((p) => p !== platformtype)
        : [...prev.platforms, platformtype],
    }));
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    document.getElementById('image').value = '';
  };

  const getCharacterCountColor = () => {
    if (characterCount > 280) return '#dc3545';
    if (characterCount > 200) return '#ffc107';
    return '#6c757d';
  };

  const getPlatformIcon = (type) => {
    const icons = {
      twitter: 'bi bi-twitter',
      facebook: 'bi bi-facebook',
      instagram: 'bi bi-instagram',
      linkedin: 'bi bi-linkedin',
      youtube: 'bi bi-youtube'
    };
    return icons[type] || 'bi bi-phone';
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #007BFF 0%, #00b7eb 100%)',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#e9ecef',
      fontSize: '16px',
      fontWeight: '400',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
    },
    formGroup: {
      marginBottom: '28px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      fontFamily: 'inherit',
    },
    inputFocus: {
      borderColor: '#007BFF',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '15px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '120px',
      transition: 'all 0.3s ease',
    },
    characterCounter: {
      marginTop: '8px',
      fontSize: '13px',
      fontWeight: '500',
      textAlign: 'right',
      color: getCharacterCountColor(),
    },
    fileInputWrapper: {
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      width: '100%',
    },
    fileInput: {
      opacity: 0,
      position: 'absolute',
      zIndex: -1,
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '20px',
      border: '2px dashed #007BFF',
      borderRadius: '10px',
      backgroundColor: 'rgba(0, 123, 255, 0.05)',
      color: '#007BFF',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    imagePreview: {
      marginTop: '15px',
      position: 'relative',
      display: 'inline-block',
    },
    previewImage: {
      maxWidth: '200px',
      maxHeight: '200px',
      borderRadius: '10px',
      border: '2px solid #e9ecef',
    },
    removeImageBtn: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    platformsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
    },
    platformCard: {
      padding: '16px',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    platformCardSelected: {
      borderColor: '#007BFF',
      backgroundColor: 'rgba(0, 123, 255, 0.05)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
    },
    platformIcon: {
      fontSize: '20px',
    },
    platformName: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#333',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '15px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '40px',
      paddingTop: '30px',
      borderTop: '1px solid #e9ecef',
    },
    button: {
      padding: '12px 28px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    primaryButton: {
      backgroundColor: '#007BFF',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
    disabledButton: {
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      cursor: 'not-allowed',
    },
    noPlatforms: {
      textAlign: 'center',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      border: '1px solid #e9ecef',
    },
    noPlatformsText: {
      color: '#6c757d',
      marginBottom: '15px',
    },
    settingsLink: {
      color: '#007BFF',
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Post</h1>
        <p style={styles.subtitle}>Share your content across multiple platforms</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="title">
              Post Title *
            </label>
            <input
              style={styles.input}
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter an engaging title for your post"
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="content">
              Content *
            </label>
            <textarea
              style={styles.textarea}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="What's on your mind? Share your thoughts..."
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            <div style={styles.characterCounter}>
              {characterCount} characters
              {characterCount > 280 && " (exceeds Twitter limit)"}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Image (optional)</label>
            <div style={styles.fileInputWrapper}>
              <input
                style={styles.fileInput}
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
              <label 
                htmlFor="image" 
                style={styles.fileInputLabel}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.05)'}
              >
                <i className="bi bi-image"></i> Choose Image or Drag & Drop
              </label>
            </div>
            
            {imagePreview && (
              <div style={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                <button
                  type="button"
                  style={styles.removeImageBtn}
                  onClick={removeImage}
                  title="Remove image"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Platforms *</label>
            {platforms.length === 0 ? (
              <div style={styles.noPlatforms}>
                <p style={styles.noPlatformsText}>
                  No platforms are currently enabled
                </p>
                <a href="/settings" style={styles.settingsLink}>
                  Configure platforms in Settings →
                </a>
              </div>
            ) : (
              <div style={styles.platformsGrid}>
                {platforms.map((platform) => (
                  <div
                    key={platform.type}
                    style={{
                      ...styles.platformCard,
                      ...(formData.platforms.includes(platform.type) ? styles.platformCardSelected : {})
                    }}
                    onClick={() => handlePlatformChange(platform.type)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.type)}
                      onChange={() => handlePlatformChange(platform.type)}
                      style={{ display: 'none' }}
                    />
                    <i className={getPlatformIcon(platform.type)} style={styles.platformIcon}></i>
                    <span style={styles.platformName}>{platform.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="status">
              Post Status
            </label>
            <select
              style={styles.select}
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="scheduled"><i className="bi bi-calendar"></i> Schedule for later</option>
              <option value="draft"><i className="bi bi-file-earmark-text"></i> Save as draft</option>
            </select>
          </div>

          {formData.status === "scheduled" && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="scheduled_at">
                Schedule Date & Time *
              </label>
              <input
                style={styles.input}
                type="datetime-local"
                id="scheduled_at"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                min={getCurrentDateTime()}
                required
                onFocus={(e) => e.target.style.borderColor = '#007BFF'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{...styles.button, ...styles.secondaryButton}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              <i className="bi bi-x-circle"></i> Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.button, 
                ...(loading ? styles.disabledButton : styles.primaryButton)
              }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007BFF')}
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split"></i> Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle"></i> Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;