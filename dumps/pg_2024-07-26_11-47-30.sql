--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--





--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:IftWuq4VAzyttry9PBcsVA==$WKASpFzSop6DELg9f9z+tCSE4vGZpu2GceuIDj4vYWA=:PbriSpaZc+iIF+xuT6p7cHwfPeK4phCCDnIRf2S/RCQ=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rating integer NOT NULL,
    comment character varying NOT NULL,
    title character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "authorId" uuid,
    "targetId" uuid
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp without time zone NOT NULL,
    price integer NOT NULL,
    status character varying DEFAULT 'new'::character varying NOT NULL,
    "numberOfPassengers" integer NOT NULL,
    "startLocation" character varying NOT NULL,
    "stopLocations" character varying NOT NULL,
    "endLocation" character varying NOT NULL,
    "vehicleType" character varying NOT NULL,
    "vehicleModel" character varying NOT NULL,
    "licensePlateNumber" character varying NOT NULL,
    "estimatedDuration" integer NOT NULL,
    "startTime" character varying NOT NULL,
    "endTime" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "driverId" uuid
);


ALTER TABLE public.trip OWNER TO postgres;

--
-- Name: trip_passengers_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_passengers_user (
    "tripId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.trip_passengers_user OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    description character varying NOT NULL,
    "pictureUrl" character varying NOT NULL,
    birthdate timestamp without time zone NOT NULL,
    "phoneNumber" character varying NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1721913185288	Migration1721913185288
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (id, rating, comment, title, "createdAt", "updatedAt", "authorId", "targetId") FROM stdin;
\.


--
-- Data for Name: trip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip (id, date, price, status, "numberOfPassengers", "startLocation", "stopLocations", "endLocation", "vehicleType", "vehicleModel", "licensePlateNumber", "estimatedDuration", "startTime", "endTime", "createdAt", "updatedAt", "driverId") FROM stdin;
\.


--
-- Data for Name: trip_passengers_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_passengers_user ("tripId", "userId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, firstname, lastname, description, "pictureUrl", birthdate, "phoneNumber", "isAdmin", "createdAt", "updatedAt") FROM stdin;
2715a304-41e8-491e-8d80-8fb64375151a	brian@example.com	$argon2id$v=19$m=65536,t=3,p=4$fy6HiDE9Ue0LXjtsPoSkDw$mw963Nt6d1V38zB59qZZvhLNy+9SDCWmSm0i60HtKg8	Brian	Thellier	This is my description		1997-05-14 13:17:23		f	2024-07-25 13:17:23.2391	2024-07-25 13:18:06.792815
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- Name: review PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);


--
-- Name: trip PK_714c23d558208081dbccb9d9268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip
    ADD CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY (id);


--
-- Name: trip_passengers_user PK_83737a95235e2a840546baad70b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_passengers_user
    ADD CONSTRAINT "PK_83737a95235e2a840546baad70b" PRIMARY KEY ("tripId", "userId");


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_97e3edfcf90faac1f8c712515c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97e3edfcf90faac1f8c712515c" ON public.trip_passengers_user USING btree ("tripId");


--
-- Name: IDX_f4082a5ab024a293a724bd7a5a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f4082a5ab024a293a724bd7a5a" ON public.trip_passengers_user USING btree ("userId");


--
-- Name: review FK_1e758e3895b930ccf269f30c415; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_1e758e3895b930ccf269f30c415" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: trip FK_2034f2f2e58179b42c4866f6f13; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip
    ADD CONSTRAINT "FK_2034f2f2e58179b42c4866f6f13" FOREIGN KEY ("driverId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: review FK_3e5d4ee68a133a5df3ba76f800d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_3e5d4ee68a133a5df3ba76f800d" FOREIGN KEY ("targetId") REFERENCES public."user"(id);


--
-- Name: trip_passengers_user FK_97e3edfcf90faac1f8c712515c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_passengers_user
    ADD CONSTRAINT "FK_97e3edfcf90faac1f8c712515c9" FOREIGN KEY ("tripId") REFERENCES public.trip(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trip_passengers_user FK_f4082a5ab024a293a724bd7a5a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_passengers_user
    ADD CONSTRAINT "FK_f4082a5ab024a293a724bd7a5a0" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

