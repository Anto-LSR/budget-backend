import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Income {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column('float')
    amount: number;

    @Column()
    isFixed: boolean;
}