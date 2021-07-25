import React from "react";
import { FaStar } from "react-icons/fa";

const Star = ({ marked, starId }) => {
  return (
    <FaStar data-star-id={starId} className={marked ? "" : "opacity-20"} />
  );
};

const StarRating = ({ value, color }) => {
  const [rating, setRating] = React.useState(parseInt(value) || 0);
  const [selection, setSelection] = React.useState(0);

  return (
    <div className={`flex text-{$color}`}>
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1}`}
          marked={selection ? selection >= i + 1 : rating >= i + 1}
        />
      ))}
    </div>
  );
};

export default StarRating;
