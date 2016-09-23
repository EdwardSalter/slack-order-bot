import React from 'react';

class Trip extends React.Component {
  render() {
    var date = moment(this.props.date).fromNow();
    var creator = this.props.creator ? this.props.creator.name : "Unknown";

    return (
      <div className="event">
        <div className="content">
          <div className="summary">
            {creator} created a trip
            <div className="date">
              {date}
            </div>
          </div>
          <div className="extra text">
            There are {this.props.children.length} orders in this trip
          </div>
          <div className="meta">
          </div>
        </div>
      </div>
    );
  }
}

export default Trip;
