import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DataSource } from 'typeorm';

export function IsCustomEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCustomEmail',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Custom email validation logic
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return typeof value === 'string' && emailRegex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid email address`;
                },
            },
        });
    };
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource
    ) {
        // console.log(dataSource, "jsdkjdsjkdsjksdjk")
    }

    async validate(id: any, args: ValidationArguments) {
        console.log(args, args.constraints, "sdjs hjdhjdh hhjds");
        const [entityClass] = args.constraints;
        const entity = await this.dataSource.getRepository(entityClass).findOneBy({ id });
        return !!entity;
    }

    defaultMessage(args: ValidationArguments) {
        return 'ID $value does not exist!';
    }
}

export function IsIdExists(entityClass: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIdExists',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [entityClass],
            options: validationOptions,
            validator: IsIdExistsConstraint,
        });
    };
}
