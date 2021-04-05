import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IDevolutionRentalDTO } from "@modules/rentals/dtos/IDevolutionRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepositorys")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsImageRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute({ car_id, rental_id }: IDevolutionRentalDTO): Promise<Rental> {
    const minimumDaily = 1;
    const rental = await this.rentalsRepository.findByID(rental_id);
    const car = await this.carsRepository.findByID(car_id);

    if (!rental) throw new AppError("Rental does not exists!");

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    if (daily <= 0) daily = minimumDaily;

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    let total = 0;

    if (delay > 0) {
      const calculateFine = delay * car.fine_amount;
      total = calculateFine;
    }

    total += daily * car.daily_rate;

    rental.end_date = dateNow;
    rental.total = total;

    this.rentalsRepository.create(rental);
    this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
