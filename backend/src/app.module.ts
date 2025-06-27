import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { GeofencesModule } from './geofences/geofences.module';
import { TelegramModule } from './telegram/telegram.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, LocationsModule, GeofencesModule, TelegramModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
