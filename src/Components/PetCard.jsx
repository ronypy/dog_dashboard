import React from "react";
import { Link } from "react-router-dom";
const PetCard = (props) => {
  return (
    <div className="pet-card">
      <img src={props.imageUrl} alt={`Picture of ${props.name}`} />
      <h3>{props.name}</h3>
      <h4>⦿ {props.breed}</h4>
      <h4>⦿ {props.gender}</h4>
      <h4>⦿ {props.age}</h4>
      <Link to={`/dogDetails/${props.id}`} key={props.id}>
        <button className="pet-card-button">Learn More</button>
      </Link>
    </div>
  );
};
export default PetCard;
