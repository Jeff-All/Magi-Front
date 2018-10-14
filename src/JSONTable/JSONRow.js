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
  DropdownButton,
  MenuItem,
  Glyphicon,
  ButtonGroup,
  ButtonToolbar
} from 'react-bootstrap';

class JSONRow extends React.Component {
  constructor(props) {
    super(props)
  }

  // buttonClick(action, data) {
  //   action(data, this.props.refresh)
  // }

  buttonClick_callback() {
    console.log("buttonClick_callback", this.data)
  }

  buildButtons() {
    let buttons = [];
    console.log("JSONRow.buildButtons:", this.props.actions)
    for(let i in this.props.actions) {
      console.log("JSONRow.buildButtons: iterate:", this.props.actions[i])
      buttons.push(
        <Button 
          key={i}
          onClick={()=>{
            this.props.buttonClick(
              this.props.actions[i].onClick,
              this.props.id,
              this.props.refresh,
          );}}
          disabled={ this.props.actions[i].isDisabled
            ?this.props.actions[i].isDisabled(this)
            :false
          }
        >
        <Glyphicon glyph={this.props.actions[i].glyph}/>
        </Button>
      );
    }
    return <td key="actions"><ButtonToolbar>{buttons}</ButtonToolbar></td>
  }

  renderDropDown(col, current, source) {
    let items = []
    for(let i in source) {
      items.push(<MenuItem
        id={source[i]}
        key={i} 
        eventKey={source[i]}
        onSelect={key=>this.props.setCell(col, key)}
      >{source[i]}</MenuItem>);
    }
    return(<td key={col}><DropdownButton id={col} title={current}>
        {items}
      </DropdownButton></td>
    );
  }

  render() {
    console.log("JSONRow.render:", this.props.data, this.props.sources);
    let columns = [];
    let keys = Object.keys(this.props.data);
    for(let i in this.props.data) {
      console.log("JSONRow.render: in loop:", i, 
        this.props.data, 
        this.props.sources, 
        this.props.sources[i],
      );
      if(this.props.sources[i]) {
        columns.push( this.renderDropDown(
          i,
          this.props.data[i], 
          this.props.sources[i]
        ));
      } else {
        columns.push(<td key={i}>{this.props.data[i]}</td>);
      }
    }
    columns.push(this.buildButtons())
    return(<tr>{columns}</tr>);
  }
}

export default JSONRow;