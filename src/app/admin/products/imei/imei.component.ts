import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { productsStore } from '../products.repository';
import { ImeiService } from './imei.service';
import { updateEntities } from '@ngneat/elf-entities';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-imei',
  templateUrl: './imei.component.html',
  styleUrls: ['./imei.component.scss'],
})
export class ImeiComponent implements OnInit, OnDestroy {
  @Input('productDetailId') productDetail!: ProductDetailDto;
  @Input('productId') productId!: number | string;
  @Input('i_product_detail') i_product_detail: number = -1;
  newImei = '';
  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    },
  ];
  imeis: ImeiDto[] = [];
  isLoading = false;
  constructor(private imeiService: ImeiService) {}

  ngOnInit(): void {
    this.currentImei = { ...this.fakeImei } as ImeiDto;
    this.isLoading = true;
    this.imeiService
      .getImeisByProductDetailId(this.productDetail.id!)
      .subscribe((imeis) => {
        this.productDetail.imeis = imeis;
      });
    this.isLoading = false;
  }
  edit(imei: ImeiDto) {
    this.currentImei = { ...imei };
  }
  addImei() {
    this.imeiService
      .save({ ...this.currentImei, productDetailDto: this.productDetail })
      .subscribe((imei: any) => {
        if (imei) {
          if (!this.currentImei.id) {
            this.productDetail.imeis?.unshift(imei);
            this.productDetail.stock = this.productDetail.stock + 1;
          } else {
            let i = this.productDetail.imeis?.findIndex(
              (imei) => imei.id == this.currentImei.id
            ) as number;
            if (i >= 0) {
              this.productDetail.imeis![i] = imei;
            }
          }
          console.log(this.productDetail);

          productsStore.update(
            updateEntities(this.productId, (product) => {
              let productDetailDtos = product.productDetailDtos;
              productDetailDtos[this.i_product_detail] = this.productDetail;
              return {
                ...product,
                expand: true,
                productDetailDtos,
              };
            })
          );
          this.currentImei = { ...this.fakeImei } as ImeiDto;
        }
      });
  }

  deleteImei(idImei: number, i_imei: number) {
    this.imeiService.deleteImei(idImei).subscribe((res) => {
      if (res) {
        this.productDetail.imeis?.splice(i_imei, 1);
        productsStore.update(
          updateEntities(this.productId, (product) => {
            let productDetailDtos = product.productDetailDtos;
            productDetailDtos[this.i_product_detail] = this.productDetail;
            this.productDetail.stock = this.productDetail.stock - 1;
            return {
              ...product,
              expand: true,
              productDetailDtos,
            };
          })
        );
      }
    });
  }
  ngOnDestroy(): void {
    console.log('on destroy imei');
  }
  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.fileList = fileList;
  }
  currentImei!: ImeiDto;
  fakeImei = {
    id: 0,
    imei: '',
    status: 1,
    productDetailDto: {} as ProductDetailDto,
  };
}
