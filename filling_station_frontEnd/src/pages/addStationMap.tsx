
import { useEffect, useState } from "react";
import {
   MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "leaflet-geosearch/dist/geosearch.css";

import type { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SideBar } from "./sidebar";
import "./addStation.css"
import { loadStation } from "../services/stationService";
import { useNavigate } from 'react-router-dom';

export interface FuelOption{
  fuelType :string,
  currentStock:number,
  tankCapacity:number,
  fuelPrice : number
}

export interface StationFormDetail{
  stationName:string,
  stationContact:string,
   stationEmail:string;
        stationAddress:string;

}




function SearchField() {
  const map = useMap(); // Access the Leaflet map instance


useEffect(() => {
  const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: "lk",
        addressdetails: 1,
      },
  }
  );

  const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      autoClose: true,
      searchLabel: "Search Sri Lankan town or address...",
      keepResult: true,
  });

  map.addControl(searchControl);

  // Clean up control on component unmount
  return () => {
    map.removeControl(searchControl);
  };
}, [map]);


  return null;
}

export default function AddStationMap() {
  const navigate = useNavigate();
  const [fuel, setFuelDetail] = useState<FuelOption[]>([
    { fuelType: 'OcTane92', currentStock: 7600,  tankCapacity : 10000,fuelPrice : 414},
     { fuelType: 'OcTane95', currentStock:8000,  tankCapacity : 10000,fuelPrice : 453},
     { fuelType: 'Diesel', currentStock: 7500,  tankCapacity : 10000,fuelPrice : 379},
      { fuelType: 'SuperDiesel', currentStock: 8000,  tankCapacity : 10000,fuelPrice : 580},
       { fuelType: 'Kerosene', currentStock: 3400,  tankCapacity : 8000,fuelPrice : 290}
  ]);

  // 2. Selected items array
  const [stationDetails, setStationDetails] = useState<StationFormDetail>({
      stationName: "",
      stationContact: "",
      stationEmail: "",
      stationAddress: "",
  })
  const [selectedItems, setSelectedItems] = useState<FuelOption[]>([]);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");

 const [position, setPosition] = useState<LatLng | null>(
    null
  );
  

// set map marker fuel station location
function AddFillingStationLocation() {
 

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <strong>Selected Station Location</strong>
        <br />
        Latitude: {position.lat.toFixed(6)}
        <br />
        Longitude: {position.lng.toFixed(6)}
        <br />
        <button
          onClick={() => {
            alert(
              `Latitude: ${position.lat}\nLongitude: ${position.lng}`
            );
          }}
        >
          Confirm Location
        </button>
      </Popup>
    </Marker>
  );
}


    
  // 3. Handle changing the price in the text/number input
  const handleFieldChange = (fuelType: string,fieldDetail : string, fieldName:string) => {
    console.log("calling",fuelType)
    const fuelDetail = parseFloat(fieldDetail) || 0;

    if(fieldName === "Tank_capacity"){
      
    // Update master options list
    setSelectedItems((prevOptions) =>
      prevOptions.map((item) =>
        item.fuelType === fuelType ? { ...item, tankCapacity: fuelDetail } : item
      )
    );

    // Sync changes over to the selected items array if it is already checked
    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.fuelType === fuelType ? { ...item, tankCapacity: fuelDetail } : item
      )
    );
    }else if (fieldName === "current_stock"){
      
    // Update master options list
    setSelectedItems((prevOptions) =>
      prevOptions.map((item) =>
        item.fuelType === fuelType ? { ...item, currentStock: fuelDetail } : item
      )
    );

    // Sync changes over to the selected items array if it is already checked
    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.fuelType === fuelType ? { ...item, currentStock: fuelDetail } : item
      )
    );
    }else{
      
    // Update master options list
    setSelectedItems((prevOptions) =>
      prevOptions.map((item) =>
        item.fuelType === fuelType ? { ...item, fuelPrice: fuelDetail } : item
      )
    );

    // Sync changes over to the selected items array if it is already checked
    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.fuelType === fuelType ? { ...item, fuelPrice: fuelDetail } : item
      )
    );
    }
  };

  // 4. Handle checking/unchecking the box
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, option: FuelOption) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedItems((prev) => [...prev, option]);
      // console.log("selectedItemList",selectedItems)
    } else {
        // console.log("selectedItemList02 ",selectedItems)
      setSelectedItems((prev) => prev.filter((item) => item.fuelType !== option.fuelType));
    
    }
  };
  useEffect(() => {
  console.log("Updated selectedItems:", selectedItems);
}, [selectedItems]);

const addFillingStation=async()=>{
    await loadStation(stationDetails,position,selectedItems,openingTime,closingTime);
}


