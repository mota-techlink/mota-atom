create type "public"."flight_status" as enum ('Scheduled', 'Delayed', 'Cancelled');

create sequence "public"."fleet_id_seq";

create sequence "public"."flights_id_seq";

drop view if exists "public"."order_details_view";

drop view if exists "public"."pending_crypto_payments";


  create table "public"."fleet" (
    "id" integer not null default nextval('public.fleet_id_seq'::regclass),
    "model" text not null,
    "payload_capacity_ton" real not null,
    "range_km" integer not null,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."fleet" enable row level security;


  create table "public"."flights" (
    "id" integer not null default nextval('public.flights_id_seq'::regclass),
    "flight_no" text not null,
    "origin_code" character(3) not null,
    "dest_code" character(3) not null,
    "std" timestamp with time zone not null,
    "sta" timestamp with time zone not null,
    "fleet_id" integer not null,
    "status" public.flight_status not null default 'Scheduled'::public.flight_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."flights" enable row level security;


  create table "public"."shipment_flights" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "flight_id" integer not null,
    "leg_sequence" integer not null default 1,
    "weight_kg" real not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."shipment_flights" enable row level security;

alter sequence "public"."fleet_id_seq" owned by "public"."fleet"."id";

alter sequence "public"."flights_id_seq" owned by "public"."flights"."id";

CREATE UNIQUE INDEX fleet_pkey ON public.fleet USING btree (id);

CREATE INDEX flights_origin_dest_idx ON public.flights USING btree (origin_code, dest_code);

CREATE UNIQUE INDEX flights_pkey ON public.flights USING btree (id);

CREATE INDEX flights_std_idx ON public.flights USING btree (std);

CREATE INDEX shipment_flights_flight_idx ON public.shipment_flights USING btree (flight_id);

CREATE INDEX shipment_flights_order_idx ON public.shipment_flights USING btree (order_id);

CREATE UNIQUE INDEX shipment_flights_order_leg_uniq ON public.shipment_flights USING btree (order_id, leg_sequence);

CREATE UNIQUE INDEX shipment_flights_pkey ON public.shipment_flights USING btree (id);

alter table "public"."fleet" add constraint "fleet_pkey" PRIMARY KEY using index "fleet_pkey";

alter table "public"."flights" add constraint "flights_pkey" PRIMARY KEY using index "flights_pkey";

alter table "public"."shipment_flights" add constraint "shipment_flights_pkey" PRIMARY KEY using index "shipment_flights_pkey";

alter table "public"."flights" add constraint "flights_fleet_id_fkey" FOREIGN KEY (fleet_id) REFERENCES public.fleet(id) not valid;

alter table "public"."flights" validate constraint "flights_fleet_id_fkey";

alter table "public"."shipment_flights" add constraint "shipment_flights_flight_id_fkey" FOREIGN KEY (flight_id) REFERENCES public.flights(id) not valid;

alter table "public"."shipment_flights" validate constraint "shipment_flights_flight_id_fkey";

alter table "public"."shipment_flights" add constraint "shipment_flights_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."shipment_flights" validate constraint "shipment_flights_order_id_fkey";

set check_function_bodies = off;

create or replace view "public"."logistics_order_view" as  SELECT o.id,
    o.order_number,
    o.user_id,
    o.customer_email,
    o.product_name,
    o.amount_total,
    o.currency,
    o.status,
    o.payment_provider,
    o.tracking_number,
    o.created_at,
    sf.leg_sequence,
    sf.weight_kg,
    f.flight_no,
    f.origin_code,
    f.dest_code,
    f.std,
    f.sta,
    f.status AS flight_status,
    fl.model AS aircraft_model,
    fl.payload_capacity_ton
   FROM (((public.orders o
     LEFT JOIN public.shipment_flights sf ON ((sf.order_id = o.id)))
     LEFT JOIN public.flights f ON ((f.id = sf.flight_id)))
     LEFT JOIN public.fleet fl ON ((fl.id = f.fleet_id)))
  WHERE (o.product_slug = 'freight-ehu'::text)
  ORDER BY o.created_at DESC, sf.leg_sequence;


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


grant delete on table "public"."fleet" to "anon";

grant insert on table "public"."fleet" to "anon";

grant references on table "public"."fleet" to "anon";

grant select on table "public"."fleet" to "anon";

grant trigger on table "public"."fleet" to "anon";

grant truncate on table "public"."fleet" to "anon";

grant update on table "public"."fleet" to "anon";

grant delete on table "public"."fleet" to "authenticated";

grant insert on table "public"."fleet" to "authenticated";

grant references on table "public"."fleet" to "authenticated";

grant select on table "public"."fleet" to "authenticated";

grant trigger on table "public"."fleet" to "authenticated";

grant truncate on table "public"."fleet" to "authenticated";

grant update on table "public"."fleet" to "authenticated";

grant delete on table "public"."fleet" to "service_role";

grant insert on table "public"."fleet" to "service_role";

grant references on table "public"."fleet" to "service_role";

grant select on table "public"."fleet" to "service_role";

grant trigger on table "public"."fleet" to "service_role";

grant truncate on table "public"."fleet" to "service_role";

grant update on table "public"."fleet" to "service_role";

grant delete on table "public"."flights" to "anon";

grant insert on table "public"."flights" to "anon";

grant references on table "public"."flights" to "anon";

grant select on table "public"."flights" to "anon";

grant trigger on table "public"."flights" to "anon";

grant truncate on table "public"."flights" to "anon";

grant update on table "public"."flights" to "anon";

grant delete on table "public"."flights" to "authenticated";

grant insert on table "public"."flights" to "authenticated";

grant references on table "public"."flights" to "authenticated";

grant select on table "public"."flights" to "authenticated";

grant trigger on table "public"."flights" to "authenticated";

grant truncate on table "public"."flights" to "authenticated";

grant update on table "public"."flights" to "authenticated";

grant delete on table "public"."flights" to "service_role";

grant insert on table "public"."flights" to "service_role";

grant references on table "public"."flights" to "service_role";

grant select on table "public"."flights" to "service_role";

grant trigger on table "public"."flights" to "service_role";

grant truncate on table "public"."flights" to "service_role";

grant update on table "public"."flights" to "service_role";

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

grant delete on table "public"."shipment_flights" to "anon";

grant insert on table "public"."shipment_flights" to "anon";

grant references on table "public"."shipment_flights" to "anon";

grant select on table "public"."shipment_flights" to "anon";

grant trigger on table "public"."shipment_flights" to "anon";

grant truncate on table "public"."shipment_flights" to "anon";

grant update on table "public"."shipment_flights" to "anon";

grant delete on table "public"."shipment_flights" to "authenticated";

grant insert on table "public"."shipment_flights" to "authenticated";

grant references on table "public"."shipment_flights" to "authenticated";

grant select on table "public"."shipment_flights" to "authenticated";

grant trigger on table "public"."shipment_flights" to "authenticated";

grant truncate on table "public"."shipment_flights" to "authenticated";

grant update on table "public"."shipment_flights" to "authenticated";

grant delete on table "public"."shipment_flights" to "service_role";

grant insert on table "public"."shipment_flights" to "service_role";

grant references on table "public"."shipment_flights" to "service_role";

grant select on table "public"."shipment_flights" to "service_role";

grant trigger on table "public"."shipment_flights" to "service_role";

grant truncate on table "public"."shipment_flights" to "service_role";

grant update on table "public"."shipment_flights" to "service_role";

grant delete on table "public"."subscriptions" to "postgres";

grant insert on table "public"."subscriptions" to "postgres";

grant references on table "public"."subscriptions" to "postgres";

grant select on table "public"."subscriptions" to "postgres";

grant trigger on table "public"."subscriptions" to "postgres";

grant truncate on table "public"."subscriptions" to "postgres";

grant update on table "public"."subscriptions" to "postgres";

grant delete on table "public"."x402_payments" to "postgres";

grant insert on table "public"."x402_payments" to "postgres";

grant references on table "public"."x402_payments" to "postgres";

grant select on table "public"."x402_payments" to "postgres";

grant trigger on table "public"."x402_payments" to "postgres";

grant truncate on table "public"."x402_payments" to "postgres";

grant update on table "public"."x402_payments" to "postgres";


  create policy "Fleet: public read"
  on "public"."fleet"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Fleet: service_role all"
  on "public"."fleet"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Fleet: staff_admin manage"
  on "public"."fleet"
  as permissive
  for all
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (public.is_staff_or_admin(auth.uid()));



  create policy "Flights: public read"
  on "public"."flights"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Flights: service_role all"
  on "public"."flights"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Flights: staff_admin manage"
  on "public"."flights"
  as permissive
  for all
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (public.is_staff_or_admin(auth.uid()));



  create policy "Shipment flights: owner view"
  on "public"."shipment_flights"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = shipment_flights.order_id) AND (o.user_id = auth.uid())))));



  create policy "Shipment flights: service_role all"
  on "public"."shipment_flights"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Shipment flights: staff_admin manage"
  on "public"."shipment_flights"
  as permissive
  for all
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (public.is_staff_or_admin(auth.uid()));



