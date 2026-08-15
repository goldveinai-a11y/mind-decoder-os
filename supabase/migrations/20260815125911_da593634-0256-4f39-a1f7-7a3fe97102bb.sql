-- referral code on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

CREATE OR REPLACE FUNCTION public.gen_referral_code()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

UPDATE public.profiles SET referral_code = public.gen_referral_code() WHERE referral_code IS NULL;

CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.gen_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_referral_code ON public.profiles;
CREATE TRIGGER profiles_set_referral_code
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_referral_code();

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_id uuid,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ip_hash)
);

CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON public.referrals(referrer_id);

GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read their own referrals" ON public.referrals;
CREATE POLICY "Users read their own referrals"
ON public.referrals FOR SELECT TO authenticated
USING (referrer_id = auth.uid());

-- Award a credit to the referrer, capped at 10 rewards per account.
CREATE OR REPLACE FUNCTION public.claim_referral(p_code text, p_ip_hash text, p_scan uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer uuid;
  v_count int;
BEGIN
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN 'no_code';
  END IF;

  SELECT id INTO v_referrer FROM public.profiles WHERE referral_code = upper(trim(p_code));
  IF v_referrer IS NULL THEN
    RETURN 'unknown_code';
  END IF;

  IF EXISTS (SELECT 1 FROM public.referrals WHERE ip_hash = p_ip_hash) THEN
    RETURN 'already_claimed';
  END IF;

  SELECT count(*) INTO v_count FROM public.referrals WHERE referrer_id = v_referrer;
  IF v_count >= 10 THEN
    RETURN 'capped';
  END IF;

  INSERT INTO public.referrals (referrer_id, scan_id, ip_hash)
  VALUES (v_referrer, p_scan, p_ip_hash)
  ON CONFLICT (ip_hash) DO NOTHING;

  IF NOT FOUND THEN
    RETURN 'already_claimed';
  END IF;

  UPDATE public.profiles SET credits = credits + 1 WHERE id = v_referrer;
  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.claim_referral(text, text, uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_referral(text, text, uuid) TO service_role;