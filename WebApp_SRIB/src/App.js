import React from 'react';

import DataTable from "react-data-table-component";  

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import axios from 'axios';


const url = "http://127.0.0.1:5000" ;
const WindowHeight = window.innerHeight-100;
const WindowWidth = window.innerWidth-100;

class App extends React.Component{

  state={
    chatList:[<div>Hi! How can i help you?</div>],
    message:"",

    userFreq:1,
    deviceList:["TV", "AC", "Tubelight", "Lock", "Fan"],
    deviceSet:new Set(),

    doorSensors:0,
    motionSensors:0,
    tempSensors:0,
  }

  increaseUserFreq = (upperLimit)=>{
    let x = this.state.userFreq;
    if(x<upperLimit){
      this.setState({userFreq:x+1});
    }
  }

  decreaseUserFreq = (lowerLimit)=>{
    let x = this.state.userFreq;
    if(x>lowerLimit){
      this.setState({userFreq:x-1});
    }
  }

  increaseDeviceCount = (name, jsonObj, upperLimit)=>{
    let x = this.state[name];
    if(x<upperLimit){
      jsonObj[name] = x+1;
      this.setState(jsonObj);
    }
  }

  decreaseDeviceCount = (name, jsonObj, lowerLimit)=>{
    let x = this.state[name];
    if(x>lowerLimit){
      jsonObj[name] = x-1;
      this.setState(jsonObj);
    }
  }


