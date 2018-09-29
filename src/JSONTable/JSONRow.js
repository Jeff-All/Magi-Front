import React from 'react';

class JSONRow extends React.Component {
  constructor(props) {
    super(props)
  }

  buttonClick() {
    this.action(this.data, this.this.props.refresh)
  }

  buttonClick_callback() {
    console.log("buttonClick_callback", this.data)
  }

  buildButtons() {
    let buttons = [];
    for(let i in this.props.actions) {
      let cur = this.props.actions[i].render(
        this.buttonClick.bind({
          this: this,
          action: this.props.actions[i].action,
          data: this.props.data,
        }),
      );
      // cur.onClick = this.props.actions[i].action;
      buttons.push(<td key={i}>{cur}</td>);
    }
    return buttons;
  }

  render() {
    let columns = [];
    for(let i in this.props.data) {
      columns.push(<td key={i}>{this.props.data[i]}</td>);
    }
    columns.push(...this.buildButtons())
    return(<tr>{columns}</tr>);
  }
}

export default JSONRow;