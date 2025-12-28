import { BallsCount, getLinesCounts } from "../types/enums";

export const balls = [
  {
    count: BallsCount.One,
    price: "$2.00",
  },
  {
    count: BallsCount.Two,
    price: "$4.00",
  },
  {
    count: BallsCount.Five,
    price: "$10.00",
  },
  {
    count: BallsCount.Ten,
    price: "$20.00",
  },
];

export const lines = getLinesCounts();

