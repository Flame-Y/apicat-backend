import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiDocument = Api & Document;

@Schema()
export class Api {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    pid: string;

    @Prop()
    description: string;

    @Prop()
    url: string;

    @Prop()
    method: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;

    @Prop()
    createdBy: number;

    @Prop()
    updatedBy: number;

    @Prop()
    args: string[];

    @Prop()
    responses: string[];

    @Prop()
    isFile: boolean;

    @Prop()
    orderNum: number;

    @Prop()
    parentId: string;
}

export const ApiSchema = SchemaFactory.createForClass(Api);
