export interface User {
  id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  description: string;
  pictureUrl: string;
  birthdate: Date;
  phoneNumber: string;
  isAdmin: boolean;
  trips?: Trip[];
  reviewsAsAuthor?: Review[];
  reviewsAsTarget?: Review[];
  tripsAsDriver?: Trip[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  date: Date;
  price: number;
  status: string;
  numberOfPassengers: number;
  startLocation: string;
  stopLocations: string;
  endLocation: string;
  vehicleType: string;
  vehicleModel: string;
  licensePlateNumber: string;
  estimatedDuration: number;
  startTime: string;
  endTime: string;
  passengers?: User[];
  driver?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  title: string;
  author?: User;
  target?: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum SortBy {
  DATE = "DATE",
  START_TIME = "START_TIME",
  PRICE = "PRICE",
}

export interface RootState {
  user: {
    currentUser: User | null;
  };
}
