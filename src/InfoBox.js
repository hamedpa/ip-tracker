import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import Flag from 'react-flagkit';

function InfoBox({ title, ipInfo, cases, total, active, isRed, ...props }) {
  console.log(title, active);
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${isRed && "infoBox--red"
        }`}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <div>
          {ipInfo ? ipInfo.Country && <Flag country={ipInfo ? ipInfo.CountryCode : "Loading Data ..."} /> : "Loading Data ..."}
        
        </div>

        {ipInfo ? Object.keys(ipInfo).map((item) => {
          if(ipInfo[item] && ipInfo[item] !== "undefined") {
            return <Typography className="infoBox__total" color="textSecondary">{item}: {ipInfo[item]}</Typography>
          }
          return [];
        }) : ''}

    
      </CardContent>
    </Card >
  );
}

export default InfoBox;
