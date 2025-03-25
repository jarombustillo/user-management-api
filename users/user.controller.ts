import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { userService } from "../users/user.service";
import validateRequest from "../_middleware/validate-request";
import Joi, {Schema } from "joi";

const router = express.Router();


// Routes
router.get("/", getAll as RequestHandler);
router.get("/:id", getById as RequestHandler);
router.post("/", createSchema as RequestHandler, create as RequestHandler);
router.put("/:id", updateSchema as RequestHandler, update as RequestHandler);
router.delete("/:id", _delete as RequestHandler);

export default router;

// Route functions
async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.getById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const newUser = await userService.create(req.body);
        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedUser = await userService.update(Number(req.params.id), req.body);
        res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        next(error);
    }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.delete(Number(req.params.id));
        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
}

// Schema validation functions
function createSchema(req: Request, res: Response, next: NextFunction) {
    const schema: Schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    });

    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema: Schema = Joi.object({
        title: Joi.string().allow(""),
        firstName: Joi.string().allow(""),
        lastName: Joi.string().allow(""),
        role: Joi.string().allow(""),
        email: Joi.string().email().allow(""),
        password: Joi.string().min(6).allow(""),
        confirmPassword: Joi.string().valid(Joi.ref("password")).allow(""),
    }).with("password", "confirmPassword");

    validateRequest(req, next, schema);
}