import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function InventoryUpload() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [artType, setArtType] = useState("");

  // ✅ Store all 3 images in a single state object
  const [files, setFiles] = useState({
    image: null,   // required
    image_2: null, // optional
    image_3: null, // optional
  });

  const [redirect, setRedirect] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.is_admin !== 1) {
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  if (user.is_admin !== 1) {
    if (redirect) return <Navigate to="/" replace />;
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>401 Unauthorized</h2>
        <p>You are not allowed to access this page. Redirecting…</p>
      </div>
    );
  }

  // ✅ Update specific file field
  const handleFileChange = (e, field) => {
    setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.image) {
      alert("Main product image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("art_type", artType);

    // Append images (skip optional if null)
    formData.append("image", files.image); // required
    if (files.image_2) formData.append("image_2", files.image_2);
    if (files.image_3) formData.append("image_3", files.image_3);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Product added successfully!");
        // Clear form
        setName("");
        setPrice("");
        setDescription("");
        setArtType("");
        setFiles({ image: null, image_2: null, image_3: null });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Main Product Image (required):</label>
          <input
            type="file"
            name="image"
            required
            onChange={(e) => handleFileChange(e, "image")}
          />
        </div>

        <div>
          <label>Optional Image 2:</label>
          <input
            type="file"
            name="image_2"
            onChange={(e) => handleFileChange(e, "image_2")}
          />
        </div>

        <div>
          <label>Optional Image 3:</label>
          <input
            type="file"
            name="image_3"
            onChange={(e) => handleFileChange(e, "image_3")}
          />
        </div>

        <div>
          <label>Art Type:</label>
          <select
            value={artType}
            onChange={(e) => setArtType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="pottery">Pottery</option>
            <option value="painting">Painting</option>
            <option value="photographic print">Photographic Print</option>
          </select>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button className="amazon-cart-btn" type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
}