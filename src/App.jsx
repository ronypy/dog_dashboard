import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import PetCard from "./Components/PetCard";
import DogChart from "./Components/DogChart";
const API_KEY = import.meta.env.VITE_APP_API_KEY;
const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;
const API_URL = "https://api.petfinder.com/v2/animals";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [modeAge, setModeAge] = useState(null);
  const [mostCommonBreed, setMostCommonBreed] = useState(null);
  const [ageCategoryCounts, setAgeCategoryCounts] = useState({});
  const [selectedGender, setSelectedGender] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  const [pageNumber, setPageNumber] = useState(Math.floor(Math.random() * 680) + 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef(null);

  // Getting Access token
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axios.post("https://api.petfinder.com/v2/oauth2/token", {
          grant_type: "client_credentials",
          client_id: API_KEY,
          client_secret: SECRET_KEY,
        });

        const token = response.data.access_token;
        console.log("Access Token:", token);
        setAccessToken(token);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };
    getAccessToken();
  }, []);

  // Get Dog information
  useEffect(() => {
    const getAnimals = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            type: "dog",
            page: pageNumber,
            limit: 100,
            gender: selectedGender,
          },
        });

        const animalList = response.data.animals;

        const processedAnimals = animalList
          .filter((animal) => {
            const nameIsValid = /^[A-Za-z\s]+$/.test(animal.name);
            return nameIsValid && animal.photos.length > 0;
          })
          .map((animal) => ({
            imageUrl: animal.photos[0].medium,
            name: animal.name,
            breed: animal.breeds.primary,
            age: animal.age,
            gender: animal.gender,
            url: animal.url,
            id: animal.id,
          }));

        // Remove duplicates based on name, breed, age, and gender
        const uniqueAnimals = processedAnimals.reduce((acc, current) => {
          const x = acc.find(
            (item) =>
              item.name === current.name && item.breed === current.breed && item.age === current.age && item.gender === current.gender
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setAnimals(uniqueAnimals);

        const ageCounts = {};

        uniqueAnimals.forEach((animal) => {
          const ageCategory = animal.age;
          ageCounts[ageCategory] = (ageCounts[ageCategory] || 0) + 1;
        });

        let mode = null;
        let maxCount = 0;

        for (const ageCategory in ageCounts) {
          if (ageCounts[ageCategory] > maxCount) {
            maxCount = ageCounts[ageCategory];
            mode = ageCategory;
          }
        }

        setModeAge(mode);
        setAgeCategoryCounts(ageCounts);

        // Calculate the most common breed
        const breedCounts = {};
        uniqueAnimals.forEach((animal) => {
          const breed = animal.breed;
          breedCounts[breed] = (breedCounts[breed] || 0) + 1;
        });

        let mostCommonBreed = null;
        let breedMaxCount = 0;

        for (const breed in breedCounts) {
          if (breedCounts[breed] > breedMaxCount) {
            breedMaxCount = breedCounts[breed];
            mostCommonBreed = breed;
          }
        }

        // Set the most common breed state variable
        setMostCommonBreed(mostCommonBreed);

        console.log("Dog Data:", uniqueAnimals);
      } catch (error) {
        console.error("Error getting animal data:", error);
      }
    };

    getAnimals();
  }, [accessToken, selectedGender, pageNumber]);

  const nextDogPage = () => {
    const randomNum = Math.floor(Math.random() * 680) + 1;
    setPageNumber(randomNum); // Increment the page number
  };

  // Find the age category with the highest count (mode)
  let mode = null;
  let maxCount = 0;

  for (const ageCategory in ageCategoryCounts) {
    if (ageCategoryCounts[ageCategory] > maxCount) {
      maxCount = ageCategoryCounts[ageCategory];
      mode = ageCategory;
    }
  }

  // Function to filter animals based on search input
  const filterAnimals = (animals, searchInput) => {
    return animals.filter((animal) => {
      return (
        animal.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  };
  const filteredAnimals = searchInput ? filterAnimals(animals, searchInput) : animals;

  const handleButtonClick = () => {
    // Disable the button and start the animation
    setIsAnimating(true);
    nextDogPage();

    // Enable the button and stop the animation after 3 seconds
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="whole-page">
      <div className="app-page">
        <div className="app-row" id="top-app-row">
          <div className="cards-container">
            <div className="card">
              <h2>Most common age group in these results:</h2>
              <h1 className="number">{mode}</h1>
            </div>
            <div className="card">
              <h2>Most Popular Breed in these results:</h2>
              <h1 className="number">{mostCommonBreed}</h1>
            </div>
            <div className="card">
              <h2>Adoption Ready Doggies</h2>
              <h1 className="number">{filteredAnimals.length}</h1>
            </div>
          </div>
          <div className="Visualization-Container">
            <DogChart data={filteredAnimals} />
          </div>
        </div>
        <div className="app-row">
          <div className="list">
            <div className="filters">
              <div className="searchFilter">
                <input
                  type="text"
                  placeholder="Search by Name or Breed"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="genderFilter">
                <label>Find by Gender:</label>
                <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value === "Any" ? null : e.target.value)}>
                  <option value="Any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <button
                ref={buttonRef}
                className={`btn ${isAnimating ? "disabled" : ""}`}
                onClick={handleButtonClick}
                disabled={isAnimating}
              >
                More Dogs!
              </button>
            </div>
            <div className="pet-card-layout">
              {filteredAnimals.map((dog, index) => (
                <PetCard
                  imageUrl={dog.imageUrl}
                  name={dog.name}
                  breed={dog.breed}
                  age={dog.age}
                  gender={dog.gender}
                  key={index}
                  url={dog.url}
                  id={dog.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;