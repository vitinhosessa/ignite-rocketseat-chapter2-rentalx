import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/CreateCarSpecification/CreateCarSpecificationController";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "@modules/cars/useCases/UploadCarImages/UploadCarImagesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const carsRoutes = Router();

const updloadImages = multer(uploadConfig);

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

carsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get("/avaiable", listAvailableCarsController.handle);

carsRoutes.post(
  "/specifications/:id",
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
);

carsRoutes.post(
  "/images/:id",
  ensureAuthenticated,
  ensureAdmin,
  updloadImages.array("images"),
  uploadCarImagesController.handle
);

export { carsRoutes };
