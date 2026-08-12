ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS payment_intent_id text;
CREATE INDEX IF NOT EXISTS idx_purchases_payment_intent ON public.purchases(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_created ON public.scans(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.grant_purchased_credits(p_user uuid, p_pack text, p_credits integer, p_amount_cents integer, p_session text, p_payment_intent text DEFAULT NULL)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.purchases (user_id, pack, credits, amount_cents, status, provider_session_id, payment_intent_id)
  VALUES (p_user, p_pack, p_credits, p_amount_cents, 'paid', p_session, p_payment_intent)
  ON CONFLICT (provider_session_id) DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN 'duplicate';
  END IF;

  UPDATE public.profiles SET credits = credits + p_credits WHERE id = p_user;
  RETURN 'ok';
END;
$function$;

CREATE OR REPLACE FUNCTION public.revoke_refunded_credits(p_payment_intent text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_purchase public.purchases%ROWTYPE;
  v_balance INTEGER;
BEGIN
  SELECT * INTO v_purchase FROM public.purchases
   WHERE payment_intent_id = p_payment_intent FOR UPDATE;

  IF v_purchase.id IS NULL THEN
    RETURN 'not_found';
  END IF;

  IF v_purchase.status = 'refunded' THEN
    RETURN 'duplicate';
  END IF;

  UPDATE public.purchases SET status = 'refunded' WHERE id = v_purchase.id;

  IF v_purchase.user_id IS NOT NULL THEN
    SELECT credits INTO v_balance FROM public.profiles WHERE id = v_purchase.user_id FOR UPDATE;
    UPDATE public.profiles
       SET credits = GREATEST(0, COALESCE(v_balance, 0) - v_purchase.credits)
     WHERE id = v_purchase.user_id;
  END IF;

  RETURN 'ok';
END;
$function$;