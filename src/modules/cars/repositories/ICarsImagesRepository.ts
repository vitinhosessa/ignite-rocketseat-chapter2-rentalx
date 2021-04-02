import { CarImage } from "../infra/typeorm/entities/CarImage";

interface ICreateCarImage {
  car_id: string;
  image_name: string;
}

interface ICarsImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImage>;
  findByCarID(car_id: string): Promise<CarImage[]>;
}

export { ICarsImagesRepository, ICreateCarImage };
