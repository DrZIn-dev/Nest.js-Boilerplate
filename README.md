## Information.

- This Project Implement From branch **boilerplate-v.1.0.0** .
- Postgres Column Name User **snake_case** .
- Base Path is **/src**

## Feature

**Member**

- [x] Register Member.

**Todo**

- [x] Only member can create new todo with **not_started** status.
- [x] Every member can list **existing** todo.
- [x] Only todo **owner** can update their **title** and **description**.
- [x] Only todo **owner** can change status.
- [x] Only todo **owner** can delete todo(soft delete).
- [ ] Send notification to all assigned member when **owner** delete **active** todo.

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

   @Entity({ name: 'members' })
   export class MemberEntity extends BaseEntity {
     @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
     name: string;

     // class-validate
     @IsString()
     @IsNotEmpty()
     @MaxLength(255)
     @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
     username: string;

     // @Exclude()
     @Exclude({ toPlainOnly: true })
     // class-validate
     @IsString()
     @IsNotEmpty()
     @MinLength(8)
     @MaxLength(20)
     @Column({ type: 'text', nullable: false }) // typeORM
     password: string;

     constructor(partial: Partial<MemberEntity>) {
       super();
       Object.assign(this, partial);
     }
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

   @Entity({ name: 'todos' })
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
   import { MemberEntity } from './member.entity';
   import { TodoEntity } from './todo.entity';

   @Entity({ name: 'assigned_members' })
   export class AssignedMemberEntity extends BaseEntity {
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

### Member Module.

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

     public async create(dto: CreateMemberDto): Promise<MemberEntity['id']> {
       const newMember = new MemberEntity(dto);
       newMember.password = await hash(
         newMember.password,
         configService.getSaltRounds(),
       );
       const insertResult = await this.memberRepository.save(newMember);
       return insertResult.id;
     }
   }
   ```

   **Best Practice.**

   - create method return on id.

---

### Authentication - Register Member

1. Create Template File for Auth module.

   ```shell
   nest g module auth --no-spec
   nest g controller auth --no-spec
   nest g service auth --no-spec
   ```

2. Register Entity and Member Service in Auth Module.

   ```typescript
   import { MemberService } from '@/member/member.service';
   import { MemberEntity } from '@/model/member.entity';
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { AuthController } from './auth.controller';
   import { AuthService } from './auth.service';

   @Module({
     imports: [TypeOrmModule.forFeature([MemberEntity])],
     controllers: [AuthController],
     providers: [AuthService, MemberService],
   })
   export class AuthModule {}
   ```

3. สร้าง method **register** ใน **auth/auth.controller.ts** โดยการเรียกใช้ MemberService

   - ระบุให้ อยู่ที่ **POST auth/register**

   ```typescript
   import { CreateMemberDto } from '@/member/member.dto';
   import { MemberService } from '@/member/member.service';
   import {
     Body,
     Controller,
     HttpCode,
     HttpStatus,
     Post,
   } from '@nestjs/common';

   @Controller('auth')
   export class AuthController {
     constructor(private memberService: MemberService) {}

     @Post('register')
     @HttpCode(HttpStatus.CREATED)
     public async register(@Body() dto: CreateMemberDto) {
       return await this.memberService.create(dto);
     }
   }
   ```

---

### Authentication - Login

- เข้าสู่ระบบโดยใช้ username และ password
- เมื่อเข้าสู้ระบบสำเร็จจะได้รับ access token

1. สร้าง method findByUsername ใน **member/member.service.ts**.

   ```typescript
   public async findByUsername(
     username: MemberEntity['username'],
   ): Promise<MemberEntity> {
     return await this.memberRepository.findOne({ where: { username } });
   }
   ```

2. สร้าง method validateMember ใน **auth/auth.service.ts**

   ```typescript
   import { MemberService } from '@/member/member.service';
   import { MemberEntity } from '@/model/member.entity';
   import { Injectable } from '@nestjs/common';
   import { compare } from 'bcrypt';
   import { LoginDto } from './auth.dto';

   @Injectable()
   export class AuthService {
     constructor(private memberService: MemberService) {}

     public async validateMember(dto: LoginDto): Promise<MemberEntity> {
       const member = await this.memberService.findByUsername(dto.username);
       if (member) {
         const comparePassword = await compare(dto.password, member.password);
         if (comparePassword) return member;
       }
       return null;
     }
   }
   ```

3. สร้าง LocalStrategy ใน **auth/local.strategy.ts**

   ```typescript
   import { Injectable, UnauthorizedException } from '@nestjs/common';
   import { PassportStrategy } from '@nestjs/passport';
   import { Strategy } from 'passport-local';
   import { AuthService } from './auth.service';

   @Injectable()
   export class LocalStrategy extends PassportStrategy(Strategy) {
     constructor(private authService: AuthService) {
       super();
     }

     async validate(username: string, password: string): Promise<any> {
       const member = await this.authService.validateMember({
         username,
         password,
       });
       if (!member) {
         throw new UnauthorizedException();
       }
       return member;
     }
   }
   ```

4. เรียกใช้งาน LocalStrategy ใน **src/auth.module.ts**

- ทำให้สามารถใช้งาน LocalAuthGuard ใน controller ได้

  ```typescript
  providers: [AuthService, MemberService, LocalStrategy], ``;
  ```

5. สร้างไฟล์ **local-auth.guard.ts**

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { AuthGuard } from '@nestjs/passport';

   @Injectable()
   export class LocalAuthGuard extends AuthGuard('local') {}
   ```

6. สร้าง method login ใน **auth/auth.controller.ts**.

- เรียกใช้งาน LocalAuthGuard เพื่อให้ passport.js เรียกใช้งาน method validate ใน LocalStrategy
- เมื่อ Login สำเร็จจะส่งข้อมูลของ Member กับไปทาง Response

  ```typescript
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@User() member: MemberEntity) {
    return member;
  }
  ```

7. สร้างไฟล์ **auth/jwt.strategy.ts**

- ถูกเรียกใช้เมื่อมีการใช้ **JwtAuthGuard** ใน **src/auth.controller.ts**

  ```typescript
  import { configService } from '@/config/config.service';
  import { Injectable } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import { ExtractJwt, Strategy } from 'passport-jwt';

  export interface JWTPayload {
    username: MemberEntity['username'];
    name: MemberEntity['name'];
    sub: MemberEntity['id'];
  }

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.getJwtSecret(),
      });
    }

    async validate(payload: JWTPayload) {
      return {
        username: payload.username,
        name: payload.name,
        id: payload.sub,
      };
    }
  }
  ```

8. เรียกใช้่งาน **JwtStrategy,JWTModule** ใน **auth/auth.module.ts**

- ทำให้สามารถ เรียกใช้งาน **JwtAuthGuard** ใน controller ได้

  ```typescript
  @Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity]),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MemberService, LocalStrategy, JwtStrategy],
  })
  ```

9. สร้าง login method ใน **auth/auth.service.ts**

- ทำหน้าที่ sign jwt payload เป็น jwt token เพื่อส่งให้ client

  ```typescript
  import { MemberService } from '@/member/member.service';
  import { MemberEntity } from '@/model/member.entity';
  import { Injectable } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { compare } from 'bcrypt';
  import { LoginDto } from './auth.dto';

  @Injectable()
  export class AuthService {
    constructor(
      private memberService: MemberService,
      private jwtService: JwtService,
    ) {}

    public async login(member: MemberEntity) {
      const jwtPayload = {
        username: member.username,
        name: member.name,
        sub: member.id,
      };

      return this.jwtService.sign(jwtPayload);
    }

    public async validateMember(dto: LoginDto): Promise<MemberEntity> {
      const member = await this.memberService.findByUsername(dto.username);
      if (member) {
        const comparePassword = await compare(dto.password, member.password);
        if (comparePassword) return member;
      }
      return null;
    }
  }
  ```

10. ใช้งาน method login ใน **auth/auth.controller.ts**

    ```typescript
    @Post('login')
    @UseGuards(LocalAuthGuard)
    public async login(@User() member: MemberEntity) {
      return this.authService.login(member);
    }
    ```

---

### Authentication - Profile

1. สร้าง method profile ใน **auth/auth.controller.ts**

- เรียกใช้งาน JwtAuthGuard เพื่อทำการตรวจสอบ jwt token และ decode เพื่อได้ JWT Payload
- เมื่อ Login สำเร็จได้ข้อมูลของ Member กลับไป

  ```typescript
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  public async profile(@User() jwtPayload: JWTPayload) {
    return jwtPayload;
  }
  ```

---

### Authentication - ScaMo

1. แก้ไข **auth/jwt.strategy.ts** เพื่อให้เช็ค Token จาก **X-Member-Token** แทน

- เมื่อไม่ได้แนบ Token มากับ X-Member-Token จะ Return 401

  ```typescript
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromHeader('x-member-token'),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }
  ```

2. แก้ไข **jwt-auth.guard.ts** ให้รอบรับตามโจทย์

   ```typescript
   import {
     ExecutionContext,
     ForbiddenException,
     Injectable,
     UnauthorizedException,
   } from '@nestjs/common';
   import { AuthGuard } from '@nestjs/passport';
   import { JsonWebTokenError } from 'jsonwebtoken';

   @Injectable()
   export class JwtAuthGuard extends AuthGuard('jwt') {
     canActivate(context: ExecutionContext) {
       return super.canActivate(context);
     }

     handleRequest(err, user, info: JsonWebTokenError) {
       if (info) {
         const { message } = info;
         if (message === 'No auth token') throw new UnauthorizedException();

         throw new ForbiddenException();
       }

       if (err || !user) {
         throw err || new UnauthorizedException();
       }
       return user;
     }
   }
   ```

---

### Global Module

1. สร้าง **global.module.ts**

- import JWTModule, TypeORM
- export JWTModule

  ```typescript
  import { Global, Module } from '@nestjs/common';
  import { JwtModule } from '@nestjs/jwt';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { JwtStrategy } from './auth/jwt.strategy';
  import { configService } from './config/config.service';
  import { MemberEntity } from './model/member.entity';
  import { TodoEntity } from './model/todo.entity';

  @Global()
  @Module({
    imports: [
      JwtModule.register({
        secret: configService.getJwtSecret(),
        signOptions: { expiresIn: '7d' },
      }),
      TypeOrmModule.forFeature([TodoEntity, MemberEntity]),
    ],
    controllers: [],
    providers: [JwtStrategy],
    exports: [JwtModule, TypeOrmModule],
  })
  export class GlobalModule {}
  ```

2. ลบ import JWTModule จาก module อื่นๆ

---

### Todo - Create

1. สร้าง **todo/todo.module.ts**

   ```shell
   nest g module todo
   ```

2. สร้าง **todo/todo.service.ts**

   ```shell
   nest g service todo
   ```

3. สร้าง **todo/todo.controller.ts**

   ```shell
   nest g controller todo
   ```

4. สร้าง **todo/todo.dto.ts** และ class CreateTodoDto

   ```typescript
   import { TodoEntity } from '@/model/todo.entity';
   import { PickType } from '@nestjs/mapped-types';

   export class CreateTodoDto extends PickType(TodoEntity, [
     'title',
     'description',
     'due_date',
   ] as const) {}
   ```

5. เรียกใช้งาน todoEntity ใน **todo/todo.module.ts**

   ```typescript
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { TodoEntity } from '@/model/todo.entity';

   // other code
   imports: [TypeOrmModule.forFeature([TodoEntity])],
   ```

6. สร้าง method create ใน **todo/todo.service.ts**

   ```typescript
   import { MemberService } from '@/member/member.service';
   import { MemberEntity } from '@/model/member.entity';
   import { TodoEntity } from '@/model/todo.entity';
   import { Injectable } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { CreateTodoDto } from './todo.dto';

   @Injectable()
   export class TodoService {
     constructor(
       @InjectRepository(TodoEntity)
       private todoRepository: Repository<TodoEntity>,
       private memberService: MemberService,
     ) {}

     public async create(
       memberId: MemberEntity['id'],
       dto: CreateTodoDto,
     ): Promise<TodoEntity['id']> {
       const member = await this.memberService.findById(memberId);
       const newTodo: Partial<TodoEntity> = {
         ...dto,
         member,
       };

       const insertResult = await this.todoRepository.save(newTodo);
       return insertResult.id;
     }
   }
   ```

7. สร้าง method และ ระบุ Route ใน **todo/todo.controller.ts**

- กำหนดให้ Member ที่ **X-Member-Token** ถูกต้องสามารถเข้าใช้งานได้

  ```typescript
  import { JwtAuthGuard } from '@/jwt-auth.guard';
  import { MemberEntity } from '@/model/member.entity';
  import { User } from '@/user.decorator';
  import { Body, Controller, Post, UseGuards } from '@nestjs/common';
  import { CreateTodoDto } from './todo.dto';
  import { TodoService } from './todo.service';

  @Controller('todo')
  export class TodoController {
    constructor(private todoService: TodoService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    public async create(
      @User() member: MemberEntity,
      @Body() dto: CreateTodoDto,
    ) {
      return await this.todoService.create(member.id, dto);
    }
  }
  ```

### Todo - Update

- update title, description and status

1. สร้าง class UpdateTodoDto ใน **todo/todo.dto.ts**

- เป็น PartialType ทำให้ client ไม่ต้องส่งบาง column มาได้

  ```typescript
  export class UpdateTodoDto extends PartialType(
    PickType(TodoEntity, ['title', 'description', 'status'] as const),
  ) {}
  ```

2. เพิ่ม ValidationPipe ใน main.ts

- ป้องกันการส่ง key เกินจากที่ระบุไว้ใน dtp

  ```typescript
  // other code
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  ```

3. สร้าง method update ใน **todo/todo.service.ts**

- เช็ค memberId ว่าเป็นเจ้าของ Todo ก่อนอัพเดต

  ```typescript
  public async update(
    memberId: MemberEntity['id'],
    todoId: MemberEntity['id'],
    dto: UpdateTodoDto,
  ) {
    const isExists = await this.todoRepository.findOne({
      where: { id: todoId, member: { id: memberId } },
    });
    if (!isExists) throw new ForbiddenException();
    await this.todoRepository.update(todoId, dto);
    return Promise.resolve();
  }
  ```

4. สร้าง route ใน **todo/todo.controller.ts**

- เรียกใช้งาน **JWTAuthGuard**

  ```typescript
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @User() member: MemberEntity,
    @Param('id') id: TodoEntity['id'],
    @Body() dto: UpdateTodoDto,
  ) {
    return await this.todoService.update(member.id, id, dto);
  }
  ```

---

### Todo - Delete

1. สร้าง private method **validateOwner** ใน **todo/todo.service.ts**

   ```typescript
   private async validateOwner(
     memberId: MemberEntity['id'],
     todoId: TodoEntity['id'],
   ): Promise<boolean> {
     const isExists = await this.todoRepository.findOne({
       where: { id: todoId, member: { id: memberId } },
     });
     if (isExists) return true;
     return false;
   }
   ```

2. สร้าง method **delete** ใน **todo/todo.service.ts**

   ```typescript
   public async delete(
     memberId: MemberEntity['id'],
     todoId: MemberEntity['id'],
   ) {
     const isOwner = await this.validateOwner(memberId, todoId);
     if (!isOwner) throw new ForbiddenException();
     await this.todoRepository.softDelete(todoId);
     return Promise.resolve();
   }
   ```

3. สร้าง route ใน **todo/todo.controller.ts**

   ```typescript
   @Delete(':id')
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.NO_CONTENT)
   public async delete(
     @User() member: MemberEntity,
     @Param('id') id: TodoEntity['id'],
   ) {
     return await this.todoService.delete(member.id, id);
   }
   ```

---

### Todo - List

1. สร้าง method getAll ใน **todo/todo.service.ts**

- join member

  ```typescript
   public async getAll(): Promise<TodoEntity[]> {
     return await this.todoRepository.find({ relations: ['member'] });
   }
  ```

2. สร้าง route ใน **todo/todo.controller.ts**

- ใช้งาน UseInterceptors เพื่อกรอง key ที่ไม่ต้องการให้ Client ได้รับ

  ```typescript
  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getAll() {
    return await this.todoService
      .getAll()
      .then((e) => e.map((todo) => new TodoEntity(todo)));
  }
  ```

---

### Rate Limit

1. ติดตั้ง package

   ```shell
   npm i --save @nestjs/throttler
   ```

2. เพิ่ม RATE_LIMIT_ALLOW ใน .env

```env
RATE_LIMIT_ALLOW=10
```

3. เพิ่ม method getRateLimit ใน **config/config.service.ts**

   ```typescript
   public getRateLimit() {
     return parseInt(this.getValue('RATE_LIMIT_ALLOW', true));
   }
   ```

4. เพ่ิมตั้งค่า throttler ใน **global.module.ts**

   ```typescript
   // other import
   import { ThrottlerModule } from '@nestjs/throttler';

   @Global()
   @Module({
     imports: [
       // other import
       ThrottlerModule.forRoot({
         ttl: 60,
         limit: configService.getRateLimit(),
       }),
     ],
     // other properties
     exports: [
       // other exports
       ThrottlerModule,
     ],
   })
   export class GlobalModule {}
   ```

5. ใช้งาน ThrottlerGuard ใน register member **auth/auth.controller.ts**

   ```typescript
   // other import
   import { ThrottlerGuard } from '@nestjs/throttler';

   // other controller
   @Post('register')
   @HttpCode(HttpStatus.CREATED)
   @UseGuards(ThrottlerGuard)
   public async register(@Body() dto: CreateMemberDto) {
    return await this.memberService.create(dto);
   }
   ```

6. ใช้งาน Guard create todo ใน **todo/todo.controller.ts**

   ```typescript
   // other import
   import { ThrottlerGuard } from '@nestjs/throttler';

   // other code
   @Post()
   @UseGuards(JwtAuthGuard, ThrottlerGuard)
   public async create(
   @User() member: MemberEntity,
   @Body() dto: CreateTodoDto,
   ) {
     return await this.todoService.create(member.id, dto);
   }
   ```

---

### Todo - Assigned Member

1. แก้ไข **mode/assigned-member.entity.ts** ให้รองรับ index

   ```typescript
   import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
   import { BaseEntity } from './base.entity';
   import { MemberEntity } from './member.entity';
   import { TodoEntity } from './todo.entity';

   @Entity({ name: 'assigned_members' })
   @Unique(['todo', 'member'])
   export class AssignedMemberEntity extends BaseEntity {
     @ManyToOne(() => TodoEntity)
     @JoinColumn({ name: 'todo_id' })
     todo: TodoEntity;

     @ManyToOne(() => MemberEntity)
     @JoinColumn({ name: 'member_id' })
     member: MemberEntity;
   }
   ```

2. แก้ไข **src/todo.entity.ts** ให้รองรับ one-to-many กับ assigned-members

   ```typescript
   // other code
   @OneToMany(
     () => AssignedMemberEntity,
     (assignedMember) => assignedMember.todo,
   )
   assigned_members: AssignedMemberEntity[];
   ```

3. สร้าง **src/assign-member.dto.ts**

   ```typescript
   import { IsString } from 'class-validator';

   export class CreateAssignMemberDto {
     @IsString({ each: true })
     members: string[];
   }
   ```

4. สร้าง **src/assign-member.service.ts**

- สามารถสร้าง assign member พร้อมกันได้หลาย member
- สามารถลบ assign member พร้อมกันได้หลาย member

  ```typescript
  import { AssignedMemberEntity } from '@/model/assigned-member.entity';
  import { TodoEntity } from '@/model/todo.entity';
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateAssignMemberDto } from './assign-member.dto';

  @Injectable()
  export class AssignMemberService {
    constructor(
      @InjectRepository(AssignedMemberEntity)
      private assignMemberRepository: Repository<AssignedMemberEntity>,
    ) {}

    public async getAll() {
      return await this.assignMemberRepository.find({ relations: ['todo'] });
    }

    public async createMany(
      todoId: TodoEntity['id'],
      members: CreateAssignMemberDto,
    ) {
      const insertResult = await Promise.all(
        members.members.map((memberId) => {
          const newAssignedMember = {
            todo: {
              id: todoId,
            },
            member: {
              id: memberId,
            },
          };
          return this.assignMemberRepository.save(newAssignedMember);
        }),
      );
      return insertResult.map((e) => e.id);
    }

    public async remove(
      todoId: TodoEntity['id'],
      members: CreateAssignMemberDto,
    ) {
      const insertResult = await Promise.all(
        members.members.map((memberId) => {
          return this.assignMemberRepository.delete({
            todo: { id: todoId },
            member: { id: memberId },
          });
        }),
      );
      return insertResult;
    }
  }
  ```

5. สร้าง **src/assign-member.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { AssignMemberService } from './assign-member.service';

@Module({ providers: [AssignMemberService] })
export class AssignMemberModule {}
```

6. เพิ่ม controller สำหรับ assign member ใน **src/todo.controller.ts**

   ```typescript
   // other code
   @Post('/:id/member')
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.NO_CONTENT)
   public async assignMember(
     @Param('id') id: TodoEntity['id'],
     @Body() dto: CreateAssignMemberDto,
   ) {
     return await this.assignMemberService
       .createMany(id, dto)
       .catch(({ message }) => {
         throw new InternalServerErrorException(message);
       });
   }

   @Delete('/:id/member')
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.NO_CONTENT)
   public async unassignMember(
     @Param('id') id: TodoEntity['id'],
     @Body() dto: CreateAssignMemberDto,
   ) {
     return await this.assignMemberService
       .remove(id, dto)
       .catch(({ message }) => {
         throw new InternalServerErrorException(message);
       });
   }
   // other code
   ```

### Task Scheduler

1. ติดตั้ง package

```shell
npm install --save @nestjs/schedule
npm install --save-dev @types/cron
```

2. ใช้งานใน **app.module.ts**

   ```typescript
   imports: [
       ScheduleModule.forRoot(),
       // ...other module
     ],
   ```

3. สร้าง **schedule/notification.service.ts**

- query ทุก todo ที่จะหมดอายุขณะ active

  ```typescript
  import { TodoEntity, TODO_STATUS } from '@/model/todo.entity';
  import { Injectable, Logger } from '@nestjs/common';
  import { Cron } from '@nestjs/schedule';
  import { InjectRepository } from '@nestjs/typeorm';
  import { LessThanOrEqual, Repository } from 'typeorm';

  @Injectable()
  export class NotificationService {
    constructor(
      @InjectRepository(TodoEntity)
      private todoRepository: Repository<TodoEntity>,
    ) {}
    private readonly logger = new Logger(NotificationService.name);

    @Cron('45 * * * * *')
    async handleCron() {
      this.logger.debug('Called when the current second is 45');
      return this.todoRepository
        .find({
          where: {
            status: TODO_STATUS.IN_PROGRESS,
            due_date: LessThanOrEqual(new Date()),
          },
          relations: ['assigned_members', 'assigned_members.member'],
        })
        .then((todos) => {
          console.log(todos);
        });
    }
  }
  ```
