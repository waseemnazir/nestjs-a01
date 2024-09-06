import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

import { EntityHelper } from "../../utils/entity-helper";

@Entity({ name: "users" })
export class User extends EntityHelper {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "password" })
  password: string;

  @Column({ name: "createdAt", type: "bigint" })
  createdAt: number;

  @Column({ name: "updatedAt", type: "bigint" })
  updatedAt: number;
}
