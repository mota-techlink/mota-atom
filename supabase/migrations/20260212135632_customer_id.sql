create type "public"."order_status" as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

create type "public"."payment_provider" as enum ('stripe', 'paypal', 'crypto', 'manual');

drop policy "Users can view own payments" on "public"."payments";

revoke delete on table "public"."payments" from "anon";

revoke insert on table "public"."payments" from "anon";

revoke references on table "public"."payments" from "anon";

revoke select on table "public"."payments" from "anon";

revoke trigger on table "public"."payments" from "anon";

revoke truncate on table "public"."payments" from "anon";

revoke update on table "public"."payments" from "anon";

revoke delete on table "public"."payments" from "authenticated";

revoke insert on table "public"."payments" from "authenticated";

revoke references on table "public"."payments" from "authenticated";

revoke select on table "public"."payments" from "authenticated";

revoke trigger on table "public"."payments" from "authenticated";

revoke truncate on table "public"."payments" from "authenticated";

revoke update on table "public"."payments" from "authenticated";

revoke delete on table "public"."payments" from "service_role";

revoke insert on table "public"."payments" from "service_role";

revoke references on table "public"."payments" from "service_role";

revoke select on table "public"."payments" from "service_role";

revoke trigger on table "public"."payments" from "service_role";

revoke truncate on table "public"."payments" from "service_role";

revoke update on table "public"."payments" from "service_role";

alter table "public"."payments" drop constraint "payments_stripe_session_id_key";

alter table "public"."payments" drop constraint "payments_user_id_fkey";

alter table "public"."payments" drop constraint "payments_pkey";

drop index if exists "public"."payments_pkey";

drop index if exists "public"."payments_stripe_session_id_key";

drop table "public"."payments";


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "user_id" uuid,
    "customer_email" text not null,
    "customer_phone" text,
    "order_number" text not null,
    "product_name" text not null,
    "tier_name" text,
    "amount_total" numeric(10,2) not null,
    "currency" text default 'usd'::text,
    "status" public.order_status default 'pending'::public.order_status,
    "payment_provider" public.payment_provider default 'stripe'::public.payment_provider,
    "payment_transaction_id" text,
    "payment_method_details" jsonb,
    "shipping_address" jsonb,
    "shipping_method" text default 'standard'::text,
    "expected_delivery_date" timestamp with time zone,
    "actual_delivery_date" timestamp with time zone,
    "tracking_number" text,
    "product_slug" text
      );


alter table "public"."orders" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "full_name" text,
    "phone" text,
    "address_line1" text,
    "city" text,
    "state" text,
    "postal_code" text,
    "country" text default 'US'::text,
    "stripe_customer_id" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "stripe_subscription_id" text,
    "status" text,
    "price_id" text,
    "tier_name" text,
    "current_period_end" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."orders" add constraint "orders_order_number_key" UNIQUE using index "orders_order_number_key";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "postgres";

grant insert on table "public"."orders" to "postgres";

grant references on table "public"."orders" to "postgres";

grant select on table "public"."orders" to "postgres";

grant trigger on table "public"."orders" to "postgres";

grant truncate on table "public"."orders" to "postgres";

grant update on table "public"."orders" to "postgres";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "postgres";

grant insert on table "public"."subscriptions" to "postgres";

grant references on table "public"."subscriptions" to "postgres";

grant select on table "public"."subscriptions" to "postgres";

grant trigger on table "public"."subscriptions" to "postgres";

grant truncate on table "public"."subscriptions" to "postgres";

grant update on table "public"."subscriptions" to "postgres";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";


  create policy "Service role manages all orders"
  on "public"."orders"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Users can view own orders"
  on "public"."orders"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



