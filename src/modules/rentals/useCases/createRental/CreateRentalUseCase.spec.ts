import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider;
describe("Create Rental", () => {
  const dateAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "12345",
      user_id: "54321a",
      expected_return_date: dateAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental when there is a active rental in same user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "54321a",
        expected_return_date: dateAdd24Hours,
      });

      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "54321a",
        expected_return_date: dateAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental when there is a a active rental for the same car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "test",
        user_id: "123",
        expected_return_date: dateAdd24Hours,
      });

      await createRentalUseCase.execute({
        car_id: "test",
        user_id: "321",
        expected_return_date: dateAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental with less then 21 hours rental time", async () => {
    expect(async () => {
      const dateAdd12Hours = dayjs().add(12, "hour").toDate();
      await createRentalUseCase.execute({
        car_id: "test",
        user_id: "123",
        expected_return_date: dateAdd12Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
