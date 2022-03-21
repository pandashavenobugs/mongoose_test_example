import mongoose from "mongoose";

export interface CarInput {
  name?: string;
  color?: string;
  age?: number;
}

const CarSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    color: { type: String, required: [true, "color is required"] },
    age: {
      type: Number,
      required: [true, "age is required"],
      min: [0, "age must be positive"],
      max: [40, "age must be less than 40"],
    },
  },
  { timestamps: true }
);

export interface CarDocument extends CarInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
const CarModel = mongoose.model<CarDocument>("Car", CarSchema);

export default CarModel;
