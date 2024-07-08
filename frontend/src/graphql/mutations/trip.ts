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
