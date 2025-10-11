import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Product } from './product.entity';
import { ProductFilterDto } from '../dto/product-filter.dto';

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

    async search(filters: ProductFilterDto): Promise<{ products: Product[]; total: number }> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        // Text-based filters (partial match)
        if (filters.name) {
            queryBuilder.andWhere('product.name ILIKE :name', { 
                name: `%${filters.name}%` 
            });
        }

        if (filters.category) {
            queryBuilder.andWhere('product.category ILIKE :category', { 
                category: `%${filters.category}%` 
            });
        }

        if (filters.brand) {
            queryBuilder.andWhere('product.brand ILIKE :brand', { 
                brand: `%${filters.brand}%` 
            });
        }

        if (filters.sku) {
            queryBuilder.andWhere('product.sku ILIKE :sku', { 
                sku: `%${filters.sku}%` 
            });
        }

        // Price range filter
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
            });
        } else if (filters.minPrice !== undefined) {
            queryBuilder.andWhere('product.price >= :minPrice', { 
                minPrice: filters.minPrice 
            });
        } else if (filters.maxPrice !== undefined) {
            queryBuilder.andWhere('product.price <= :maxPrice', { 
                maxPrice: filters.maxPrice 
            });
        }

        // Stock quantity range filter
        if (filters.minStock !== undefined && filters.maxStock !== undefined) {
            queryBuilder.andWhere('product.stockQuantity BETWEEN :minStock AND :maxStock', {
                minStock: filters.minStock,
                maxStock: filters.maxStock,
            });
        } else if (filters.minStock !== undefined) {
            queryBuilder.andWhere('product.stockQuantity >= :minStock', { 
                minStock: filters.minStock 
            });
        } else if (filters.maxStock !== undefined) {
            queryBuilder.andWhere('product.stockQuantity <= :maxStock', { 
                maxStock: filters.maxStock 
            });
        }

        // Pagination
        const limit = filters.limit || 20;
        const offset = filters.offset || 0;

        queryBuilder.take(limit).skip(offset);

        // Order by created date (newest first)
        queryBuilder.orderBy('product.createdAt', 'DESC');

        const [products, total] = await queryBuilder.getManyAndCount();

        return { products, total };
    }
}
