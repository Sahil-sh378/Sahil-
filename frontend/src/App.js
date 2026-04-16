import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("form");

  const API = "http://localhost:5000/api/feedback";

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(API);
      setFeedbacks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select rating ⭐");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("rating", rating);
    formData.append("message", message);
    if (image) formData.append("image", image);

    await axios.post(API + "/add", formData);

    setName("");
    setEmail("");
    setRating(0);
    setMessage("");
    setImage(null);

    alert("Feedback Submitted ✅");

    fetchFeedback();
    setActiveTab("history");
  };

  const deleteFeedback = async (id) => {
    await axios.delete(API + "/" + id);
    fetchFeedback();
  };

  const total = feedbacks.length;
  const avg =
    total > 0
      ? (feedbacks.reduce((a, b) => a + b.rating, 0) / total).toFixed(1)
      : 0;

  return (
    <div className="container">
      <h1 className="title">Feedback App</h1>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => setActiveTab("form")}
        >
          Submit
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>

        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
      </div>

      {/* FORM */}
      {activeTab === "form" && (
        <form className="form" onSubmit={submitFeedback}>

          <input
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          {/* ⭐ FIXED STARS */}
          <div className="stars">
            {[1,2,3,4,5].map((star)=>(
              <span
                key={star}
                onClick={(e)=>{
                  e.stopPropagation(); // important fix
                  setRating(star);
                }}
                style={{
                  fontSize: "28px",
                  cursor: "pointer",
                  color: rating >= star ? "gold" : "#ccc",
                  marginRight: "5px",
                  userSelect: "none"
                }}
              >
                ★
              </span>
            ))}
          </div>

          <p style={{fontSize:"14px"}}>
            Selected Rating: {rating} ⭐
          </p>

          <textarea
            placeholder="Comments"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e)=>setImage(e.target.files[0])}
          />

          <button type="submit">Submit Feedback</button>
        </form>
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <>
          <h2 className="subtitle">All Feedback</h2>

          <div className="feedback-list">
            {feedbacks.map((f)=>(
              <div key={f._id} className="card">

                <div className="card-header">
                  <h3>{f.name}</h3>
                  <span className="rating">{f.rating}/5</span>
                </div>

                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{width: `${f.rating * 20}%`}}
                  ></div>
                </div>

                <p className="stars">{"⭐".repeat(f.rating)}</p>

                {f.image && (
                  <img
                    src={`http://localhost:5000/uploads/${f.image}`}
                    alt="feedback"
                    className="feedback-img"
                  />
                )}

                <p>{f.message}</p>

                <button onClick={()=>deleteFeedback(f._id)}>
                  Delete
                </button>

              </div>
            ))}
          </div>
        </>
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <h2 className="subtitle">Dashboard</h2>

          <div className="dashboard">
            <h3>Total Feedback: {total}</h3>
            <h3>Average Rating: {avg} ⭐</h3>
          </div>
        </>
      )}

    </div>
  );
}

export default App;