CREATE TABLE public.free_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  ip_hash text NOT NULL,
  used_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  scan_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX free_uses_fingerprint_day ON public.free_uses (fingerprint, used_on);
CREATE INDEX free_uses_ip_day ON public.free_uses (ip_hash, used_on);

GRANT ALL ON public.free_uses TO service_role;

ALTER TABLE public.free_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "free_uses no client access" ON public.free_uses AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS unlocked_free boolean NOT NULL DEFAULT false;