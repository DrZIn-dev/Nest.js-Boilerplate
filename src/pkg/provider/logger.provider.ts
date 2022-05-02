import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-http-print',
          options: {
            destination: 1,
            all: true,
            colorize: true,
            translateTime: true,
            prettyOptions: {
              ignore: 'hostname,pid,context,req,res',
              messageFormat: '({context})  \x1B[37m{msg}',
            },
          },
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggerProvider {}
