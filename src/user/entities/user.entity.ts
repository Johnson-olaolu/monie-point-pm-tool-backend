import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { Profile } from './profile.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { isBcryptHash } from 'src/utils/misc';
import { Profile } from './profile.entity';

@Entity()
@Index(['email', 'emailVerificationToken'])
@Index(['email', 'passwordResetToken'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  emailVerificationToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  emailVerificationTokenTTL: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  passwordResetToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  passwordResetTokenTTL: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Relation<Profile>;

  // @ManyToOne(() => Role)
  // @JoinColumn({ name: 'roleName', referencedColumnName: 'name' })
  // role: Role;

  // @Column()
  // @Index()
  // roleName: string;

  @Column({ default: false })
  acceptedInvite: boolean;

  // @Column({ default: RegistrationTypeEnum.EMAIL })
  // registrationType: RegistrationTypeEnum;

  // @ManyToOne(() => Company, (company) => company.users)
  // @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  // company: Relation<Company>;

  // @Column({ nullable: true })
  // @Index()
  // companyId: string;

  // @OneToOne(() => File)
  // @JoinColumn({ name: 'profilePictureUrl', referencedColumnName: 'url' })
  // profilePicture: Relation<File>;

  // @Column({ nullable: true })
  // profilePictureUrl: string;

  // @Column({
  //   nullable: true,
  // })
  // bio: string;

  // @Column({ nullable: true })
  // contactEmail: string;

  // @Column({ nullable: true })
  // contactPhoneNo: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      if (!isBcryptHash(this.password)) {
        this.password = await bcrypt.hash(this.password, 3); // You can adjust the salt rounds as needed
      }
    }
  }

  async comparePasswords(password: string): Promise<boolean> {
    const result = await bcrypt.compareSync(password, this.password);
    return result;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
