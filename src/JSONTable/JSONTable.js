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
  Alert,
  Pagination
} from 'react-bootstrap';
import JSONRow from './JSONRow'

class JSONTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hash: Math.floor(Math.random() * 999999),
      loading: true,
      changes: null,
      data: null,
      ogData: null,
      page: 0,
      next: false,
      sources: [],
    }

    if(this.props.load) {
      console.log("load", this.state.hash)
      this.refreshSources();
      this.props.dataSource(
        this.props.limit + 1, this.props.limit * this.state.page,
        this.populateData.bind(this),
      );
    }
  }

  copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? this.copy(v) : v;
    }
    return output;
  }

  populateSource(data, column, fieldName) {
    console.log("JSONTable.populateSource: input", data, column, fieldName);
    let dataArray = [];
    for(let i in data) {
      dataArray.push(data[i][fieldName]);
    }
    this.state.sources[column] = dataArray;
    console.log("JSONTable.populateSource: output", dataArray, this.state.sources);
    this.setState({
      sources: this.state.sources,
    });
  }

  populateData(data) {
    console.log("JSONTable.populateData", {
      loading: false,
      data: data.slice(0, this.props.limit),
      next: data.length > this.props.limit,
    })
    this.setState({
      loading: false,
      data: data.slice(0, this.props.limit),
      ogData: this.copy(data.slice(0, this.props.limit)),
      changes: [],
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

  buttonClick(action, row, callback) {
    console.log("JSONTable.buttonClick", 
      // action, 
      row, 
      // callback,
      this.state.data,
      this.state.ogData,
      this.state.changes,
    );
    action({ 
      data: this.state.data ? this.state.data[row] : null,
      ogData: this.state.ogData ? this.state.ogData[row] : null,
      changes: this.state.changes ? this.state.changes[row] : null,
    }, callback);
  }

  setCell(column, newData) {
    console.log("JSONTable.setCell:",
      this.table.state.ogData,
      this.table.state.ogData[this.row],
      this.row,
      column,
      this.table.state.ogData[this.row][column],
      newData,
      this.table.state.ogData[this.row][column] == newData,
      this.table.state.ogData[this.row][column] === newData
    )
    if(this.table.state.ogData[this.row][column] == newData) {
      console.log("JSONTable.setCell: same data")
      if(  this.table.state.changes[this.row]
        && this.table.state.changes[this.row][column]
      ) {
        console.log("JSONTable.setCell: delete change")
        delete this.table.state.changes[this.row][column]
      }
    } else {
      console.log("JSONTable.setCell: dif data")
      if(!this.table.state.changes[this.row]) { 
        console.log("JSONTable.setCell: add change row")
        this.table.state.changes[this.row] = {}
      }
      this.table.state.changes[this.row][column] = newData
    }
    this.table.state.data[this.row][column] = newData;
    console.log("JSONTable.setCell:",
      this.table.state.data[this.row][column],
      this.table.state.changes[this.row][column],
    );
    this.table.setState({
      changes: this.table.state.changes,
      data: this.table.state.data,
    });
  }

  buildBody() {
    console.log("JSONTable.buildBody:", 
      this.state.data, 
      this.state.sources,
      this.state.changes,
    );
    let rows = [];
    for(let i in this.state.data) {
      console.log("JSONTable.buildBody:" + i,
        this.state.data[i],
        this.state.ogData[i],
        this.state.data[i]!==this.state.ogData[i],
        this.state.changes[i],
        this.state.changes && this.state.changes[i],
      );
      rows.push(<JSONRow
        setCell={this.setCell.bind({table: this, row: i})}
        data={this.state.data[i]}
        refresh={this.refresh.bind(this)}
        key={i}
        id={i}
        actions={this.props.actions}
        sources={this.state.sources}
        update={this.props.update}
        // changed={false}
        changed={this.state.changes && this.state.changes[i] 
          ? Object.keys(this.state.changes[i]).length > 0 : false}
        buttonClick={this.buttonClick.bind(this)}
      />);
    }
    return(<tbody>{rows}</tbody>);
  }

  lastPage() {
    console.log("lastPage")
    if(this.state.next) {
      this.state.page = 0
      this.props.dataSource(
        this.props.limit + 1, this.props.limit * this.state.page,
        this.populateData.bind(this),
      );
      this.setState({
        loading: true,
      })
    }
  }

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

  refreshSources() {
    if(!this.props.sources) { return }
    let keys = Object.keys(this.props.sources)
    console.log("JSONTable.refreshSources:", keys, this.props.sources);
    for(let i in this.props.sources) {
      console.log("JSONTable.refreshSources: calling;", i, keys[i], keys);
      this.props.sources[i](i, this.populateSource.bind(this));
    }
  }

  refresh() {
    console.log("refresh", 
      {hash: this.state ? this.state.hash:"undefined"},
      this.props, 
      this.state,  
    )
    this.refreshSources();
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

  firstPage() {
    console.log("firstPage")
    this.state.page = 0
    this.props.dataSource(
      this.props.limit + 1, this.props.limit * this.state.page,
      this.populateData.bind(this),
    );
    this.setState({
      loading: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log("JSONTable.componentWillReceiveProps:", {hash: this.state ? this.state.hash:"undefined"}, nextProps);
    this.props = nextProps;
    this.refresh()
  }

  render(){
    console.log("JSONTable.render", 
      {hash: this.state ? this.state.hash:"undefined"}, 
      this.props,
      this.state,
    );
    if(!this.state.data) {
      return <div>loading...</div>
    }
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
          {this.state.data.length > 0 ? this.buildHeader.bind(this)() : null}
          {this.state.data.length > 0 ? this.buildBody.bind(this)() : null}
        </Table>
        <Pager>
          {this.state.page > 0
          ? <Pager.Item previous 
              disabled={this.state.page <=0} 
              onClick={()=>this.firstPage()}
              >{"<<"}
            </Pager.Item>:null}
          {this.state.page > 0
          ? <Pager.Item previous 
              disabled={this.state.page <=0} 
              onClick={()=>this.previousPage()}
              >{"<"}
            </Pager.Item>:null}
          <Pager.Item
            disabled={this.state.loading}
            onClick={()=>this.state.loading?null:this.refresh()}
          >{this.state.loading?`loading`:`Refresh`}</Pager.Item>
          {/* {this.state.next?<Pager.Item next
            // disabled={ !this.state.next } 
            onClick={()=>this.lastPage()}
            >{">>"}
          </Pager.Item>:null} */}
          {this.state.next?<Pager.Item next
            // disabled={ !this.state.next } 
            onClick={()=>this.nextPage()}
            >{">"}
          </Pager.Item>:null}
          
        </Pager>
      </div>
    );
  }
}

export default JSONTable;