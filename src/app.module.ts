import { Module } from '@nestjs/common';
import { UserModule } from './Users/users.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
