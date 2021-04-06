import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const listRentalsByUser = await container.resolve(ListRentalsByUserUseCase);

    const rentals = await listRentalsByUser.execute(id);

    return res.json(rentals);
  }
}

export { ListRentalsByUserController };
