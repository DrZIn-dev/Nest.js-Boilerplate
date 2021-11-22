## Information.

- This Project Implement From branch **boilerplate-v.1.0.0** .
- Postgres Column Name User **snake_case** .
- Base Path is **/src**

## Feature

- [x] Ready To Run.
- [x] Postgres Database as Container.
- [x] Config Service
- Read and Ensure .env variable.
- [x] .env Sample.
- [x] Connect Postgres Database.

### MVPs Feature

- [x] Todo ER Diagram.
- [x] Todo Entity
- [ ] Authentication
- [ ] Todo.
- [ ] Assign Member.

### Todo Entity

- [x] Base Entity.
- [x] Member.
- [x] Todo.
- [x] Assigned Member.
- [x] All Class Validate.

#### Authentication

- [x] Member Module and Service.
- [ ] Register Member.
- [ ] Login With Username and Password.
- Return JWT Token.
- [ ] Get Member Profile From JWT Token.
- [ ] validate JWT Token In header **X-Member**

---

## How To Guide.

### Pre Requisite

- docker and docker-compose
- node.js
- nest.js cli

### Prepare Project

1.  Clone Boilerplate Project.
    ```shell
    get clone https://github.com/DrZIn-dev/nest.js_mongo_k8s.git
    ```
2.  Run Project.
    ```
    npm install
    npm run start:dev
    ```
3.  Run Database As Container.
    ```
    docker-compose up -d
    ```

---

### Create Database Entity and Run Migration.

Our Entity Contain TypeORM Column ,Class Validation And Serialize.

1. Create File **model/member.entity.ts**

   ```typescript
   import { Exclude } from 'class-transformer';
   import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
   import { Column, Entity } from 'typeorm';
   import { BaseEntity } from './base.entity';

   @Entity({ name: 'member' })
   export class MemberEntity extends BaseEntity {
     @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
     name: string;

     // class-validate
     @IsString()
     @IsNotEmpty()
     @MaxLength(255)
     @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
     username: string;

     @Exclude() // serialize
     // class-validate
     @IsString()
     @IsNotEmpty()
     @MinLength(8)
     @MaxLength(20)
     @Column({ type: 'text', nullable: false }) // typeORM
     password: string;
   }
   ```

2. Create File **model/todo.entity.ts**

   ```typescript
   import { Type } from 'class-transformer';
   import {
     IsDate,
     IsEnum,
     IsNotEmpty,
     IsString,
     MaxLength,
   } from 'class-validator';
   import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
   import { BaseEntity } from './base.entity';
   import { MemberEntity } from './member.entity';

   export enum TODO_STATUS {
     NOT_STARTED,
     IN_PROGRESS,
     COMPLETE,
   }

   @Entity({ name: 'todo' })
   export class TodoEntity extends BaseEntity {
     @ManyToOne(() => MemberEntity)
     @JoinColumn({ name: 'member_id' })
     member: MemberEntity;

     @IsString()
     @IsNotEmpty()
     @MaxLength(255)
     @Column({ type: 'varchar', length: 255, nullable: false })
     title: string;

     @IsString()
     @IsNotEmpty()
     @MaxLength(255)
     @Column({ type: 'varchar', length: 255, nullable: false })
     description: string;

     @IsEnum(TODO_STATUS)
     @Column({
       type: 'enum',
       enum: TODO_STATUS,
       default: TODO_STATUS.NOT_STARTED,
     })
     status: TODO_STATUS;

     @Type(() => Date)
     @IsDate()
     @Column({ type: 'timestamptz', nullable: false })
     due_date: Date;
   }
   ```

3. Create File **model/assignedMembers.entity.ts**

   ```typescript
   import { Entity, JoinColumn, ManyToOne } from 'typeorm';
   import { BaseEntity } from './base.entity';
   import { TodoEntity } from './todo.entity';

   @Entity({ name: 'assigned_members' })
   export class MemberEntity extends BaseEntity {
     @ManyToOne(() => TodoEntity)
     @JoinColumn({ name: 'todo_id' })
     todo: TodoEntity;

     @ManyToOne(() => MemberEntity)
     @JoinColumn({ name: 'member_id' })
     member: MemberEntity;
   }
   ```

4. Run Migration Generate.

   ```shell
   npm run typeorm:migration:generate -- init
   ```

5. Run Migration Run and Look at The Result in PGAdmin.

   ```shell
   npm run typeorm:migration:run
   ```

---

### Member Service.

Create Member Service For Control Member Entity.

1. Create File **member/member.dto.ts**
   Use Pick Type From Member Entity.

   ```typescript
   import { MemberEntity } from '@/model/member.entity';
   import { PickType } from '@nestjs/mapped-types';

   export class CreateMemberDto extends PickType(MemberEntity, [
     'name',
     'username',
     'password',
   ] as const) {}
   ```

2. Create File **member/member.module.ts**.

   ```typescript
   import { MemberEntity } from '@/model/member.entity';
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { MemberService } from './member.service';

   @Module({
     imports: [TypeOrmModule.forFeature([MemberEntity])],
     providers: [MemberService],
   })
   export class MemberModule {}
   ```

3. Create File **member/member.service.ts**.

   ```typescript
   import { MemberEntity } from '@/model/member.entity';
   import { Injectable } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { CreateMemberDto } from './member.dto';

   @Injectable()
   export class MemberService {
     constructor(
       @InjectRepository(MemberEntity)
       private memberRepository: Repository<MemberEntity>,
     ) {}

     public async create(dto: CreateMemberDto): Promise<string> {
       const insertResult = await this.memberRepository.save(dto);
       return insertResult.id;
     }
   }
   ```

   **Best Practice.**

   - create method return on id.
