import React from 'react';
import Trip from './Trip';

class TripList extends React.Component {
  render() {
      var tripNodes = !this.props.data.length ?
      <p>No trips :(</p> :
      this.props.data.map(trip => {
          return (
              <Trip creator={trip.creator} date={trip.date} key={trip._id}>
                {trip.orders}
              </Trip>
          );
      });
    return (
      <div className="ui feed">
        {tripNodes}
      </div>
    );
  }
}

export default TripList;
