import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import Environment from 'src/common/enums/environment.enum';

@Injectable()
export class SwaggerService {
  create(app: INestApplication) {
    if (process.env.APP_ENV === Environment.PRODUCTION) {
      return;
    }

    const description = `Definitions for data transfer objects and models used in
    controllers are found in the _Schemas_ section.
    \nAll protected endpoints are indicated by a padlock at the far right of their
    header and therefore require secret key present in the authorization header.
    \nRole requirements for each endpoints is indicated as a summary for quick`;
    const config = new DocumentBuilder()
      .setTitle('History Data Load REST API')
      .setDescription(description)
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your API key',
        },
        'api-key',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        displayRequestDuration: true,
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    };

    SwaggerModule.setup('api-docs', app, document, customOptions);
  }
}
