export type EaterSize = 'SMALL' | 'MEDIUM' | 'XL';

export type Participant = {
  id: string;
  name: string;
  eaterSize: EaterSize;
  noPork: boolean;
  noAlcohol: boolean;
  isVeggie: boolean;
};

export type ParticipantForm = {
  name: string;
  eaterSize: EaterSize;
  noPork: boolean;
  noAlcohol: boolean;
  isVeggie: boolean;
};
