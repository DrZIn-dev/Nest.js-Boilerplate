## Step By Step
### **เตรียม Postgres Database และ PG Admin**
1. สร้างไฟล์ **docker-compose.yaml**
    ```yaml
    version: '3.7'

    services:
      postgres:
        image: postgres:14.1
        env_file: .env
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DATABASE}
        ports:
          - ${POSTGRES_PORT}:5432
      pg_admin:
        image: dpage/pgadmin4:6.1
        environment:
          PGADMIN_DEFAULT_EMAIL: admin@admin.com
          PGADMIN_DEFAULT_PASSWORD: changeme
        ports:
          - 8081:80
        volumes:
          - pgadmin_pv:/var/lib/pgadmin

    volumes:
      pgadmin_pv:
    ```
---
### **Nestjs/CLI**

1. ติดตั้ง nestjs cli
    ```
    npm i -g @nestjs/cli
    ```
2. สร้างโปรเจคด้วย nestjs cli
    ```
    nest new <<change_me>>
    ```
---
### **Nodemon And Ts-node**
1. ติดตั้ง nodemon และ ts-node เพื่อช่วยในการทำ hot-reload
    ```
    npm i --save-dev nodemon ts-node
    ```
2. สร้างไฟล์ชื่อ **nodemon.json** ที่ตำแหน่งเดียวกับ package.json
    ```json
    {
    "watch": ["src"],
    "ext": "ts",
    "ignore": ["src/**/*.spec.ts"],
    "exec": "node --inspect=127.0.0.1:9223 -r ts-node/register -- src/main.ts",
    "env": {}
    }
    ```
3. แก้ไข scripts ใน package.json ส่วนของ **start:dev**
    ```
    "start:dev": "nodemon --config nodemon.json",
    ```
---
### **Typeorm และ Postgres**
1. ติดตั้ง package
   ```shell
   npm install --save @nestjs/typeorm typeorm pg dotenv
   ```
2. สร้างไฟล์ชื่อ **.env**
    ```
    PORT=3000
    MODE=DEV

    POSTGRES_HOST=127.0.0.1
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=password
    POSTGRES_DATABASE=todo
    RUN_MIGRATIONS=true
    ```
3. สร้างไฟล์ชื่อ **src/config/config.server.ts** สำหรับจัดการการตั้งค่าจาก environment variable(.env)
    ```typescript
    import { TypeOrmModuleOptions } from '@nestjs/typeorm';
    import * as dotenv from 'dotenv';

    dotenv.config();

    class ConfigService {
      constructor(private env: { [k: string]: string | undefined }) {}

      private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
          throw new Error(`config error - missing env.${key}`);
        }

        return value;
      }

      public ensureValues(keys: string[]) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
      }

      public getPort() {
        return this.getValue('PORT', true);
      }

      public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
      }

      public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
          type: 'postgres',

          host: this.getValue('POSTGRES_HOST'),
          port: parseInt(this.getValue('POSTGRES_PORT')),
          username: this.getValue('POSTGRES_USER'),
          password: this.getValue('POSTGRES_PASSWORD'),
          database: this.getValue('POSTGRES_DATABASE'),

          entities: ['**/*.entity{.ts,.js}'],

          migrationsTableName: 'migration',

          migrations: ['src/migration/*.ts'],

          cli: {
            migrationsDir: 'src/migration',
          },

          ssl: this.isProduction(),
        };
      }
    }

    const configService = new ConfigService(process.env).ensureValues([
      'POSTGRES_HOST',
      'POSTGRES_PORT',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DATABASE',
    ]);

    export { configService };

    ```
4. เชื่อมต่อกับฐานข้อมูลด้วยการเรียนใช้งาน typeorm และ configService ใน **app.module.ts**
    ```typescript
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { configService } from './config/config.service';

    @Module({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig())
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}

    ```
5. รันโปรแกรมด้วยคำสั่ง 
    ```
    npm run start:dev
    ```
---
### **Database Migration**
เนื่องจาก typeorm cli จะอ่านการตั้งค่าจากไฟล์ **ormconfig.json** (เพราะเราทำ config เป็น configServer ทำให้ typeorm cli ไม่สามารถอ่านได้)
1. สร้างไฟล์ **src/scripts/write-type-orm-config.ts** เพื่อสร้างไฟล์ ormconfig.json ในตำแหน่งเดียวกับ package.json
    ```typescript
    import { configService } from '../config/config.service';
    import fs = require('fs');
    fs.writeFileSync(
      'ormconfig.json',
      JSON.stringify(configService.getTypeOrmConfig(), null, 2),
    );
    ```
