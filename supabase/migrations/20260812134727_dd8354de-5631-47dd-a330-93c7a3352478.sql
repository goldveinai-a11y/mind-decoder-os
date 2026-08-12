CREATE OR REPLACE FUNCTION public.grant_purchased_credits(
  p_user UUID,
  p_pack TEXT,
  p_credits INTEGER,
  p_amount_cents INTEGER,
  p_session TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.purchases (user_id, pack, credits, amount_cents, status, provider_session_id)
  VALUES (p_user, p_pack, p_credits, p_amount_cents, 'paid', p_session)
  ON CONFLICT (provider_session_id) DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN 'duplicate';
  END IF;

  UPDATE public.profiles SET credits = credits + p_credits WHERE id = p_user;
  RETURN 'ok';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_purchased_credits(UUID, TEXT, INTEGER, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_purchased_credits(UUID, TEXT, INTEGER, INTEGER, TEXT) TO service_role;