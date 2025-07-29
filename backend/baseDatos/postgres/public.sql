/*
 Navicat Premium Data Transfer

 Source Server         : local postgres15
 Source Server Type    : PostgreSQL
 Source Server Version : 150006 (150006)
 Source Host           : localhost:5432
 Source Catalog        : basedatos
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150006 (150006)
 File Encoding         : 65001

 Date: 27/03/2025 09:42:36
*/


-- ----------------------------
-- Sequence structure for cat_menus_id_menu_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_menus_id_menu_seq";
CREATE SEQUENCE "public"."cat_menus_id_menu_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cat_roles_id_rol_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_roles_id_rol_seq";
CREATE SEQUENCE "public"."cat_roles_id_rol_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cat_usuarios_id_usuario_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_usuarios_id_usuario_seq";
CREATE SEQUENCE "public"."cat_usuarios_id_usuario_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for menus_roles_id_menu_rol_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."menus_roles_id_menu_rol_seq";
CREATE SEQUENCE "public"."menus_roles_id_menu_rol_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for cat_menus
-- ----------------------------
DROP TABLE IF EXISTS "public"."cat_menus";
CREATE TABLE "public"."cat_menus" (
  "id_menu" int8 NOT NULL DEFAULT nextval('cat_menus_id_menu_seq'::regclass),
  "nombre" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "spring_security" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "status" bool NOT NULL DEFAULT true
)
;

-- ----------------------------
-- Records of cat_menus
-- ----------------------------
INSERT INTO "public"."cat_menus" VALUES (2, 'Busqueda Roles', 'ROLE_BUSQUEDA_ROLES', 't');
INSERT INTO "public"."cat_menus" VALUES (3, 'Alta Roles', 'ROLE_ALTA_ROLES', 't');
INSERT INTO "public"."cat_menus" VALUES (4, 'Modificacion Roles', 'ROLE_EDICION_ROLES', 't');

-- ----------------------------
-- Table structure for cat_roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."cat_roles";
CREATE TABLE "public"."cat_roles" (
  "id_rol" int8 NOT NULL DEFAULT nextval('cat_roles_id_rol_seq'::regclass),
  "nombre" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "descripcion" varchar(255) COLLATE "pg_catalog"."default",
  "status" bool NOT NULL DEFAULT true
)
;

-- ----------------------------
-- Records of cat_roles
-- ----------------------------
INSERT INTO "public"."cat_roles" VALUES (1, 'ADMINISTRADOR', 'DEMO', 't');
INSERT INTO "public"."cat_roles" VALUES (2, 'operador', '', 't');

-- ----------------------------
-- Table structure for cat_usuarios
-- ----------------------------
DROP TABLE IF EXISTS "public"."cat_usuarios";
CREATE TABLE "public"."cat_usuarios" (
  "id_usuario" int8 NOT NULL DEFAULT nextval('cat_usuarios_id_usuario_seq'::regclass),
  "id_rol" int8 NOT NULL,
  "nombres" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "apellido_paterno" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "apellido_materno" varchar(255) COLLATE "pg_catalog"."default",
  "username" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "status" bool NOT NULL DEFAULT true,
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "telefono" varchar(255) COLLATE "pg_catalog"."default",
  "primer_inicio" bool NOT NULL
)
;

-- ----------------------------
-- Records of cat_usuarios
-- ----------------------------
INSERT INTO "public"."cat_usuarios" VALUES (2, 1, 'cesar', 'montiel', 'becerril', 'cesar.montiel', 'e06cd275a84459e303bd8174b9064578e0cf23153b4ebfcbcc33016ec0d92f976184ca545c6d1f27a84b0c6da0761804b88b750cabfebbda3b4d780b26e66264', 't', 'julio.montiel@hotmail.com', '5566770590', 't');
INSERT INTO "public"."cat_usuarios" VALUES (3, 2, 'demo', 'demo', 'demo', 'demo.demo', 'e239f67756bba3af660e4226c340183a9ca4bdc40038c0cfdea2fbaa59605be32548df2535e5a9f9ceedb12d9666c6fb153ada99830ed5cd84eb0c2c4d00260a', 't', 'demo@hotmail.com', '5587801084', 'f');
INSERT INTO "public"."cat_usuarios" VALUES (1, 1, 'julio cesar', 'becerril', 'montiel', 'jbecerril', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 't', 'julio.montiel@hotmail.com', '5587801084', 't');

-- ----------------------------
-- Table structure for menus_roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."menus_roles";
CREATE TABLE "public"."menus_roles" (
  "id_menu_rol" int8 NOT NULL DEFAULT nextval('menus_roles_id_menu_rol_seq'::regclass),
  "id_menu" int8 NOT NULL,
  "id_rol" int8 NOT NULL
)
;

-- ----------------------------
-- Records of menus_roles
-- ----------------------------
INSERT INTO "public"."menus_roles" VALUES (1, 3, 1);
INSERT INTO "public"."menus_roles" VALUES (2, 2, 1);
INSERT INTO "public"."menus_roles" VALUES (3, 4, 1);
INSERT INTO "public"."menus_roles" VALUES (4, 2, 2);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_menus_id_menu_seq"
OWNED BY "public"."cat_menus"."id_menu";
SELECT setval('"public"."cat_menus_id_menu_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_roles_id_rol_seq"
OWNED BY "public"."cat_roles"."id_rol";
SELECT setval('"public"."cat_roles_id_rol_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_usuarios_id_usuario_seq"
OWNED BY "public"."cat_usuarios"."id_usuario";
SELECT setval('"public"."cat_usuarios_id_usuario_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."menus_roles_id_menu_rol_seq"
OWNED BY "public"."menus_roles"."id_menu_rol";
SELECT setval('"public"."menus_roles_id_menu_rol_seq"', 4, true);

-- ----------------------------
-- Primary Key structure for table cat_menus
-- ----------------------------
ALTER TABLE "public"."cat_menus" ADD CONSTRAINT "cat_menus_pkey" PRIMARY KEY ("id_menu");

-- ----------------------------
-- Primary Key structure for table cat_roles
-- ----------------------------
ALTER TABLE "public"."cat_roles" ADD CONSTRAINT "cat_roles_pkey" PRIMARY KEY ("id_rol");

-- ----------------------------
-- Primary Key structure for table cat_usuarios
-- ----------------------------
ALTER TABLE "public"."cat_usuarios" ADD CONSTRAINT "cat_usuarios_pkey" PRIMARY KEY ("id_usuario");

-- ----------------------------
-- Primary Key structure for table menus_roles
-- ----------------------------
ALTER TABLE "public"."menus_roles" ADD CONSTRAINT "menus_roles_pkey" PRIMARY KEY ("id_menu_rol");

-- ----------------------------
-- Foreign Keys structure for table cat_usuarios
-- ----------------------------
ALTER TABLE "public"."cat_usuarios" ADD CONSTRAINT "rol" FOREIGN KEY ("id_rol") REFERENCES "public"."cat_roles" ("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table menus_roles
-- ----------------------------
ALTER TABLE "public"."menus_roles" ADD CONSTRAINT "menu" FOREIGN KEY ("id_menu") REFERENCES "public"."cat_menus" ("id_menu") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."menus_roles" ADD CONSTRAINT "rol" FOREIGN KEY ("id_rol") REFERENCES "public"."cat_roles" ("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;