2. แก้ไขไฟล์ package.json สำหรับเรียกใช้งานคำสั่งของ typeorm
    ```json
    "pretypeorm": "rimraf ormconfig.json && ts-node -r tsconfig-paths/register src/scripts/write-type-orm-config.ts",
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "typeorm:migration:generate": "npm run typeorm -- migration:generate -n",
    "typeorm:migration:run": "npm run typeorm -- migration:run",
    "typeorm:migration:revert": "npm run typeorm -- migration:revert"
    ```
3. รันคำสั้ง เพื่อสร้างไฟล์ ormconfig.json จาก configService
    ```shell
    npm run pretypeorm
    ```
4. สร้างไฟล์ **src/model/base.entity.ts** เพื่อระบุ collumn ที่ทุก table ต้องมีเหมือนกัน
    ```typescript
    import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

    export abstract class BaseEntity {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
      createDateTime: Date;
    }

    ```
5. สร้างไฟล์ **src/model/item.entity.ts** เพื่อระบุ collumn สำหรับ table item
    ```typescript
    import { Column, Entity } from 'typeorm';
    import { BaseEntity } from './base.entity';

    @Entity({ name: 'item' })
    export class Item extends BaseEntity {
      @Column({ type: 'varchar', length: 300 })
      name: string;

      @Column({ type: 'varchar', length: 300 })
      description: string;
    }
    ```
6. รันคำสั่ง เพื่อสร้างไฟล์ migration
    ```shell
    npm run typeorm:migration:generate -- init
    ```
7. รันคำสั่งเพื่อให้ typeorm สร้างตารางในฐานข้อมูล
    ```shell 
    npm run typeorm:migration:run
    ```
8. **เช็คตารางที่สร้างใหม่ผ่านทาง** pgadmin ที่ **localhost:8081**

---
### **TODOoooooooo**
1. สร้างไฟล์ชื่อ **src/item/item.dto.ts** สำหรับรับข้อมูลจาก body ในการสร้าง todo
    ```typescript
    import { IsString, IsUUID } from 'class-validator';
    import { Item } from '../model/item.entity';

    export class ItemDTO implements Readonly<ItemDTO> {
      @IsUUID()
      id: string;

      @IsString()
      name: string;

      @IsString()
      description: string;

      public static from(dto: Partial<ItemDTO>) {
        const it = new ItemDTO();
        it.id = dto.id;
        it.name = dto.name;
        it.description = dto.description;
        return it;
      }

      public static fromEntity(entity: Item) {
        return this.from({
          id: entity.id,
          name: entity.name,
          description: entity.description,
        });
      }

      public toEntity() {
        const it = new Item();
        it.name = this.name;
        it.description = this.description;
        it.createDateTime = new Date();
        return it;
      }
    }
    ```
2. สร้างไฟล์ **src/item/item.service.ts** สำหรับเก็บ Logic ทั้งหมด
    ```typescript
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Item } from '../model/item.entity';
    import { ItemDTO } from './item.dto';

    @Injectable()
    export class ItemService {
      constructor(
        @InjectRepository(Item) private readonly repo: Repository<Item>,
      ) {}

      public async getAll() {
        return await this.repo.find();
      }

      public async create(dto: ItemDTO): Promise<ItemDTO> {
        return this.repo.save(dto.toEntity()).then((e) => ItemDTO.fromEntity(e));
      }
    }
    ```
3. สร้างไฟล์ **src/item/item.controller.ts**  สำหรับระบุ end point และ method ต่างๆ
    ```typescript
    import { Body, Controller, Get, Post } from '@nestjs/common';
    import { ItemDTO } from './item.dto';
    import { ItemService } from './item.service';

    @Controller('item')
    export class ItemController {
      constructor(private service: ItemService) {}

      @Get()
      public async getAll() {
        return await this.service.getAll();
      }
      @Post()
      public async post(@Body() dto: ItemDTO): Promise<ItemDTO> {
        return this.service.create(ItemDTO.from(dto));
      }
    }
    ```
4. สร้างไฟล์ **src/item/item.module.ts**  เพื่อให้ controller สามารถเรียกใช้งาน service ได้ และ service สามารถเรียกใช้งาน entities ได้
    ```typescript
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Item } from './../model/item.entity';
    import { ItemController } from './item.controller';
    import { ItemService } from './item.service';

    @Module({
      imports: [TypeOrmModule.forFeature([Item])],
      providers: [ItemService],
      controllers: [ItemController],
      exports: [],
    })
    export class ItemModule {}
    ```
5. เรียกใช้งาน item.module ใน app.module
    ```typescript
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { configService } from './config/config.service';
    import { ItemModule } from './item/item.module';

    @Module({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        ItemModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
---
### **ทดลองใช้งาน**
1. สร้างไฟล์ **src/item/item.http**
    ```http
    ###
    GET http://localhost:3000/item
    ###
    POST http://localhost:3000/item
    Content-Type: application/json

    {
      "name": "hello",
      "description":"world"
    }
    ```
