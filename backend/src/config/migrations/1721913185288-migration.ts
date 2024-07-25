import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721913185288 implements MigrationInterface {
    name = 'Migration1721913185288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trip" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "price" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'new', "numberOfPassengers" integer NOT NULL, "startLocation" character varying NOT NULL, "stopLocations" character varying NOT NULL, "endLocation" character varying NOT NULL, "vehicleType" character varying NOT NULL, "vehicleModel" character varying NOT NULL, "licensePlateNumber" character varying NOT NULL, "estimatedDuration" integer NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "driverId" uuid, CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "description" character varying NOT NULL, "pictureUrl" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "phoneNumber" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" character varying NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "targetId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trip_passengers_user" ("tripId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_83737a95235e2a840546baad70b" PRIMARY KEY ("tripId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97e3edfcf90faac1f8c712515c" ON "trip_passengers_user" ("tripId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f4082a5ab024a293a724bd7a5a" ON "trip_passengers_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "trip" ADD CONSTRAINT "FK_2034f2f2e58179b42c4866f6f13" FOREIGN KEY ("driverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1e758e3895b930ccf269f30c415" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_3e5d4ee68a133a5df3ba76f800d" FOREIGN KEY ("targetId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_passengers_user" ADD CONSTRAINT "FK_97e3edfcf90faac1f8c712515c9" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "trip_passengers_user" ADD CONSTRAINT "FK_f4082a5ab024a293a724bd7a5a0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_passengers_user" DROP CONSTRAINT "FK_f4082a5ab024a293a724bd7a5a0"`);
        await queryRunner.query(`ALTER TABLE "trip_passengers_user" DROP CONSTRAINT "FK_97e3edfcf90faac1f8c712515c9"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_3e5d4ee68a133a5df3ba76f800d"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1e758e3895b930ccf269f30c415"`);
        await queryRunner.query(`ALTER TABLE "trip" DROP CONSTRAINT "FK_2034f2f2e58179b42c4866f6f13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4082a5ab024a293a724bd7a5a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97e3edfcf90faac1f8c712515c"`);
        await queryRunner.query(`DROP TABLE "trip_passengers_user"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "trip"`);
    }

}
