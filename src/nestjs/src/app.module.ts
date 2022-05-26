import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CategoriesModule],
})
export class AppModule {}
