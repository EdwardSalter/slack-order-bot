import React from 'react';
import TripList from './TripList';

class TripBox extends React.Component {
  constructor() {
    super();
    this.state = {data: []};
  }

  componentDidMount() {
      $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  }

  render() {
      return (
      <div className="tripBox">
          <h1>Trips</h1>
          <TripList data={this.state.data} />
      </div>
      );
  }
}

export default TripBox;
