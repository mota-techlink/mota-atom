
  create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "stripe_session_id" text not null,
    "user_id" uuid,
    "customer_email" text not null,
    "amount" integer,
    "status" text,
    "tier_name" text,
    "product_name" text
      );


alter table "public"."payments" enable row level security;

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX payments_stripe_session_id_key ON public.payments USING btree (stripe_session_id);

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."payments" add constraint "payments_stripe_session_id_key" UNIQUE using index "payments_stripe_session_id_key";

alter table "public"."payments" add constraint "payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."payments" validate constraint "payments_user_id_fkey";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "postgres";

grant insert on table "public"."payments" to "postgres";

grant references on table "public"."payments" to "postgres";

grant select on table "public"."payments" to "postgres";

grant trigger on table "public"."payments" to "postgres";

grant truncate on table "public"."payments" to "postgres";

grant update on table "public"."payments" to "postgres";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";


  create policy "Users can view own payments"
  on "public"."payments"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



