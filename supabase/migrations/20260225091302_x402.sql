drop view if exists "public"."order_details_view";

drop view if exists "public"."pending_crypto_payments";

alter table "public"."orders" alter column "payment_provider" drop default;

alter type "public"."payment_provider" rename to "payment_provider__old_version_to_be_dropped";

create type "public"."payment_provider" as enum ('stripe', 'paypal', 'crypto', 'manual', 'x402');


  create table "public"."x402_payments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "payer_address" text not null,
    "resource_url" text not null,
    "resource_method" text not null default 'GET'::text,
    "product_name" text,
    "product_slug" text,
    "scheme" text not null default 'exact'::text,
    "network" text not null,
    "token" text,
    "token_address" text,
    "amount" text not null,
    "amount_usd" numeric(12,2),
    "transaction_hash" text,
    "settlement_status" text not null default 'pending'::text,
    "payment_payload" jsonb,
    "settlement_response" jsonb,
    "facilitator_url" text,
    "metadata" jsonb
      );


alter table "public"."x402_payments" enable row level security;

alter table "public"."order_payment_details" alter column provider type "public"."payment_provider" using provider::text::"public"."payment_provider";

alter table "public"."orders" alter column payment_provider type "public"."payment_provider" using payment_provider::text::"public"."payment_provider";

alter table "public"."orders" alter column "payment_provider" set default 'stripe'::public.payment_provider;

drop type "public"."payment_provider__old_version_to_be_dropped";

CREATE INDEX idx_x402_payments_created_at ON public.x402_payments USING btree (created_at DESC);

CREATE INDEX idx_x402_payments_network ON public.x402_payments USING btree (network);

CREATE INDEX idx_x402_payments_payer_address ON public.x402_payments USING btree (payer_address);

CREATE INDEX idx_x402_payments_resource_url ON public.x402_payments USING btree (resource_url);

CREATE INDEX idx_x402_payments_settlement_status ON public.x402_payments USING btree (settlement_status);

CREATE INDEX idx_x402_payments_user_id ON public.x402_payments USING btree (user_id);

CREATE UNIQUE INDEX x402_payments_pkey ON public.x402_payments USING btree (id);

alter table "public"."x402_payments" add constraint "x402_payments_pkey" PRIMARY KEY using index "x402_payments_pkey";

alter table "public"."x402_payments" add constraint "x402_payments_settlement_status_check" CHECK ((settlement_status = ANY (ARRAY['pending'::text, 'verified'::text, 'settled'::text, 'failed'::text]))) not valid;

alter table "public"."x402_payments" validate constraint "x402_payments_settlement_status_check";

alter table "public"."x402_payments" add constraint "x402_payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."x402_payments" validate constraint "x402_payments_user_id_fkey";

set check_function_bodies = off;

create or replace view "public"."x402_payment_summary" as  SELECT p.id,
    p.created_at,
    p.payer_address,
    p.resource_url,
    p.resource_method,
    p.product_name,
    p.product_slug,
    p.scheme,
    p.network,
    p.token,
    p.amount,
    p.amount_usd,
    p.transaction_hash,
    p.settlement_status,
    p.facilitator_url,
    pr.email AS payer_email,
    (pr.raw_user_meta_data ->> 'full_name'::text) AS payer_name
   FROM (public.x402_payments p
     LEFT JOIN auth.users pr ON ((pr.id = p.user_id)))
  ORDER BY p.created_at DESC;


