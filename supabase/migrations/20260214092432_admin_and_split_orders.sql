create type "public"."shipping_carrier" as enum ('no_shipping', 'fedex', 'ups', 'dhl', 'usps', 'royal_mail', 'canada_post', 'australia_post', 'la_poste', 'hermes', 'sf_express', 'yunexpress', 'yunda', 'china_post', 'hk_post', 'japan_post', 'aramex', 'tnt', 'gls', 'dhl_express');

create type "public"."user_role" as enum ('member', 'staff', 'admin');


  create table "public"."order_payment_details" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "provider" public.payment_provider not null,
    "transaction_id" text,
    "status" text,
    "amount_paid" numeric(12,2),
    "currency" text,
    "payment_method" text,
    "metadata" jsonb,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."order_payment_details" enable row level security;


  create table "public"."order_shipping" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "carrier" public.shipping_carrier not null default 'no_shipping'::public.shipping_carrier,
    "tracking_number" text,
    "shipping_address" jsonb,
    "shipped_at" timestamp with time zone,
    "delivered_at" timestamp with time zone,
    "estimated_delivery_date" timestamp with time zone,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."order_shipping" enable row level security;


  create table "public"."payment_history" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "user_id" uuid not null,
    "payment_method" character varying(50),
    "payment_provider" character varying(50),
    "coinbase_charge_id" character varying(255),
    "crypto_address" character varying(255),
    "crypto_type" character varying(50),
    "crypto_amount" numeric(36,18),
    "stripe_payment_intent_id" character varying(255),
    "stripe_charge_id" character varying(255),
    "status" character varying(50),
    "amount_usd" numeric(12,2),
    "amount_paid" numeric(36,18),
    "created_at" timestamp with time zone default now(),
    "confirmed_at" timestamp with time zone,
    "metadata" jsonb
      );


alter table "public"."payment_history" enable row level security;

alter table "public"."orders" add column "coinbase_charge_id" character varying(255);

alter table "public"."orders" add column "crypto_address" character varying(255);

alter table "public"."orders" add column "crypto_amount" numeric(36,18);

alter table "public"."orders" add column "crypto_type" character varying(50);

alter table "public"."orders" add column "payment_confirmed_at" timestamp with time zone;

alter table "public"."orders" add column "payment_expires_at" timestamp with time zone;

alter table "public"."orders" add column "payment_metadata" jsonb;

alter table "public"."profiles" add column "role" public.user_role not null default 'member'::public.user_role;

CREATE INDEX idx_order_payment_details_order ON public.order_payment_details USING btree (order_id);

CREATE INDEX idx_order_shipping_order ON public.order_shipping USING btree (order_id);

CREATE INDEX idx_orders_coinbase_charge_id ON public.orders USING btree (coinbase_charge_id);

CREATE INDEX idx_orders_payment_expires_at ON public.orders USING btree (payment_expires_at);

CREATE INDEX idx_orders_payment_provider ON public.orders USING btree (payment_provider);

CREATE INDEX idx_payment_history_created_at ON public.payment_history USING btree (created_at DESC);

CREATE INDEX idx_payment_history_order_id ON public.payment_history USING btree (order_id);

CREATE INDEX idx_payment_history_status ON public.payment_history USING btree (status);

CREATE INDEX idx_payment_history_user_id ON public.payment_history USING btree (user_id);

CREATE UNIQUE INDEX order_payment_details_order_id_key ON public.order_payment_details USING btree (order_id);

CREATE UNIQUE INDEX order_payment_details_pkey ON public.order_payment_details USING btree (id);

CREATE UNIQUE INDEX order_shipping_order_id_key ON public.order_shipping USING btree (order_id);

CREATE UNIQUE INDEX order_shipping_pkey ON public.order_shipping USING btree (id);

CREATE UNIQUE INDEX orders_coinbase_charge_id_key ON public.orders USING btree (coinbase_charge_id);

CREATE UNIQUE INDEX payment_history_pkey ON public.payment_history USING btree (id);

CREATE INDEX profiles_role_idx ON public.profiles USING btree (role);

CREATE UNIQUE INDEX unique_coinbase_charge ON public.payment_history USING btree (coinbase_charge_id);

CREATE UNIQUE INDEX unique_stripe_pi ON public.payment_history USING btree (stripe_payment_intent_id);

alter table "public"."order_payment_details" add constraint "order_payment_details_pkey" PRIMARY KEY using index "order_payment_details_pkey";

