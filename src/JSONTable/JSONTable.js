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
  Popover,
  Alert
} from 'react-bootstrap';
import JSONRow from './JSONRow'
var octicons = require("octicons")

class JSONTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      data: null,
      page: 0,
      next: false,
    }

    props.dataSource(
      props.limit + 1, 0,
      this.populateData.bind(this),
    );
  }

  populateData(data) {
    console.log("populateData", {
      loading: false,
      data: data.slice(0, this.props.limit),
      next: data.length > this.props.limit,
    })
    this.setState({
      loading: false,
      data: data.slice(0, this.props.limit),
      next: data.length > this.props.limit,
    })
  }

  buildHeader() {
    console.log("JSONTable.buildHeader")
    let headers = [];
    let keys = Object.keys(this.state.data[0]);
    for(let i in keys) {
      headers.push(<th key={i}>{keys[i]}</th>);
    }
    return(<thead><tr>{headers}</tr></thead>);
  }

  // buildButtons() {
  //   let buttons = [];
  //   for(let i in this.props.actions) {
  //     let cur = this.props.actions[i].render;
  //     cur.onClick = 
  //     buttons.push(<td key={i}>{this.props.actions[i].render}</td>);
  //   }
  // }

  buildBody() {
    console.log("JSONTable.buildBody");
    // let buttons = [];
    // for(let i in this.props.buttons) {
    //   buttons.push(<td key={i}>{this.props.buttons[i]}</td>);
    // }
    let rows = [];
    for(let i in this.state.data) {
      rows.push(<JSONRow 
        data={this.state.data[i]}
        refresh={this.refresh.bind(this)}
        // buttons={buttons}
        key={i}
        actions={this.props.actions}
      />);
    }
    return(<tbody>{rows}</tbody>);
  }

  // buildRow(json, buttons, key) {
  //   console.log("JSONTable.buildRow");
  //   let columns = [];
  //   for(let i in json) {
  //     columns.push(<td key={i}>{json[i]}</td>);
  //   }
  //   columns.push(...buttons)
  //   return(<tr key={key}>{columns}</tr>);
  // }

  nextPage() {
    console.log("nextPage")
    if(this.state.next) {
      this.state.page = this.state.page + 1
      this.props.dataSource(
        this.props.limit + 1, this.props.limit * this.state.page,
        this.populateData.bind(this),
      );
      this.setState({
        loading: true,
      })
    }
  }

  refresh() {
    console.log("refresh")
    this.props.dataSource(
      this.props.limit + 1, this.props.limit * this.state.page,
      this.populateData.bind(this),
    );
    this.setState({
      loading: true,
    })
  }

  previousPage() {
    console.log("previousPage")
    if(this.state.page > 0) {
      this.state.page = this.state.page - 1
      this.props.dataSource(
        this.props.limit + 1, this.props.limit * this.state.page,
        this.populateData.bind(this),
      );
      this.setState({
        loading: true,
      })
    }
  }

  render(){
    if(!this.state.data) {
      return <div>loading...</div>
    }
    console.log(this.state.next);
    return(
      <div>
        <Table
          striped={this.props.striped}
          bordered={this.props.bordered}
          condensed={this.props.condensed}
          hover={this.props.hover}
          responsive={this.props.responsive}
          bsClass={this.props.bsClass}
        >
          {this.state.data.length > 0?this.buildHeader.bind(this)():null}
          {this.state.data.length > 0?this.buildBody.bind(this)():null}
        </Table>
        <Pager>
          {this.state.page > 0?
            <Pager.Item previous 
              disabled={this.state.page <=0} 
              onClick={()=>this.previousPage()}
              >Previous
            </Pager.Item>:null}
          <Pager.Item
            disabled={this.state.loading}
            onClick={()=>this.state.loading?null:this.refresh()}
          >{this.state.loading?`loading`:`Refresh`}</Pager.Item>
          {this.state.next?<Pager.Item next 
            disabled={ !this.state.next } 
            onClick={()=>this.nextPage()}
            >Next
          </Pager.Item>:null}
        </Pager>
      </div>
    );
  }
}


export default JSONTable;