CREATE OR REPLACE FUNCTION public.handle_expired_payments()
 RETURNS TABLE(expired_order_count integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_count INT;
BEGIN
  UPDATE orders
  SET status = 'payment_expired'
  WHERE payment_provider = 'crypto'
    AND status = 'pending_payment'
    AND payment_expires_at < CURRENT_TIMESTAMP;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN QUERY SELECT v_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select role = 'admin' from public.profiles where id = uid;
$function$
;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select role in ('staff','admin') from public.profiles where id = uid;
$function$
;

create or replace view "public"."order_details_view" as  SELECT o.id,
    o.created_at,
    o.updated_at,
    o.user_id,
    o.customer_email,
    o.customer_phone,
    o.order_number,
    o.product_name,
    o.tier_name,
    o.amount_total,
    o.currency,
    o.status,
    o.payment_provider,
    o.payment_method_details,
    o.shipping_method,
    o.actual_delivery_date,
    o.product_slug,
    o.coinbase_charge_id,
    o.crypto_address,
    o.crypto_type,
    o.crypto_amount,
    o.payment_expires_at,
    o.payment_confirmed_at,
    o.payment_metadata,
    p.provider AS payment_provider_detail,
    COALESCE(p.transaction_id, o.payment_transaction_id) AS payment_transaction_id,
    p.status AS payment_status,
    p.amount_paid,
    p.currency AS payment_currency,
    p.payment_method,
    p.paid_at,
    s.carrier AS shipping_carrier,
    COALESCE(s.tracking_number, o.tracking_number) AS tracking_number,
    COALESCE(s.shipping_address, o.shipping_address) AS shipping_address,
    s.shipped_at,
    s.delivered_at,
    COALESCE(s.estimated_delivery_date, o.expected_delivery_date) AS expected_delivery_date,
    s.notes AS shipping_notes
   FROM ((public.orders o
     LEFT JOIN public.order_payment_details p ON ((p.order_id = o.id)))
     LEFT JOIN public.order_shipping s ON ((s.order_id = o.id)));


create or replace view "public"."pending_crypto_payments" as  SELECT id AS order_id,
    user_id,
    coinbase_charge_id,
    crypto_type,
    crypto_amount,
    payment_expires_at,
    created_at,
    (payment_expires_at - CURRENT_TIMESTAMP) AS time_remaining,
        CASE
            WHEN (payment_expires_at < CURRENT_TIMESTAMP) THEN 'expired'::text
            WHEN (payment_expires_at < (CURRENT_TIMESTAMP + '00:05:00'::interval)) THEN 'expiring_soon'::text
            ELSE 'pending'::text
        END AS urgency
   FROM public.orders o
  WHERE ((payment_provider = 'crypto'::public.payment_provider) AND (payment_confirmed_at IS NULL) AND (coinbase_charge_id IS NOT NULL) AND (payment_expires_at > CURRENT_TIMESTAMP))
  ORDER BY payment_expires_at;


grant delete on table "public"."order_payment_details" to "postgres";

grant insert on table "public"."order_payment_details" to "postgres";

grant references on table "public"."order_payment_details" to "postgres";

grant select on table "public"."order_payment_details" to "postgres";

grant trigger on table "public"."order_payment_details" to "postgres";

grant truncate on table "public"."order_payment_details" to "postgres";

grant update on table "public"."order_payment_details" to "postgres";

grant delete on table "public"."order_shipping" to "postgres";

grant insert on table "public"."order_shipping" to "postgres";

grant references on table "public"."order_shipping" to "postgres";

grant select on table "public"."order_shipping" to "postgres";

grant trigger on table "public"."order_shipping" to "postgres";

grant truncate on table "public"."order_shipping" to "postgres";

grant update on table "public"."order_shipping" to "postgres";

grant delete on table "public"."orders" to "postgres";

grant insert on table "public"."orders" to "postgres";

grant references on table "public"."orders" to "postgres";

grant select on table "public"."orders" to "postgres";

grant trigger on table "public"."orders" to "postgres";

grant truncate on table "public"."orders" to "postgres";

grant update on table "public"."orders" to "postgres";

grant delete on table "public"."payment_history" to "postgres";

grant insert on table "public"."payment_history" to "postgres";

grant references on table "public"."payment_history" to "postgres";

grant select on table "public"."payment_history" to "postgres";

grant trigger on table "public"."payment_history" to "postgres";

grant truncate on table "public"."payment_history" to "postgres";

grant update on table "public"."payment_history" to "postgres";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."subscriptions" to "postgres";

grant insert on table "public"."subscriptions" to "postgres";

grant references on table "public"."subscriptions" to "postgres";

grant select on table "public"."subscriptions" to "postgres";

grant trigger on table "public"."subscriptions" to "postgres";

grant truncate on table "public"."subscriptions" to "postgres";

grant update on table "public"."subscriptions" to "postgres";

grant delete on table "public"."x402_payments" to "anon";

grant insert on table "public"."x402_payments" to "anon";

grant references on table "public"."x402_payments" to "anon";

grant select on table "public"."x402_payments" to "anon";

grant trigger on table "public"."x402_payments" to "anon";

grant truncate on table "public"."x402_payments" to "anon";

grant update on table "public"."x402_payments" to "anon";

grant delete on table "public"."x402_payments" to "authenticated";

grant insert on table "public"."x402_payments" to "authenticated";

grant references on table "public"."x402_payments" to "authenticated";

grant select on table "public"."x402_payments" to "authenticated";

grant trigger on table "public"."x402_payments" to "authenticated";

grant truncate on table "public"."x402_payments" to "authenticated";

grant update on table "public"."x402_payments" to "authenticated";

grant delete on table "public"."x402_payments" to "postgres";

grant insert on table "public"."x402_payments" to "postgres";

grant references on table "public"."x402_payments" to "postgres";

grant select on table "public"."x402_payments" to "postgres";

grant trigger on table "public"."x402_payments" to "postgres";

grant truncate on table "public"."x402_payments" to "postgres";

grant update on table "public"."x402_payments" to "postgres";

grant delete on table "public"."x402_payments" to "service_role";

grant insert on table "public"."x402_payments" to "service_role";

grant references on table "public"."x402_payments" to "service_role";

grant select on table "public"."x402_payments" to "service_role";

grant trigger on table "public"."x402_payments" to "service_role";

grant truncate on table "public"."x402_payments" to "service_role";

grant update on table "public"."x402_payments" to "service_role";


  create policy "x402_payments: anon view by address"
  on "public"."x402_payments"
  as permissive
  for select
  to anon
using (true);



  create policy "x402_payments: service_role all"
  on "public"."x402_payments"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "x402_payments: staff_admin view all"
  on "public"."x402_payments"
  as permissive
  for select
  to authenticated
using (public.is_staff_or_admin(auth.uid()));



  create policy "x402_payments: user view own"
  on "public"."x402_payments"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



