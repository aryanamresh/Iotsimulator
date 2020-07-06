import React from 'react';

import DataTable from "react-data-table-component";  

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import axios from 'axios';


const url = "http://127.0.0.1:5000" ;

class App extends React.Component{

  state={
    WindowHeight: window.innerHeight-27,
    WindowWidth: window.innerWidth,

    chatList:[
                <div 
                  style={{marginTop:5, padding:2, display:'flex'}}
                >
                  <div style={{backgroundColor:'white', height:60, width:60, borderRadius:'100%', marginRight:10}}>
                    <img src="bot.jpg" style={{height:'100%', width:'100%', borderRadius:'100%'}}/>
                  </div>
                  <div style={{backgroundColor:'white', borderRadius:5, padding:10, maxWidth:'70%'}}>
                  <text>Hi, Welcome to Deep Sim. Here you can simulate IoT data for different number of users and IoT devices. You may either enter your query in text box or directly select the options from the left.</text>
                  </div>
                </div>
              ],
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


  createLoadingComp = ()=>{

    let gif = (
      <div 
        style={{width:200, borderRadius:5, padding:5}}
      >
        <text>Processing the data</text>
        <div style={{height:200, width:'100%'}}>
          <img src="loading.gif" alt="Loading..." style={{height:'100%', width:'100%'}}/>
        </div>
      </div>
    );

    let loadingComp = this.createTextResponse(gif);

    return loadingComp;
    
  }


  createUserMessage = (comp)=>{
    return(
      <div 
        style={{marginTop:5, padding:2, display:'flex', justifyContent:'flex-end'}}
      >
        <div style={{backgroundColor:'#b9f6ca', borderRadius:5, padding:10, maxWidth:'70%'}}>
          {comp}
        </div>
        <div style={{backgroundColor:'white', height:60, width:60, borderRadius:'100%', marginLeft:10}}>
          <img src="userAvatar.png" style={{height:'100%', width:'100%', borderRadius:'100%'}}/>
        </div>
      </div>
    );
  }

  createDownloadLink = (csvData)=>{

    return(
      <div>
        <a 
          href={URL.createObjectURL(new Blob([csvData], { type: "text/csv" }))} 
          download="output.csv"
        >
          Download
        </a>
      </div>
    )
  }

  createTextResponse = (txt)=>{

    return(
      <div 
        ref={r => {if(r) r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
        style={{marginTop:5, padding:2, display:'flex'}}
      >
        <div style={{backgroundColor:'white', height:60, width:60, borderRadius:'100%', marginRight:10}}>
          <img src="bot.jpg" style={{height:'100%', width:'100%', borderRadius:'100%'}}/>
        </div>
        <div style={{backgroundColor:'white', borderRadius:5, padding:10, maxWidth:'70%'}}>
          {txt}
        </div>
      </div>
    )
  }

  createSummaryReport = (csvData)=>{
    const {WindowHeight, WindowWidth} = this.state;
    return(
      <div
        ref={r => {if(r) r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
      >
        <div>
          {
            this.createTextResponse("Data is ready...")
          }
        </div>
        <div style={{backgroundColor:'white', width:'100%', height:0.91*WindowHeight, borderRadius:5}}>
          <div style={{display:'flex', height:'50%'}}>
            <div style={{backgroundColor:'#b9f6ca', margin:10, padding:10, borderRadius:5, flex:1}}>
              <text style={{fontWeight:'bold'}}>Summary Report</text><br/><br/>
              <text>1. Total number of logs per user : 1000</text><br/><br/>
              <text>2. Schema of the output data : (date, time, sensorID, value)</text><br/><br/>
              <text>3. Output data :- </text>
              {
                this.createDownloadLink(csvData)
              }
            </div>
            <div style={{backgroundColor:'#b9f6ca', margin:10, padding:10, borderRadius:5, flex:1}}>
              <text style={{fontWeight:'bold'}}>Model details</text><br/><br/>
              <text>1. Algorithm used : TimeGAN</text><br/><br/>
              <text>2. Training data used : CASAS Aruba dataset</text><br/><br/>
              <text>3. Number of training epochs : 10,000</text><br/><br/>
              <text>4. Sequence length used : 24</text><br/><br/>
              <text>5. Number of hidden layers : 3</text>
            </div>
          </div>
          <div style={{display:'flex', height:'50%'}}>
            <div style={{backgroundColor:'#b9f6ca', margin:10, padding:10, borderRadius:5, flex:1}}>
              <img src="graph1.jpg" style={{height:'100%', width:'100%'}}/>
            </div>
            <div style={{backgroundColor:'#b9f6ca', margin:10, padding:10, borderRadius:5, flex:1}}>
              <img src="graph2.jpg" style={{height:'100%', width:'100%'}}/>
            </div>
          </div>
        </div>
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
        ref={r => {if(r) r.scrollIntoView({behavior:'smooth', block:'nearest'});}}
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
    return true;
  }

  onChangeText = (event)=>{
    this.setState({message:event.target.value})
  }


  send = ()=>{

    if(this.state.message==""){
      alert("Please enter your query or select options from the menu");
      return;
    }


    let arr = this.state.chatList;

    var comp = this.createUserMessage(<text>{this.state.message}</text>);

    arr.push(comp);

    let loadingComp = this.createLoadingComp();
    arr.push(loadingComp);

    this.setState({chatList:arr, message:""});


    if(!this.simulate(this.state.message)){

      //let txt = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with d";
      let txt = "I am sorry, I didn't get you. Please try again or use the options on the left.";
      let comp = this.createTextResponse(txt);

      let arr = this.state.chatList;
      arr.pop();
      arr.push(comp);
      this.setState({chatList:arr});

      return;

    }


    
    let s = this.state.message;

    let postData = {"query":s};

    let endPoint = "/simulate";
    axios.post(url+endPoint, postData)
    .then(

      (response)=>{
        //console.log(response.data);
        let comp2 = this.createSummaryReport(response.data);
        arr.pop();
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
      <text style={{fontWeight:'bold'}}>Motion Sensors</text>
      <br/>
      <button onClick={()=>this.decreaseDeviceCount("motionSensors", {"motionSensors":0}, minMotionSensors)}>-</button>
      <input value={this.state.motionSensors}/>
      <button onClick={()=>this.increaseDeviceCount("motionSensors", {"motionSensors":0}, maxMotionSensors)}>+</button>
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

    const {userFreq, doorSensors, motionSensors, tempSensors} = this.state;
  
    let s0 = "Simulate data for "
    let s1 = (userFreq>1)? (userFreq+" users, "):(userFreq+" user, ");
    let s2 = (doorSensors>1)? (doorSensors+" door sensors, "):(doorSensors+" door sensor, ");
    let s3 = (motionSensors>1)? (motionSensors+" motion sensors, "):(motionSensors+" motion sensor, ");
    let s4 = (tempSensors>1)? (tempSensors+" temperature sensors"):(tempSensors+" temperature sensor");
    let msg = (
      <div>
        <text>{s0+s1+s2+s3+s4}</text>
      </div>
    )

    let arr = this.state.chatList;

    let userMsg = this.createUserMessage(msg);
    arr.push(userMsg);
    
    let loadingComp = this.createLoadingComp();
    arr.push(loadingComp);
    this.setState({chatList:arr});

    let postData = {"query":0, 
                    "userFreq":this.state.userFreq,
                    "doorSensors":this.state.doorSensors,
                    "motionSensors":this.state.motionSensors,
                    "tempSensors":this.state.tempSensors
                  };

    let endPoint = "/simulate";
    axios.post(url+endPoint, postData)
    .then(

      (response)=>{
        //console.log(response.data);
        let comp2 = this.createSummaryReport(response.data);
        arr.pop();
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
    <div style={{display:'flex', flexDirection:'column', padding:20}}>
      <div>
        <h4>Select the number of users</h4>
        <button onClick={()=>this.decreaseUserFreq(minUserFreq)}>-</button>
        <input value={this.state.userFreq}/>
        <button onClick={()=>this.increaseUserFreq(maxUserFreq)}>+</button>
      </div>
      <div>
        <h4>Select the IoT devices</h4>
        <div>
        {
          this.renderDevices2()
        }
        </div>
      </div>
      <button 
        onClick={()=>{this.submitForm()}}
        style={{marginTop:40, padding:5, borderRadius:5, backgroundColor:"#2196f3", color:'white', borderWidth:0}}
      >
      <text style={{fontSize:20, fontWeight:'bold'}}>Submit</text>
      </button>
    </div>
    )
  }



  render(){

    const {WindowHeight, WindowWidth} = this.state;

    return(
      <div>
        <div style={{height:WindowHeight , width:WindowWidth}}>
          
          <div style={{display:'flex', padding:20, alignItems:'center', backgroundColor:"#80d8ff"}}>
            <div style={{backgroundColor:'white',height:45, width:45, borderRadius:'100%'}}>
              <img src="logo192.png" style={{height:'100%', width:'100%'}}/>
            </div>
            <text style={{paddingLeft:10, fontSize:30, fontWeight:'bolder'}}>Deep Sim</text>
          </div>

          <div style={{display:'flex', height:'90%'}}>

            <div style={{backgroundColor:"white", height:'100%', flex:1}}>
              {
                this.renderForm()
              }
            </div>

            <div style={{height:'100%', flex:4, backgroundColor:'pink'}}>
              <div style={{height:'80%', padding:20, overflowY:'scroll'}}>
              {
                this.renderChatList()
              }
              </div>
              <div>
                <input 
                  style={{margin:10, padding:5, width:'80%', borderRadius:5, borderWidth:0}}
                  placeHolder="Enter your query......Or use the options on left"
                  value={this.state.message}
                  onChange={this.onChangeText}
                  onKeyDown={(e)=>{if(e.key=="Enter")this.send()}}
                />
                <button
                  style={{borderRadius:5, backgroundColor:"#2196f3", color:'white', borderWidth:0, padding:5}}
                  onClick={this.send}
                >
                  Send
                </button>
              </div>
            </div>

          </div>
          
        </div>
        
      </div>
    );

  }

}


export default App;
