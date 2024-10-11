import {
  IsString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';

// The class that will represent each object in the array
export class Item {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

// The main class that contains an array of objects
export class CreateOrderValidator {
  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => Item) // Tell class-transformer to transform the array items into the 'Item' class
  orderItems: Item[];
}
