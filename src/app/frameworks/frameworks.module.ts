import { Module } from "@nestjs/common";
import { FrameworksController } from "./frameworks.controller";
import { FrameworksService } from "./frameworks.service";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { FrameworkSchema } from "../frameworks-mongoose/models/framework.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: "Framework", schema: FrameworkSchema}])],
    controllers: [FrameworksController],
    providers: [FrameworksService]
})
export class FrameworksModule {}