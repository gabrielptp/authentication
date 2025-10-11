import { Controller, Post, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('generate')
    @HttpCode(HttpStatus.CREATED)
    async generateProducts() {
        const result = await this.productService.generateProducts();
        return {
            success: true,
            data: result,
        };
    }

    @Get('search')
    @HttpCode(HttpStatus.OK)
    async searchProducts(@Query() filters: ProductFilterDto) {
        const result = await this.productService.search(filters);
        return {
            success: true,
            data: {
                products: result.products,
                total: result.total,
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            },
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllProducts() {
        const products = await this.productService.findAll();
        return {
            success: true,
            data: {
                products,
                count: products.length,
            },
        };
    }
}
