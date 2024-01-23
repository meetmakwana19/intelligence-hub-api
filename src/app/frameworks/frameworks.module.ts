import { Module } from "@nestjs/common";
import { FrameworksController } from "./frameworks.controller";
import { FrameworksService } from "./frameworks.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FrameworkSchema } from "./frameworks.model";

@Module({
    imports: [
        // The MongooseModule provides the forFeature() method to configure the module, including defining which models should be registered in the current scope.
        MongooseModule.forFeature([{ name: "framework", schema: FrameworkSchema}])
    ],
    controllers: [FrameworksController],
    providers: [FrameworksService]
})
export class FrameworksModule {}