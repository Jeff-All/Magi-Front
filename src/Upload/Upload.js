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
} from 'react-bootstrap';
import JSONTable from '../JSONTable/JSONTable'
import processFile from './Processor'
import $ from "jquery"

class Upload extends React.Component {
  constructor(props) {
    super()

    this.state = {
      active: false,
      count: 0,
      current: 0,
      page: 0,
      limit: 10,
      errors: null,
    };

    this.itemsPerRequest = props.itemsPerRequest;
    if(!this.itemsPerRequest) { this.itemsPerRequest = 1; }
  }

  handlePageClick(event) {
    switch(event) {
      case "next":
        this.setState({
          page: this.state.page + 1
        })
        break;
      case "previous":
        this.setState({
          page: this.state.page - 1
        });
        break;
      default:
        break;
    }
  }

  renderErrorRows() {
    let start = this.state.page * this.state.limit;
    let rows = [];
    if(this.state.errors) {
      console.log("state.errors", this.state.errors);
      this.state.errors.slice(
        start,
        start + this.state.limit
      ).forEach((element, i) => {
        rows.push(
          <tr key={i}>
            <td>{i + start + 1}</td>
            <td>{element.sheet}</td>
            <td>{element.row}</td>
            <td>{element.error}</td>
          </tr>
        );
      });
    }
    return rows;
  }

  start() {
    console.log("start")
    this.setState({
      active: true,
      count: Math.trunc((Math.random() * 20 + 5)),
      current: 0,
      page: 0,
      limit: 5,
      errors: [],
    });
    let that = this;
    setTimeout(()=>{
      console.log("test");
      that.progress()}, Math.random() * 10000);
  }

  progress() {
    console.log("progress")
    let errors = this.state.errors;
    if((Math.random() * 10) > 8) {
      errors.push({
        sheet: "Sheet",
        row: "Row",
        error: "Error",
      });
    }
    if(this.state.current + 1 !== this.state.count) {
      let that = this;
      setTimeout(()=>{
        that.progress()
      }, Math.random() * 3000);
    }
    this.setState({
      current: this.state.current + 1,
    });
  }

  upload() {
    console.log("upload", this.file)
    this.setState({
      file: this.file,
      active: true,
    })
    console.log("upload.2", this.file)
    processFile((data) => this.processorCallback(data), this.file);
  }

  processorCallback(data) {
    console.log("processorCallback", data);
    this.setState({
      count: this.state.count + data.length,
    });
    this.uploadData(data);
  }

  async uploadData(data, count = 0) {
    console.log("uploadData:data", data);
    if(data.length > 0) {
      let items = data.slice(0, this.itemsPerRequest);
      $.ajax({
        url: 'https://localhost:8081/requests',
        type: 'PUT',
        data: JSON.stringify(data.slice(0, this.itemsPerRequest)),
        dataType: "json",
        beforeSend: function(xhr){
          xhr.setRequestHeader(
            'Authorization', "Bearer " + 
            localStorage.getItem('id_token')
          );
        },
        success: json => {
          console.log("uploadData:success", json)
          let errors = [];
          json.forEach(element => {
            if(element.Error) {
              errors.push({
                sheet: element.Sheet,
                row: element.Row,
                error: element.Error
              })
            }
          });
          this.setState({
            current: this.state.current + json.length,
            errors: this.state.errors
                ? this.state.errors.concat(errors)
                : errors.length > 0 ? errors : null,
          })
          this.uploadData(data.slice(
            this.itemsPerRequest,
            data.length + this.itemsPerRequest,
          ))
        },
        error: (jqXHR, status, error) => {
          console.log("uploadData:error:jqXHR", jqXHR);
          console.log("uploadData:error:jqXHR.responseText", jqXHR.responseText);
          console.log("uploadData:error:status", status)
          console.log("uploadData:error:error", error)
          this.setState({
            current: this.state.current + this.itemsPerRequest,
          })
          let errors = [];
          console.log("uploadData:error:items", items);
          console.log("uploadData:error:this", this);
          if(count === 0) {
            items.forEach(element => {
              errors.push({
                sheet: element.sheet,
                row: element.row,
                error: "Error Uploading Data",
              })
            });
            console.log("uploadData:error:this.state.errors", this.state.errors);
            console.log("uploadData:error:errors", errors);
            this.setState({
              errors: this.state.errors
                ? this.state.errors.concat(errors)
                : errors,
            });
          } 
          if(count < this.retries) {
            this.uploadData(
              data.slice(
                0,
                data.length + this.itemsPerRequest,
              ),
              count + 1,
            );
          } else {
            this.setState({
              current: this.state.current + this.itemsPerRequest > this.state.count
                ? this.state.count
                : this.state.current + this.itemsPerRequest,
            });
            this.uploadData(data.slice(
              this.itemsPerRequest,
              data.length + this.itemsPerRequest,
            ));
          }
        },
      });
    }
  }

  render() {
    return(
      <div>
        <Panel>
          <input type="file" accept=".csv, .xls, .xlsx"
            onChange={ event => {
              console.log("change");
              this.file = event.target.files[0];
            }}
          />
          <Button bsStyle="primary"
            onClick={ event => {
              console.log("upload:click");
              this.upload();
            }}
          >Upload</Button>
          {this.state.active
            ? <span>
                <div>{this.state.current}/{this.state.count} {
                  this.state.errors ? <Overlay id="error:tooltip">{this.state.errors.length}</Overlay>:null}
                </div>
                <ProgressBar striped
                  now={(this.state.current / this.state.count) * 100} 
                  // label={`${this.state.current}/${this.state.count}`} 
                />
              </span>
            : null
          }
          {this.state.active && this.state.errors
            ? <Panel>
              <Table striped condensed responsive bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sheet</th>
                    <th>Row</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  { this.renderErrorRows() }
                </tbody>
              </Table>
              <Pager onSelect={ this.handlePageClick.bind(this) }>
                  {this.state.page > 0
                    ? <Pager.Item previous eventKey="previous" >Previous</Pager.Item>
                    : null
                  }
                  {this.state.page < Math.floor((this.state.errors.length-1) / this.state.limit)
                    ? <Pager.Item next eventKey="next">Next</Pager.Item>
                    : null
                  }
              </Pager>
            </Panel>
            : null
          }
        </Panel>
      </div>
    );
  }
}

export default Upload;