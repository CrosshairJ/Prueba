export type Profile = 'Pasajero' | 'Conductor';

export const PROFILES: Profile[] = ['Pasajero', 'Conductor'];

export type User = {
  name: string;
  email: string;
  password: string;
  profile: Profile;
};
