import logo from './logo.svg';
import './App.css';
import _ from "lodash";
import React, { useState, useEffect } from "react"
import { getLocations, isNameValid } from "./mock-api/apis"

/**
 * Things id do if I had more time:
 * further beautify styling, Its pretty bare bones and could use some tricks like box shadows etc to make it pop
 * improve error handling
 * I think something was going wrong with my debounced function, I think I just need to move it to someplace where it wouldnt get overwritten?
 * seperate the table into its own component
 * seperate form to its own component and use redux to send info to the table
 * improve the form state management. I think it looks ugly
 */

function App() {
  const [nameValid, setnameValid] = useState(false);
  const [name, setName] = useState("")
  const [fetching, setFetching] = useState(false)
  const [locations, setLocations] = useState([])
  const [location, setLocation] = useState("")
  const [added, setAdded] = useState([])

  const fetchLocations = async () => {
    const response = await getLocations()
    if (response && response.length) {
      setLocations(response)
      setLocation(locations[0])
    } else {
      //error handling
    }
  }

  const fetchValid = async (name) => {
    // I included this lock because it felt like best practices but due to time constraints I have not fully utilized it
    setFetching(true)
    const response = await isNameValid(name)
    setnameValid(response)
    setFetching(false)
  }
  
  const debounced = _.debounce(fetchValid, 250)

  useEffect(() => {
    debounced(name)
  }, [name])

  useEffect(() => {
    fetchLocations()
    // normally I would build out a redux/saga system for this sort of async stuff but I was told to spend 20 minutes on this so...
  }, [])

  const handleClear = () => {
    setName("")
    setLocation(locations[0])
  }

  const handleAdd = () => {
    setAdded(added.concat({name, location}))
    handleClear()
  }

  return (
    <div className="App">
      <div className="nameContainer">
        Name
        <div className='inputContainer'>
          <input value={name} onChange={(e) => {setName(e.target.value)}}></input>
          {fetching ? (<>checking validity</>) : !nameValid ? (<span className="error">This name has already been taken</span>) : (<span className='hidden'>invisible</span>)}
        </div>
      </div>
      <div className="locationContainer">
        Location
        <select className='location' value={location} onChange={(e) => setLocation(e.target.value)}>
          {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
        </select>
      </div>
      <div className="buttonContainer">
        <button onClick={handleClear}>Clear</button>
        <button disabled={fetching || !nameValid || !location || !name} onClick={handleAdd}>Add</button>
      </div>
      <div className="tableContainer">
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Location</th>
            </tr>
          </thead>
          <tbody>
            {added.map((row) => (
              <tr>
                <td>{row.name}</td>
                <td>{row.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
