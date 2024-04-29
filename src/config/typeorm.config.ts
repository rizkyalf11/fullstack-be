import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306, //port default 3306 lihat xampp
  username: 'root', // username default xampp root
  password: 'rizky17062007', // password default xampp string kosong
  database: 'uts_be',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
