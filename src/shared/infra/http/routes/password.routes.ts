import { Router } from "express";

import { ResetPasswordController } from "@modules/accounts/UseCases/resetPassword/ResetPasswordController";
import { SendForgotPasswordMailController } from "@modules/accounts/UseCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordRoutes = Router();
const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
