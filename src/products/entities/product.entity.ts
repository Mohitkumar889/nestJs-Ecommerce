import { Category } from "src/categories/entities/category.entity";
import { Subcategory } from "src/subcategories/entities/subcategory.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./productImage.entity";
import { Cart } from "src/cart/entities/cart.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, type: 'double precision', default: 0.00 })
    price: number;

    @Column({ nullable: false, type: 'int' })
    unit: number

    @Column({ nullable: false, type: 'double precision', default: 0.00 })
    discount: number;

    @Column({ nullable: true, type: 'text', default: null })
    description: string;

    @Column({ nullable: true, type: 'text', default: null })
    feature: string;

    @Column({ nullable: true, default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToMany(() => Category, category => category.products, { cascade: true })
    @JoinTable({
        name: 'product_categories',
        joinColumn: { name: 'productId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
    })
    categories: Category[];

    @ManyToMany(() => Subcategory, subCategory => subCategory.products, { cascade: true })
    @JoinTable({
        name: 'product_subcategories',
        joinColumn: { name: 'productId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'subCategoryId', referencedColumnName: 'id' }
    })
    subCategories: Subcategory[];

    @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: true })
    images: ProductImage[];

    @OneToMany(() => Cart, cart => cart.product, { cascade: true, onDelete: 'CASCADE' })
    carts: Cart[];
}
