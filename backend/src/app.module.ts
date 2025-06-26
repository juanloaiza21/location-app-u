import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { GeofencesModule } from './geofences/geofences.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [AuthModule, LocationsModule, GeofencesModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