alter table "public"."order_shipping" add constraint "order_shipping_pkey" PRIMARY KEY using index "order_shipping_pkey";

alter table "public"."payment_history" add constraint "payment_history_pkey" PRIMARY KEY using index "payment_history_pkey";

alter table "public"."order_payment_details" add constraint "order_payment_details_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_payment_details" validate constraint "order_payment_details_order_id_fkey";

alter table "public"."order_payment_details" add constraint "order_payment_details_order_id_key" UNIQUE using index "order_payment_details_order_id_key";

alter table "public"."order_shipping" add constraint "order_shipping_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_shipping" validate constraint "order_shipping_order_id_fkey";

alter table "public"."order_shipping" add constraint "order_shipping_order_id_key" UNIQUE using index "order_shipping_order_id_key";

alter table "public"."orders" add constraint "orders_coinbase_charge_id_key" UNIQUE using index "orders_coinbase_charge_id_key";

alter table "public"."payment_history" add constraint "payment_history_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."payment_history" validate constraint "payment_history_order_id_fkey";

alter table "public"."payment_history" add constraint "unique_coinbase_charge" UNIQUE using index "unique_coinbase_charge";

alter table "public"."payment_history" add constraint "unique_stripe_pi" UNIQUE using index "unique_stripe_pi";

set check_function_bodies = off;

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


grant delete on table "public"."order_payment_details" to "anon";

grant insert on table "public"."order_payment_details" to "anon";

grant references on table "public"."order_payment_details" to "anon";

grant select on table "public"."order_payment_details" to "anon";

grant trigger on table "public"."order_payment_details" to "anon";

grant truncate on table "public"."order_payment_details" to "anon";

grant update on table "public"."order_payment_details" to "anon";

grant delete on table "public"."order_payment_details" to "authenticated";

grant insert on table "public"."order_payment_details" to "authenticated";

grant references on table "public"."order_payment_details" to "authenticated";

grant select on table "public"."order_payment_details" to "authenticated";

grant trigger on table "public"."order_payment_details" to "authenticated";

grant truncate on table "public"."order_payment_details" to "authenticated";

grant update on table "public"."order_payment_details" to "authenticated";

grant delete on table "public"."order_payment_details" to "postgres";

grant insert on table "public"."order_payment_details" to "postgres";

grant references on table "public"."order_payment_details" to "postgres";

grant select on table "public"."order_payment_details" to "postgres";

grant trigger on table "public"."order_payment_details" to "postgres";

grant truncate on table "public"."order_payment_details" to "postgres";

grant update on table "public"."order_payment_details" to "postgres";

grant delete on table "public"."order_payment_details" to "service_role";

grant insert on table "public"."order_payment_details" to "service_role";

grant references on table "public"."order_payment_details" to "service_role";

grant select on table "public"."order_payment_details" to "service_role";

grant trigger on table "public"."order_payment_details" to "service_role";

grant truncate on table "public"."order_payment_details" to "service_role";

grant update on table "public"."order_payment_details" to "service_role";

grant delete on table "public"."order_shipping" to "anon";

grant insert on table "public"."order_shipping" to "anon";

grant references on table "public"."order_shipping" to "anon";

grant select on table "public"."order_shipping" to "anon";

grant trigger on table "public"."order_shipping" to "anon";

grant truncate on table "public"."order_shipping" to "anon";

grant update on table "public"."order_shipping" to "anon";

grant delete on table "public"."order_shipping" to "authenticated";

grant insert on table "public"."order_shipping" to "authenticated";

grant references on table "public"."order_shipping" to "authenticated";

grant select on table "public"."order_shipping" to "authenticated";

grant trigger on table "public"."order_shipping" to "authenticated";

grant truncate on table "public"."order_shipping" to "authenticated";

grant update on table "public"."order_shipping" to "authenticated";

grant delete on table "public"."order_shipping" to "postgres";

grant insert on table "public"."order_shipping" to "postgres";

grant references on table "public"."order_shipping" to "postgres";

grant select on table "public"."order_shipping" to "postgres";

grant trigger on table "public"."order_shipping" to "postgres";

grant truncate on table "public"."order_shipping" to "postgres";

grant update on table "public"."order_shipping" to "postgres";

grant delete on table "public"."order_shipping" to "service_role";

grant insert on table "public"."order_shipping" to "service_role";

grant references on table "public"."order_shipping" to "service_role";

grant select on table "public"."order_shipping" to "service_role";

