import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: "" })
    url: string;

    @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
    product: Product;
}
