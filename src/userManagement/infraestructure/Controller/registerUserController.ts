import { RegisterUserUseCase } from "../../application/UseCase/registerUserUseCase";
import { Request, Response } from "express";
import { EmailService } from "../Service/email";
import { User } from "../../domain/Entity/user";

export class RegisterUserController {
    constructor(readonly registerUserUseCase: RegisterUserUseCase) { }

    async register(req: Request, res: Response) {
        let { name, lastName, cellphone, email, password } = req.body;
        try {

            let user = await this.registerUserUseCase.run(name, lastName, cellphone, email, password);

            if (user) {
                //const apiKey = 're_94wkkd5X_Lw7P7P8zUPkDjb15RNvWm99Z';
                //const emailService = new EmailService(apiKey);

                //wait emailService.run(user);

                return res.status(201).send({
                    status: "succes",
                    data: {
                        uuid: user.uuid,
                        Name: user.contact.name,
                        email: user.credential.email,
                        Token: user.status.activationToken
                    }
                });
            }

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.startsWith('[')) {
                    return res.status(400).send({
                        status: "error",
                        message: "Validation failed",
                        errors: JSON.parse(error.message)
                    });
                }
            }
            return res.status(500).send({
                status: "error",
                message: "An error occurred while delete the user."
            });
        }
    }
}
