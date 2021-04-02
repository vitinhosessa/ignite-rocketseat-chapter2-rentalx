import { inject, injectable } from "tsyringe";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { deleteFile } from "@utils/file";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsImageRepository")
    private carsImagesRepository: ICarsImagesRepository,

    @inject("CarsImageRepository")
    private carsImageRepository: ICarsImagesRepository
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const carImages = await this.carsImageRepository.findByCarID(car_id);

    carImages.map(async (car_image) => {
      if (car_image.image_name)
        await deleteFile(`./tmp/cars/${car_image.image_name}`);
    });

    images_name.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
    });
  }
}
export { UploadCarImagesUseCase };
