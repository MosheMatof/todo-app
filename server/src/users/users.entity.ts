import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    email: string;

    // @Column()
    // isActive: boolean;

    // @Column()
    // email: string;
}