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
- [x] Authentication
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
- [x] Register Member.
- [x] Login With Username and Password.
- Return JWT Token.
- [x] Get Member Profile From JWT Token.
- [x] validate JWT Token In header **X-Member-Token**
- Reject **401** if header is not present
- Reject **403** if header is present but incorrect

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
