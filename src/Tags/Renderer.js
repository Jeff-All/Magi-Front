import React from 'react';
import {
  Panel,
  Button,
  ProgressBar,
  Table,
  Pager,
  Overlay,
  Tab,
  Tabs,
  Glyphicon,
  Well,
} from 'react-bootstrap';
import JSONTable from '../JSONTable/JSONTable'
import $ from "jquery"
import QRCode from 'qrcode'
import fs from 'fs'

class Renderer extends React.Component {
  constructor() {
    super()
    this.count = 0;
    this.generateImage = this.generateImage.bind(this)
    this.generateQR = this.generateQR.bind(this)
  }

  componentDidMount() {
    this.context = this.refs.canvas.getContext('2d');
  }

  generateQR(data, x,y, width,height) {
    var code;
    QRCode.toDataURL(`${data}`, {width: width, height: height}, (err, url) => code = url)
    console.log("Renderer.generateImage", code)
    var img = new Image(width, height);
    var ctx = this.context
    img.onload = function(){
      ctx.drawImage(img,x,y); // Or at whatever offset you like
    };
    img.src = code;
  }

  generateNextTag(data) {
    this.generateQR(
      data, 
      (this.count % 2) * this.props.tagWidth,Math.floor(this.count / 2) * this.props.tagHeight, 
      // 400,400
      this.props.tagWidth,this.props.tagHeight 
    );
    this.count++;
  } 

  generateImage(requests) {
    // for(let i=0; i<this.props.width; i+=100) {
    //   this.generateQR(i, i,0, 50,50)
      // this.context.fillRect(i,0, 50,50);
    // }
    
    for(let i=0; i<requests.length; i++){
      this.generateNextTag(requests[i].ID);
      // this.generateQR(requests[i].id, )
    }
  }

  render() {
    return(
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Renderer;