import React from "react";

const Card = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No news available to display.</p>; // Fallback when no data is passed
  }

  // Filter out items with missing or incomplete data
  const filteredData = data.filter(
    (item) =>
      item.title?.trim() &&
      item.description?.trim() &&
      item.url?.trim() &&
      item.urlToImage?.trim() // Adjust field name for image (API dependent)
  );

  if (filteredData.length === 0) {
    return <p>No valid news articles to display.</p>; // Fallback when filtered data is empty
  }

  return (
    <div className="card-container">
      {filteredData.map((curItem, index) => (
        <div className="card" key={index}>
          <img
            src={curItem.urlToImage}
            alt={curItem.title}
            onError={(e) => (e.target.style.display = "none")} // Hide broken images
          />
          <div className="card-content">
            <a href={curItem.url} target="_blank" rel="noopener noreferrer">
              <h2>{curItem.title}</h2>
            </a>
            <p>{curItem.description}</p>
            <button>Read More</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
