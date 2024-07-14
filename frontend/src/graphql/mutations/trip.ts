import { gql } from "@apollo/client";

export const CREATE_TRIP = gql`
  mutation CreateTrip($input: TripInput!) {
    createTrip(input: $input) {
      id
      startLocation
      endLocation
      date
      startTime
      estimatedDuration
      endTime
      price
      status
      numberOfPassengers
      vehicleType
      vehicleModel
      licensePlateNumber
      createdAt
      updatedAt
    }
  }
`;

export const ADD_PASSENGER = gql`
  mutation AddPassenger($tripId: String!) {
    addPassenger(tripId: $tripId) {
      id
      passengers {
        id
        firstname
        lastname
        pictureUrl
      }
      numberOfPassengers
      status
    }
  }
`;

export const REMOVE_PASSENGER = gql`
  mutation RemovePassenger($tripId: String!) {
    removePassenger(tripId: $tripId) {
      id
      passengers {
        id
        firstname
        lastname
        pictureUrl
      }
      numberOfPassengers
      status
    }
  }
`;