grant trigger on table "public"."order_shipping" to "service_role";

grant truncate on table "public"."order_shipping" to "service_role";

grant update on table "public"."order_shipping" to "service_role";

grant delete on table "public"."orders" to "postgres";

grant insert on table "public"."orders" to "postgres";

grant references on table "public"."orders" to "postgres";

grant select on table "public"."orders" to "postgres";

grant trigger on table "public"."orders" to "postgres";

grant truncate on table "public"."orders" to "postgres";

grant update on table "public"."orders" to "postgres";

grant delete on table "public"."payment_history" to "anon";

grant insert on table "public"."payment_history" to "anon";

grant references on table "public"."payment_history" to "anon";

grant select on table "public"."payment_history" to "anon";

grant trigger on table "public"."payment_history" to "anon";

grant truncate on table "public"."payment_history" to "anon";

grant update on table "public"."payment_history" to "anon";

grant delete on table "public"."payment_history" to "authenticated";

grant insert on table "public"."payment_history" to "authenticated";

grant references on table "public"."payment_history" to "authenticated";

grant select on table "public"."payment_history" to "authenticated";

grant trigger on table "public"."payment_history" to "authenticated";

grant truncate on table "public"."payment_history" to "authenticated";

grant update on table "public"."payment_history" to "authenticated";

grant delete on table "public"."payment_history" to "postgres";

grant insert on table "public"."payment_history" to "postgres";

grant references on table "public"."payment_history" to "postgres";

grant select on table "public"."payment_history" to "postgres";

grant trigger on table "public"."payment_history" to "postgres";

grant truncate on table "public"."payment_history" to "postgres";

grant update on table "public"."payment_history" to "postgres";

grant delete on table "public"."payment_history" to "service_role";

grant insert on table "public"."payment_history" to "service_role";

grant references on table "public"."payment_history" to "service_role";

grant select on table "public"."payment_history" to "service_role";

grant trigger on table "public"."payment_history" to "service_role";

grant truncate on table "public"."payment_history" to "service_role";

grant update on table "public"."payment_history" to "service_role";

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


  create policy "Order payment: owner update"
  on "public"."order_payment_details"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_payment_details.order_id) AND (o.user_id = auth.uid())))))
with check (true);



  create policy "Order payment: owner view"
  on "public"."order_payment_details"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_payment_details.order_id) AND (o.user_id = auth.uid())))));



  create policy "Order payment: service_role all"
  on "public"."order_payment_details"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Order payment: staff_admin insert"
  on "public"."order_payment_details"
  as permissive
  for insert
  to authenticated
with check (public.is_staff_or_admin(auth.uid()));



  create policy "Order payment: staff_admin update"
  on "public"."order_payment_details"
  as permissive
  for update
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (true);



  create policy "Order payment: staff_admin view"
  on "public"."order_payment_details"
  as permissive
  for select
  to authenticated
using (public.is_staff_or_admin(auth.uid()));



  create policy "Order shipping: owner update"
  on "public"."order_shipping"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_shipping.order_id) AND (o.user_id = auth.uid())))))
with check (true);



  create policy "Order shipping: owner view"
  on "public"."order_shipping"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_shipping.order_id) AND (o.user_id = auth.uid())))));



  create policy "Order shipping: service_role all"
  on "public"."order_shipping"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Order shipping: staff_admin insert"
  on "public"."order_shipping"
  as permissive
  for insert
  to authenticated
with check (public.is_staff_or_admin(auth.uid()));



  create policy "Order shipping: staff_admin update"
  on "public"."order_shipping"
  as permissive
  for update
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (true);



  create policy "Order shipping: staff_admin view"
  on "public"."order_shipping"
  as permissive
  for select
  to authenticated
using (public.is_staff_or_admin(auth.uid()));



  create policy "Orders: self update"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Orders: self view"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using ((user_id = auth.uid()));



  create policy "Orders: staff_admin update all"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (true);



  create policy "Orders: staff_admin view all"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using (public.is_staff_or_admin(auth.uid()));



  create policy "Users can insert their own payment history"
  on "public"."payment_history"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their own payment history"
  on "public"."payment_history"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Profiles: admin delete"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Profiles: self update"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "Profiles: self view"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = auth.uid()));



  create policy "Profiles: staff_admin update all"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (public.is_staff_or_admin(auth.uid()))
with check (true);



  create policy "Profiles: staff_admin view all"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (public.is_staff_or_admin(auth.uid()));



