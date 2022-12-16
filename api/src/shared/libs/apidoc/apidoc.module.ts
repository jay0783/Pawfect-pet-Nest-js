import { DynamicModule } from "@nestjs/common";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";


export class AppApidocModule {
  static forRootAsync(): DynamicModule {
    return ServeStaticModule.forRootAsync({
      useFactory: (args) => ([
        {
          rootPath: join(process.cwd(), "apidoc", "auth"),
          serveRoot: "/apidoc/auth"
        },
        {
          rootPath: join(process.cwd(), "apidoc", "admin"),
          serveRoot: "/apidoc/admin"
        },
        {
          rootPath: join(process.cwd(), "apidoc", "employee"),
          serveRoot: "/apidoc/employee"
        },
        {
          rootPath: join(process.cwd(), "apidoc", "customer"),
          serveRoot: "/apidoc/customer"
        }
      ])
    });
  }
}
