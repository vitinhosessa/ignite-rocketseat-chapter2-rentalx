import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create({
    user_id,
    car_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      id,
      end_date,
      total,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }
  async findOpenRentalByCarID(car_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
  }

  async findByID(id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.id === id);
  }

  async findByUserID(user_id: string): Promise<Rental[]> {
    const rentals = this.rentals.filter((rental) => {
      if (rental.user_id === user_id) {
        return rental;
      }
      return null;
    });

    return rentals;
  }
}

export { RentalsRepositoryInMemory };
