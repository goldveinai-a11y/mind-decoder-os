CREATE OR REPLACE FUNCTION public.spend_credit_and_unlock(p_scan UUID, p_token TEXT, p_user UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unlocked BOOLEAN;
  v_left INTEGER;
BEGIN
  SELECT unlocked INTO v_unlocked FROM public.scans
   WHERE id = p_scan AND access_token = p_token FOR UPDATE;

  IF v_unlocked IS NULL THEN
    RETURN 'not_found';
  END IF;

  IF v_unlocked THEN
    UPDATE public.scans SET user_id = COALESCE(user_id, p_user) WHERE id = p_scan;
    RETURN 'ok';
  END IF;

  UPDATE public.profiles SET credits = credits - 1
   WHERE id = p_user AND credits > 0
   RETURNING credits INTO v_left;

  IF v_left IS NULL THEN
    RETURN 'no_credits';
  END IF;

  UPDATE public.scans SET unlocked = true, user_id = COALESCE(user_id, p_user)
   WHERE id = p_scan;

  RETURN 'ok';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.spend_credit_and_unlock(UUID, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credit_and_unlock(UUID, TEXT, UUID) TO service_role;