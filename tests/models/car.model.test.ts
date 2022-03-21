import { connectToDB, disconnectDB } from "../databaseConnector";
import CarModel, { CarDocument, CarInput } from "../../src/models/Car.model";

describe("connecting to db and testting the CarModel crud", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await CarModel.collection.drop();
    await disconnectDB();
  });

  it("CarModel create test", async () => {
    const car: CarInput = {
      name: "test car",
      color: "red",
      age: 10,
    };
    const createdCar = await CarModel.create(car);
    expect(createdCar._id).toBeDefined();
  });

  it("CarModel require test", async () => {
    const car: CarInput = {
      name: "",
      color: "",
    };
    const createdCar = new CarModel({
      ...car,
    });
    const error = createdCar.validateSync();
    const { name, color, age } = error!.errors;
    expect(name).toMatchObject({
      kind: "required",
      path: "name",
      value: car.name,
      message: "name is required",
      name: "ValidatorError",
    });
    expect(color).toMatchObject({
      kind: "required",
      path: "color",
      value: car.color,
      message: "color is required",
      name: "ValidatorError",
    });

    expect(age).toMatchObject({
      kind: "required",
      path: "age",
      value: car.age,
      message: "age is required",
      name: "ValidatorError",
    });

    // console.log(error!.errors);
    //console.log(name);
    // console.log(color);
  });
  it("age max-min test", async () => {
    const car: CarInput = {
      name: "test car",
      color: "red",
      age: -12,
    };
    const createdCar = new CarModel({
      ...car,
    });
    const error = createdCar.validateSync();
    // console.log(error!);
    const { age } = error!.errors;
    expect(age).toMatchObject({
      kind: "min",
      path: "age",
      value: car.age,
      message: "age must be positive",
      name: "ValidatorError",
    });
  });
});
