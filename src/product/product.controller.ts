import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
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
