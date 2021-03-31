import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 100.0,
      license_plate: "DES-1233",
      fine_amount: 40,
      brand: "Brand1",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Car Description",
      daily_rate: 100.0,
      license_plate: "DES-1443",
      fine_amount: 40,
      brand: "Brand2",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Brand2",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Especific Name 1",
      description: "Car Description",
      daily_rate: 100.0,
      license_plate: "DES-1883",
      fine_amount: 40,
      brand: "Brand3",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Especific Name 1",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Car Description",
      daily_rate: 100.0,
      license_plate: "DES-1443",
      fine_amount: 40,
      brand: "Brand2",
      category_id: "Especific Category 1",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "Especific Category 1",
    });

    expect(cars).toEqual([car]);
  });
});
