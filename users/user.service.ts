import { Repository } from "typeorm";
import { User } from "../users/user.model";
import { AppDataSource } from "../_helpers/db";

interface UserAttributes {
    title: string;
    id?: number;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

const userRepository: Repository<User> = AppDataSource.getRepository(User);

// Get all users
async function getAll(): Promise<User[]> {
    return await userRepository.find();
}

// Get user by ID
async function getById(id: number): Promise<User | null> {
    return await userRepository.findOne({ where: { id } });
}

// Create a new user
async function create(params: UserAttributes): Promise<User> {
    // Check if email is already registered
    const existingUser = await userRepository.findOne({ where: { email: params.email } });
    if (existingUser) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    // Create a new user with default values
    const newUser = userRepository.create({
        ...params,
        firstName: params.firstName || '',
        lastName: params.lastName || '',
        role: params.role || '',
        password: params.password || '',
    });

    return await userRepository.save(newUser);
}

// Update an existing user
async function update(id: number, params: UserAttributes): Promise<User> {
    const user = await getById(id);
    if (!user) {
        throw new Error("User not found");
    }

    Object.assign(user, params);
    return await userRepository.save(user);
}

async function _delete(id: number): Promise<void> {
    const user = await getById(id);
    if (!user) {
        throw new Error("User not found");
    }

    await userRepository.remove(user);
}