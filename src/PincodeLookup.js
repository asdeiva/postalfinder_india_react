import React, { useState } from "react";
import "./PincodeLookup.css";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [postalData, setPostalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    handleFilter();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (pincode.length !== 6) {
      setError("Pincode should be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      console.log(data);

      if (data[0].Status === "Error") {
        setError(data[0].Message);
        setLoading(false);
        return;
      }

      setPostalData(data[0].PostOffice);
      setFilteredData(data[0].PostOffice);
      setLoading(false);
      document.getElementById("pinFinder").classList.add("hide");
    } catch (error) {
      setError("Error fetching postal data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filtered = postalData.filter((data) =>
      data.Name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="finder">
      <form onSubmit={handleSubmit} className="pinfinder" id="pinFinder">
        <label className="ele" for="text">
         <strong>Enter Pincode:</strong> 
        </label>
        <input
          className="ele"
          placeholder="Pincode"
          type="text"
          value={pincode}
          onChange={handleChange}
        />
        <button className="ele" type="submit">
          Lookup
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {postalData.length > 0 && (
        <div>
          <div className="filterAction">
            <div className="ele">
               <strong>Pincode: {pincode}</strong> 
            </div>
            <div className="ele">
               <strong> Message :</strong> Number of pincode(s) found : <strong>{postalData.length}</strong>
            </div>
            <input className="ele" type="text" placeholder="Filter" value={filter} onChange={handleFilterChange} />
            {/* <button className="ele" onClick={handleFilter}>Filter</button> */}
          </div>
          {filteredData.length > 0 ? (
            <div className="container">
              {filteredData.map((data) => (
                <div key={data.Name} className="item">
                  <div>Name: {data.Name}</div>
                  <div>Branch Type: {data.BranchType}</div>
                  <div>Delivery Status: {data.DeliveryStatus}</div>
                  <div>District: {data.District}</div>
                  <div>Division: {data.Division}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>Couldn’t find the postal data you’re looking for…</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
