import { Request, Response } from "express";
import { container } from "tsyringe";

import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: rental_id } = req.params;
    const { id: user_id } = req.user;

    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);

    const devolutionRental = await devolutionRentalUseCase.execute({
      user_id,
      rental_id,
    });

    return res.status(200).json(devolutionRental);
  }
}

export { DevolutionRentalController };
