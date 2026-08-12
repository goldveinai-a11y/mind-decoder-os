-- scans: server-side only (accessed via service role); explicitly deny all client access
REVOKE ALL ON public.scans FROM anon, authenticated;
GRANT ALL ON public.scans TO service_role;

CREATE POLICY "scans_no_client_access" ON public.scans
  AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

-- profiles: read-own only, all writes handled server-side
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

CREATE POLICY "profiles_no_client_writes" ON public.profiles
  AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (false);

-- purchases: read-own only, all writes handled server-side
REVOKE ALL ON public.purchases FROM anon, authenticated;
GRANT SELECT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;

CREATE POLICY "purchases_no_client_writes" ON public.purchases
  AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (false);