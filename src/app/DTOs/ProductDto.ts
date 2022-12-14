import { ManufacturerDto } from './ManufacturerDto';
import { OptionDto } from './OptionDto';
import { OptionValueDto } from './OptionValueDto';
import { ProductDetailDto } from './ProductDetailDto';
import { ProductLineDto } from './ProductLineDto';
import { ProductSpecificationGroupDto } from './ProductSpecificationGroupDto';
import { ProductVariantOptionDto } from './ProductVariantOptionDto';
import { SpecificationGroupDto } from './SpecificationGroupDto';

export interface ProductDto {
  id: number | string;
  productName: string;
  description: string;
  image?: string;
  detail: string;
  images: string[];
  manufacturerDto?: ManufacturerDto;
  productLineDto?: ProductLineDto;
  productDetailDtos: ProductDetailDto[];
  optionDtos?: OptionDto[];
  specificationGroupDtos?: SpecificationGroupDto[];
  note?: string;
  expand?: boolean;
  ctime?: string;
  mtime?: string;
  status?: number;
  minPrice?: number;
  maxPrice?: number;
}
