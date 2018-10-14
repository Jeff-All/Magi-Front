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
    this.generateImage = this.generateImage.bind(this)
    this.generateQR = this.generateQR.bind(this)
  }

  componentDidMount() {
    this.context = this.refs.canvas.getContext('2d');
  }

  generateQR(data, x,y, width,height) {
    var code;
    QRCode.toDataURL(`${data}`, (err, url) => code = url)
    console.log("Renderer.generateImage", code)
    var img = new Image(width, height);
    var ctx = this.context
    img.onload = function(){
      ctx.drawImage(img,x,y); // Or at whatever offset you like
    };
    img.src = code;
  }

  generateImage() {
    // var code;
    // QRCode.toDataURL("Test", (err, url) => code = url)
    // console.log("Renderer.generateImage", code)
    // var img = new Image(100, 100);
    // var ctx = this.context
    // img.onload = function(){
    //   ctx.drawImage(img,0,0); // Or at whatever offset you like
    // };
    // img.src = code;
    // this.context.drawImage(img, 100, 100)
    for(let i=0; i<this.props.width; i+=100) {
      this.generateQR(i, i,0, 50,50)
      // this.context.fillRect(i,0, 50,50);
    }
    
  }

  render() {
    return(
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Renderer;