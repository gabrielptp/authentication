import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async generateProducts(): Promise<{ message: string; count: number }> {
        const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Food & Beverage'];
        const brands = ['TechPro', 'StyleMax', 'HomeEssentials', 'SportsFit', 'ReadWell', 'PlayFun', 'GourmetChoice'];
        const adjectives = ['Premium', 'Deluxe', 'Classic', 'Modern', 'Vintage', 'Professional', 'Advanced', 'Essential'];
        const productTypes = ['Widget', 'Device', 'Gadget', 'Tool', 'Kit', 'Set', 'Bundle', 'Collection'];

        const products: Product[] = [];

        for (let i = 1; i <= 100; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const productType = productTypes[Math.floor(Math.random() * productTypes.length)];

            const product = this.productRepository.create({
                name: `${adjective} ${productType} ${i}`,
                description: `High-quality ${adjective.toLowerCase()} ${productType.toLowerCase()} from ${brand}. Perfect for ${category.toLowerCase()} enthusiasts.`,
                category,
                brand,
                price: parseFloat((Math.random() * 999 + 1).toFixed(2)),
                stockQuantity: Math.floor(Math.random() * 500) + 1,
                sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${category.substring(0, 3).toUpperCase()}-${String(i).padStart(5, '0')}`,
            });

            products.push(product);
        }

        await this.productRepository.save(products);

        return {
            message: 'Products generated successfully',
            count: products.length,
        };
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    async count(): Promise<number> {
        return await this.productRepository.count();
    }
}
