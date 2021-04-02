import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

dayjs.extend(utc);

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("CarsRepository")
    private rentalRepository: IRentalsRepository
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const minHoursToRent = 24;

    const carUnavailable = await this.rentalRepository.findOpenRentalByCarID(
      car_id
    );
    if (carUnavailable) throw new AppError("Car unavailable!");

    const rentalOpenToUser = await this.rentalRepository.findOpenRentalByUser(
      user_id
    );
    if (rentalOpenToUser) {
      throw new Error("There's a rental in progress for this user!");
    }

    const dateNow = dayjs().utc().local().format();
    const expectedReturnDateFormated = dayjs(expected_return_date)
      .utc()
      .local()
      .format();
    const dateCompare = dayjs(expectedReturnDateFormated).diff(
      dateNow,
      "hours"
    );
    if (dateCompare < minHoursToRent) {
      throw new AppError("Minimum car rental time is 24 hours!");
    }

    const rental = await this.rentalRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
