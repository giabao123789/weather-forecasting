import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema';

export type SearchHistoryDocument = HydratedDocument<SearchHistory>;

@Schema({
  collection: 'search_histories',
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class SearchHistory {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  city: string;

  createdAt?: Date;
}

export const SearchHistorySchema = SchemaFactory.createForClass(SearchHistory);
