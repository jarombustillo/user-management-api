import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/user.model';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql", 
    host: process.env.HOST || "localhost",
    port: 3307,
    username: process.env.USER || "root",
    password: process.env.PASSWORD || "Jarom12345@",
    database: process.env.DATABASE || "user-management-api",
    synchronize: true, // Set to false in production!
    logging: false,
    entities: [User],
    migrations: [], 
    subscribers: [],
});