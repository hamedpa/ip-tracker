import React, { useState, useEffect } from "react";
import "./App.css";
import {
  TextField
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [ip, setIp] = useState('51.15.80.14');

  const [ipInfo, setIpInfo] = useState({});
  const [lat, setLat] = useState(34.80746);
  const [lon, setLon] = useState(-40.4796);
  const [locationData, setLocationData] = useState([]);
  const [casesType] = useState("cases");
  const [mapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom] = useState(3);

  useEffect(() => {
    const getCountriesData = async () => {
      if(!Object.keys(ipInfo).length > 0){
        fetch(`https://geolocation-db.com/json/`)
          .then((response) => response.json())
          .then((data) => {
            setIp(data.IPv4);
            
          }).catch((err) => {
              console.log(err);
              setIpInfo({message: "there is no data for this IP"});
              setLocationData({message: "there is no data for this IP"});
  
          });
      }
      fetch(`http://ip-api.com/json/${ip}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = {
            Country: `${data.country} (${data.countryCode})`,
            City: data?.city,
            Continent: `${data.country})`,
            Zip: data?.zip,
            RegionName: data?.regionName,
            ISP: data?.isp,
            Coordinates: `${data.lat} (lat) / ${data.lon} (long)`,
            Time: `${data.timezone}`,
            CountryCode: data.countryCode,
            ipAddress: ip,
            hostname: ip,
            provider: data.org,
            ASN: data.as,
            lat: String(data.lat),
            lon: String(data.lon)
          };

          setIpInfo(formattedData);
          if(formattedData.lat !== "undefined" && formattedData.lon !== "undefined") {
            setLat(formattedData.lat);
            setLon(formattedData.lon);
          }

          const urlLocation =  "https://nominatim.openstreetmap.org/search?q="+formattedData.lat+"+"+formattedData.lon+"&format=json&polygon=1&addressdetails=1";
      
          fetch(urlLocation)
            .then((response) => response.json())
            .then((data) => {
              console.log(data[0].address);
              const locationData = Object.assign(data[0].address,data[0]);
              delete locationData.address;
              delete locationData.boundingbox;
              delete locationData.licence
              delete locationData.country_code
              delete locationData.country
              delete locationData.osm_type              
              delete locationData.icon              
              delete locationData.lat              
              delete locationData.lon              
              setLocationData(data);
            }).catch((err)=>{
              console.log('try to fetch data ...');
            });
        }).catch((err) => {
            console.log(err);
            setIpInfo({message: "there is no data for this IP"});
            setLocationData({message: "there is no data for this IP"});

        });
    };
    getCountriesData();
  }, [ip, ipInfo]);


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Modern IP address Tracker</h1>
          <TextField id="outlined-basic-required"  value={ip} onChange={e => setIp(e.target.value)} label="IP address" variant="outlined" />

        </div>
        <div className="app__stats">
          <InfoBox
            title="ip address data"
            ipInfo={ipInfo}
          />
          <InfoBox
            title="location"
            ipInfo={locationData.length > 0 ? locationData[0].address : ''}
          />
        </div>
        <Map
          ipInfo={ipInfo}
          lat={lat}
          lon={lon}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
    </div>
  );
};

export default App;
