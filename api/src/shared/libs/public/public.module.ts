import { DynamicModule } from "@nestjs/common";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";


export class AppPublicModule {
  static forRootAsync(): DynamicModule {
    return ServeStaticModule.forRootAsync({
      useFactory: (args) => ([{
        rootPath: join(process.cwd(), "public"),
        serveRoot: "/public",
        serveStaticOptions: {
          fallthrough: false
        }
      }])
    });
  }
}
