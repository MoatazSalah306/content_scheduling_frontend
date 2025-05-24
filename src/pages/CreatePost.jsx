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
    scheduled_at: "",
    status: "scheduled",
  });
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

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
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData((prev) => {
        if (name === "content") {
          setCharacterCount(value.length);
        }
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handlePlatformChange = (platformtype) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformtype)
        ? prev.platforms.filter((p) => p !== platformtype)
        : [...prev.platforms, platformtype],
    }));
  };

  const getCharacterCountClass = () => {
    if (characterCount > 280) return "char-counter danger";
    if (characterCount > 200) return "char-counter warning";
    return "char-counter";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="mb-20">Create New Post</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="What's on your mind?"
              rows="6"
            />
            <div className={getCharacterCountClass()}>
              {characterCount} characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
            {formData.image && (
              <div
                style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}
              >
                Selected: {formData.image.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Platforms</label>
            {platforms.length === 0 ? (
              <p style={{ color: "#666" }}>
                No platforms enabled.{" "}
                <a href="/settings">Enable platforms in settings</a>
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "10px",
                }}
              >
                {platforms.map((platform) => (
                  <label
                    type={platform.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.type)}
                      onChange={() => handlePlatformChange(platform.type)}
                    />
                    {platform.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {formData.status === "scheduled" && (
            <div className="form-group">
              <label htmlFor="scheduled_at">Schedule Date & Time</label>
              <input
                type="datetime-local"
                id="scheduled_at"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
