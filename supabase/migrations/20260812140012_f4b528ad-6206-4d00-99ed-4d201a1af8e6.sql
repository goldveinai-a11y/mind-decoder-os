REVOKE EXECUTE ON FUNCTION public.grant_purchased_credits(uuid, text, integer, integer, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_purchased_credits(uuid, text, integer, integer, text, text) TO service_role;
REVOKE EXECUTE ON FUNCTION public.revoke_refunded_credits(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_refunded_credits(text) TO service_role;