import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { PrefixNamingStrategy } from './common/strategies/entity-naming.strategy';
import { PlayersModule } from './players/players.module';
import { ResultsModule } from './results/results.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new PrefixNamingStrategy(
          configService.get('DB_PREFIX'),
        ),
        // logging: true, // Uncomment to see the SQL queries
      }),
    }),
    AuthModule,
    PlayersModule,
    ResultsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
