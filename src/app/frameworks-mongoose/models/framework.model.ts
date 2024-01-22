import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export interface Framework {
    _id?: string;
    title: string;
    description: string;
  }
  
@Schema()
export class FrameworkModel extends Document implements Framework {
    @Prop({ unique: true})
    _id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    constructor(_id: string, title: string, description: string){
        super();

        this._id = _id;
        this.title = title;
        this.description = description;
    }
}

export const FrameworkSchema = SchemaFactory.createForClass(FrameworkModel);