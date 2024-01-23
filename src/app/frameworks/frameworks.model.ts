import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export interface Framework {
    title: string;
    description: string;
  }
  
// Schemas can be created with NestJS decorators, or with Mongoose itself manually. Using decorators to create schemas greatly reduces boilerplate and improves overall code readability.
// The @Schema() decorator marks a class as a schema definition.
// it is like mongoose.Schema()
@Schema()
export class FrameworkModel extends Document implements Framework {

    // @Prop() decorator defines a property in the document.
    @Prop({ unique: true, required: true })
    uid: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

}

export const FrameworkSchema = SchemaFactory.createForClass(FrameworkModel);