useEffect(() => {
  console.log("Opening Time:", openingTime);
  console.log("Closing Time:", closingTime);
}, [openingTime, closingTime]);
  return (
    <div className="pump-dashboard">
            <SideBar/>
            <main className="pump-main">
      <header className="pump-nameBar">
              <div className="pump-welcome-Tag">
                <h1>Add your filling station</h1>
                <p className="page-description">
                  Put your station on the map so drivers nearby can see your fuel stock.
                </p>
              </div>
      </header>
       <section className="station-details-card">
        <div className="station-card-heading">
          <span className="station-step-number">1</span>
          <h2>Station details</h2>
        </div>

        <form className="station-details-form">
          <div className="station-form-group">
            <label htmlFor="stationName">Station name</label>
            <input
              type="text"
              id="stationName"
              name="stationName"
              placeholder="Enter your station name"
                value={stationDetails?.stationName}
                onChange={(e) =>
                  setStationDetails({
                    ...stationDetails,
                    stationName: e.target.value,
                  })
                }
            />
          </div>

          <div className="station-form-row">
            <div className="station-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="011 234 5678"
                value={stationDetails?.stationContact}
                onChange={(e) =>
                  setStationDetails({
                    ...stationDetails,
                    stationContact: e.target.value,
                  })
                }
              />
            </div>

            <div className="station-form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="station@example.com"
                value={stationDetails?.stationEmail}
                onChange={(e) =>
                  setStationDetails({
                    ...stationDetails,
                    stationEmail: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="station-form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your station address"
              value={stationDetails?.stationAddress}
                onChange={(e) =>
                  setStationDetails({
                    ...stationDetails,
                    stationAddress: e.target.value,
                  })
                }
            />
          </div>
        </form>
      </section>

       <section className="station-details-card">

        <div className="station-card-heading">
          <span className="station-step-number">2</span>
          <h2>Pin Your location</h2>
        </div>

        <div className="station-map-design">
          {/* <div className="station-map-search">
            <span className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>

            <input
              type="text"
              placeholder="Search city, town or station address..."
              className="station-location-search"
            />

            <button type="button" className="station-search-btn">
              Search
            </button>
            </div> */}

  <div className="station-map-container">
    
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
         <SearchField/>
         
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddFillingStationLocation/>
   
    </MapContainer>
  </div>

  <div className="station-map-hint">
    <span className="station-location-icon">📍</span>
    <div>
      <strong>Choose your station position</strong>
      <p>Click anywhere on the map to select the exact location.</p>
    </div>
  </div>
</div>

       </section>
       <section className="station-details-card">
        <div className="station-card-heading">
          <span className="station-step-number">3</span>
          <h2>Fuels you sell</h2>
          
        </div>
           <p className="fuel-description">
              Tick the fuels you sell and enter your starting stock.
              You can change it any time.
            </p>
             <div className="fuel-column-headings">
                <span></span>
                <span>Tank capacity (L)</span>
                <span>Current stock (L)</span>
              </div>
                <div className="fuel-list">
                  {fuel.map((availableFuel) => {
    const isChecked = selectedItems.some(
      (item) => item.fuelType === availableFuel.fuelType
    );

    return (
      <div key={availableFuel.fuelType} className="fuel-row">
        <label className="fuel-name">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(event) =>
              handleCheckboxChange(event, availableFuel)
            }
          />
          <span>{availableFuel.fuelType}</span>
        </label>

       <input
            type="number"
            defaultValue={availableFuel.tankCapacity}
            onChange={(e) =>
              handleFieldChange(availableFuel.fuelType, e.target.value,"Tank_capacity")
            }
            placeholder="0.00"
          />

        <input
          type="number"
          defaultValue={availableFuel.currentStock}
            onChange={(e) =>
              handleFieldChange(availableFuel.fuelType, e.target.value,"current_stock")
            }
            placeholder="0.00"
        />
          <label className="fuel-name">Fuel unit price</label>
        <input
          type="number"
          defaultValue={availableFuel.fuelPrice}
            onChange={(e) =>
              handleFieldChange(availableFuel.fuelType, e.target.value,"fuel_price")
            }
            placeholder="0.00"
        />
      </div>
    );
  })}
          </div>

       </section>
       
<section className="station-details-card">
  <div className="station-card-heading">
    <span className="station-step-number">4</span>
    <h2>Opening hours</h2>
  </div>

  <div className="opening-hours-options">
    <button type="button" className="hours-option" >
      Open 24 hours
    </button>

    <button type="button" className="hours-option active">
      Set hours
    </button>
  </div>

  <div className="opening-hours-list">
    
      <div className="opening-hours-row">
        <span className="opening-day">From</span>

        <div className="opening-time-inputs">
           <input
              type="time"
              aria-label="Opening time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
            />

          <span className="time-separator">to</span>

          <input
           type="time"
           aria-label="Closing time"
           value={closingTime}
           onChange={(e) => setClosingTime(e.target.value)}
          />
        </div>
      </div>
    
  </div>
</section>

<section className="station-details-card">
           <div className="station-ready-message">
  <div className="station-ready-icon">✓</div>

  <div className="station-ready-text">
    <h3>Ready to go live?</h3>
    <p>
      You can edit every detail later from My station.
    </p>
  </div>
</div> 

<div className="station-form-actions">
  <button
    type="button"
    className="cancel-station-btn"
    onClick={() => navigate('/dashboard')}
  >
    Cancel
  </button>

  <button type="submit" className="add-station-btn" onClick={addFillingStation}>
    Add Station to the map
  </button>
</div>
</section>


            </main>
    </div>
  );
}




