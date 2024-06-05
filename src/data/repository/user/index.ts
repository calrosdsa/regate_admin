import { UserDataSource } from "./UserDataSource";
import { UserRepository } from "./UserRepository";


const dataSource = new UserDataSource()
export const userRepository = new UserRepository(dataSource)