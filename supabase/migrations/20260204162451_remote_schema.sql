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

COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';
SET default_table_access_method = "heap";

-- Table: articles
CREATE TABLE IF NOT EXISTS "public"."articles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "production_id" "uuid",
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "cover_image" "text",
    "published_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."articles" OWNER TO "postgres";

-- Table: channels
CREATE TABLE IF NOT EXISTS "public"."channels" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "source_id" "text" NOT NULL,
    "name" "text",
    "is_active" boolean DEFAULT true,
    "last_scouted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" "text" DEFAULT 'youtube'::"text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "channels_type_check" CHECK (("type" = ANY (ARRAY['youtube'::"text", 'github'::"text", 'twitter'::"text", 'rss'::"text"])))
);

ALTER TABLE "public"."channels" OWNER TO "postgres";
COMMENT ON COLUMN "public"."channels"."source_id" IS '原始平台的唯一标识 (Channel ID, Repo Name)';

-- Table: productions
CREATE TABLE IF NOT EXISTS "public"."productions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "raw_material_id" "uuid",
    "status" "text" DEFAULT 'planning'::"text",
    "editor_brief" "text",
    "target_audience" "text",
    "ai_summary" "text",
    "generated_content" "text",
    "generated_title" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "productions_status_check" CHECK (("status" = ANY (ARRAY['planning'::"text", 'generating'::"text", 'reviewing'::"text", 'published'::"text", 'rejected'::"text"])))
);

ALTER TABLE "public"."productions" OWNER TO "postgres";

-- Table: raw_materials
CREATE TABLE IF NOT EXISTS "public"."raw_materials" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "external_id" "text",
    "title" "text",
    "url" "text",
    "source_id" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "content_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "meta_payload" "jsonb" DEFAULT '{}'::"jsonb",
    "summary_markdown" "text"
);

ALTER TABLE "public"."raw_materials" OWNER TO "postgres";

-- Constraints & Indices
ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."channels"
    ADD CONSTRAINT "channels_channel_id_key" UNIQUE ("source_id");

ALTER TABLE ONLY "public"."channels"
    ADD CONSTRAINT "channels_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."productions"
    ADD CONSTRAINT "productions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."raw_materials"
    ADD CONSTRAINT "videos_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."raw_materials"
    ADD CONSTRAINT "videos_video_id_key" UNIQUE ("external_id");

-- Foreign Keys
ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_production_id_fkey" FOREIGN KEY ("production_id") REFERENCES "public"."productions"("id");

ALTER TABLE ONLY "public"."productions"
    ADD CONSTRAINT "productions_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "public"."raw_materials"("id");

ALTER TABLE ONLY "public"."raw_materials"
    ADD CONSTRAINT "videos_channel_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."channels"("source_id");

-- Policies (RLS)
CREATE POLICY "Allow global read access" ON "public"."channels" FOR SELECT USING (true);
CREATE POLICY "Allow global read access" ON "public"."raw_materials" FOR SELECT USING (true);

ALTER TABLE "public"."channels" ENABLE ROW LEVEL SECURITY;

-- Publication
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

-- Grants (Permissions)
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."articles" TO "anon";
GRANT ALL ON TABLE "public"."articles" TO "authenticated";
GRANT ALL ON TABLE "public"."articles" TO "service_role";

GRANT ALL ON TABLE "public"."channels" TO "anon";
GRANT ALL ON TABLE "public"."channels" TO "authenticated";
GRANT ALL ON TABLE "public"."channels" TO "service_role";

GRANT ALL ON TABLE "public"."productions" TO "anon";
GRANT ALL ON TABLE "public"."productions" TO "authenticated";
GRANT ALL ON TABLE "public"."productions" TO "service_role";

GRANT ALL ON TABLE "public"."raw_materials" TO "anon";
GRANT ALL ON TABLE "public"."raw_materials" TO "authenticated";
GRANT ALL ON TABLE "public"."raw_materials" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";