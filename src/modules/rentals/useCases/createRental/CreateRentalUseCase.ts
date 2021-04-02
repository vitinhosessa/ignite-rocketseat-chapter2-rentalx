import { inject, injectable } from "tsyringe";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

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

    const rental = await this.rentalRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
