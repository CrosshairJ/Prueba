export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Bus = {
  id: string;
  line: string;
  destination: string;
  minutes: number;
  active: boolean;
  coordinate: Coordinate;
};