  createUserMessage = ()=>{
    return(
      <div 
        ref={r => {r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
        style={{padding:2}}
      >
        {this.state.message}
        
      </div>
    );
  }

  createDownloadLink = (csvData)=>{

    return(
      <div
        ref={r => {r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
      >
        <a 
          href={URL.createObjectURL(new Blob([csvData], { type: "text/csv" }))} 
          download="output.csv"
        >
          Download
        </a>
      </div>
    )
  }

  createResponseTableWithGraph = (data)=>{

    let arr = data["logs"];
  
    const columns = [
      {
        name: 'Time',
        selector: 'time',
        sortable: false
      },
      {
        name: 'Value',
        selector: 'value',
        sortable: false
      }
    ];

    /*
      <DataTable
          title="IoT Data"
          columns={columns}
          data={arr}
          fixedHeader={true}
          pagination={true}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5,10,20,30]}
        />
    */

    return(
      <div 
        ref={r => {r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
        style={{padding:2}}
      >
      
        
        <div
          style={{backgroundColor:'white', width:'100%', overflowX:'scroll'}}
        >
        <LineChart width={100000} height={400} data={arr} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
        </div>
        
      </div>
    );
  }

  renderChatList = ()=>{
    return (
      this.state.chatList.map(
        (item, idx)=>{
          return(
            item
          )
        }
      )
    );
  }

  simulate = (s)=>{
    s = s.toLowerCase();
    if(s=="s" || s=="g"){
      return true;
    }
    return false;
  }

  onChangeText = (event)=>{
    this.setState({message:event.target.value})
  }


  send = ()=>{

    if(this.state.message==""){
      alert("Please enter your message");
      return;
    }


    let arr = this.state.chatList;

    var comp = this.createUserMessage();

    arr.push(comp);

    this.setState({chatList:arr, message:""});



    if(this.simulate(this.state.message)){
      let s = this.state.message;

      let postData = {"query":s};

      let endPoint = "/simulate";
      axios.post(url+endPoint, postData)
      .then(

        (response)=>{
          //console.log(response.data);
          let comp2 = this.createDownloadLink(response.data);
          arr.push(comp2);
          this.setState({chatList:arr, message:""});
        }

      )
      .catch(
        (error)=>{
          console.log(error);
          alert("some error occured : "+error);
        }
      );




      let endPoint2 = "/graphdata";
      axios.post(url+endPoint2, postData)
      .then(

        (response)=>{
          //console.log(response.data);
          let comp2 = this.createResponseTableWithGraph(response.data);
          arr.push(comp2);
          this.setState({chatList:arr, message:""});
        }

      )
      .catch(
        (error)=>{
          console.log(error);
          alert("some error occured : "+error);
        }
      );
      
    }
    
    
  }


  handleDeviceCheck = (deviceName)=>{
    let myset = new Set(this.state.deviceSet);
    if(myset.has(deviceName)){
      myset.delete(deviceName);
    }
    else{
      myset.add(deviceName);
    }
    this.setState({deviceSet:myset});
  }


  renderDevices = ()=>{
    let arr = this.state.deviceList;
    return (
      arr.map(
        (item, idx)=>{
          return(
            <div style={{padding:2}}>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.deviceSet.has(item)}
                  onChange={(e)=>{this.handleDeviceCheck(item)}}
                />
                <text style={{fontWeight:'bold'}}>{item}</text>
              </label>
              <br/>
            </div>
          )
        }
      )
    );
  }

  renderDevices2 = ()=>{

    let minDoorSensors = 0, maxDoorSensors = 100;
    let minMotionSensors = 0, maxMotionSensors = 100;
    let minTempSensors = 0, maxTempSensors = 100;

    return(
    <div>
      <text style={{fontWeight:'bold'}}>Door Sensors</text>
      <br/>
      <button onClick={()=>this.decreaseDeviceCount("doorSensors", {"doorSensors":0}, minDoorSensors)}>-</button>
      <input value={this.state.doorSensors}/>
      <button onClick={()=>this.increaseDeviceCount("doorSensors", {"doorSensors":0}, maxDoorSensors)}>+</button>
      <br/>
      <br/>
      <br/>
      <text style={{fontWeight:'bold'}}>Motion Sensors</text>
      <br/>
      <button onClick={()=>this.decreaseDeviceCount("motionSensors", {"motionSensors":0}, minMotionSensors)}>-</button>
      <input value={this.state.motionSensors}/>
      <button onClick={()=>this.increaseDeviceCount("motionSensors", {"motionSensors":0}, maxMotionSensors)}>+</button>
      <br/>
      <br/>
      <br/>
      <text style={{fontWeight:'bold'}}>Temperature Sensors</text>
      <br/>
      <button onClick={()=>this.decreaseDeviceCount("tempSensors", {"tempSensors":0}, minTempSensors)}>-</button>
      <input value={this.state.tempSensors}/>
      <button onClick={()=>this.increaseDeviceCount("tempSensors", {"tempSensors":0}, maxTempSensors)}>+</button>
    </div>
    );
  }

  submitForm = ()=>{
    if(this.state.doorSensors+this.state.motionSensors+this.state.tempSensors==0){
      alert("Please select at least 1 IoT device");
      return;
    }
  
    alert(" UserFreq : "+this.state.userFreq+"\n doorSensors : "+this.state.doorSensors+"\n motionSensors : "+this.state.motionSensors+"\n tempSensors : "+this.state.tempSensors+"\n Click Ok to simulate IoT data");


    let postData = {"query":0, 
                    "userFreq":this.state.userFreq,
                    "doorSensors":this.state.doorSensors,
                    "motionSensors":this.state.motionSensors,
                    "tempSensors":this.state.tempSensors
                  };

    let endPoint = "/simulate";
    let arr = this.state.chatList;
    axios.post(url+endPoint, postData)
    .then(

      (response)=>{
        //console.log(response.data);
        let comp2 = this.createDownloadLink(response.data);
        arr.push(comp2);
        this.setState({chatList:arr, message:""});
      }

    )
    .catch(
      (error)=>{
        console.log(error);
        alert("some error occured : "+error);
      }
    );

  }

  renderForm = ()=>{

    let minUserFreq = 1, maxUserFreq = 100

    return(
    <div>
      <div style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
        <h1>OR</h1>
      </div>
      <div>
        <h3>Select the number of users</h3>
        <button onClick={()=>this.decreaseUserFreq(minUserFreq)}>-</button>
        <input value={this.state.userFreq}/>
        <button onClick={()=>this.increaseUserFreq(maxUserFreq)}>+</button>
      </div>
      <div>
        <h3>Select the IoT devices</h3>
        <div>
        {
          this.renderDevices2()
        }
        </div>
      </div>
      <button 
        onClick={()=>{this.submitForm()}}
        style={{marginTop:20, padding:5, borderRadius:5, backgroundColor:"#2196f3", color:'white'}}
      >
      <text style={{fontSize:20, fontWeight:'bold'}}>Submit</text>
      </button>
    </div>
    )
  }



  render(){

    return(
      <div style={{backgroundColor:'yellow', padding:60}}>
        <div style={{height:WindowHeight , width:WindowWidth}}>
          
          <div style={{backgroundColor:'pink', height:'80%', overflowY:'scroll'}}>
          {
            this.renderChatList()
          }
          </div>
          
          <div style={{position:'absolute',bottom:40, width:WindowWidth, backgroundColor:'red'}}>
            <input 
              style={{margin:10, padding:5, width:'80%', borderRadius:5, borderWidth:0}}
              placeHolder="Enter your query......Or see the form below"
              value={this.state.message}
              onChange={this.onChangeText}
              onKeyDown={(e)=>{if(e.key=="Enter")this.send()}}
            />
            <button
              style={{borderRadius:5, backgroundColor:'blue', color:'white', borderWidth:0}}
              onClick={this.send}
            >
              Send
            </button>
          </div>
        </div>
        <div style={{}}>
          {
            this.renderForm()
          }
        </div>
      </div>
    );

  }

}


export default App;
