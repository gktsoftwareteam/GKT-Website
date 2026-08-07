import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/settings.css";

function Settings() {

const [company,setCompany]=useState("GKT Software Solution");
const [email,setEmail]=useState("gktsoftwaresolution@gmail.com");
const [phone,setPhone]=useState("8778341227");
const [address,setAddress]=useState("Chennai");

const saveSettings=()=>{

alert("Settings Saved Successfully");

}

return(

<div className="dashboard">

<Sidebar/>

<div className="dashboard-main">

<Topbar/>

<div className="dashboard-content">

<div className="settings-page">

<h2>⚙️ Settings</h2>

<div className="settings-form">

<label>Company Name</label>

<input
value={company}
onChange={(e)=>setCompany(e.target.value)}
/>

<label>Email</label>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label>Phone</label>

<input
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<label>Address</label>

<textarea
rows="4"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

<button
className="save-btn"
onClick={saveSettings}
>

Save Settings

</button>

</div>

</div>

</div>

</div>

</div>

)

}

export default Settings;