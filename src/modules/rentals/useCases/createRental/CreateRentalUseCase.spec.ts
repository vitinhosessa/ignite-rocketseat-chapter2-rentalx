import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let createCarUseCase: CreateCarUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dateAdd24Hours = dayjs().add(1, "day").utc().local().toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
      carsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new rental", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "DEV-1337",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "54321a",
      expected_return_date: dateAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
    expect(rental.user_id).toEqual("54321a");
    expect(rental.car_id).toEqual(car.id);
  });

  it("should not be able to create a new rental when there is a active rental in same user", async () => {
    const car1 = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "DEV-1337",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const car2 = await createCarUseCase.execute({
      name: "Name Car2",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "DEV-12337",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    await createRentalUseCase.execute({
      car_id: car1.id,
      user_id: "54321a",
      expected_return_date: dateAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car2.id,
        user_id: "54321a",
        expected_return_date: dateAdd24Hours,
      })
    ).rejects.toEqual(
      new AppError("There's a rental in progress for this user!")
    );
  });

  it("should not be able to create a new rental when there is a a active rental for the same car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "DEV-1337",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "123",
      expected_return_date: dateAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: "321",
        expected_return_date: dateAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car unavailable!"));
  });

  it("should not be able to create a new rental with less then 21 hours rental time", async () => {
    const dateAdd12Hours = dayjs().add(12, "hour").toDate();

    await expect(
      createRentalUseCase.execute({
        car_id: "test",
        user_id: "123",
        expected_return_date: dateAdd12Hours,
      })
    ).rejects.toEqual(new AppError("Minimum car rental time is 24 hours!"));
  });
});
