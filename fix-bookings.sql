-- 1. Drop the recursive policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. Create a secure function to check admin status without triggering recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Recreate the policy using the secure function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 4. Sync missing profiles for users who signed up BEFORE the tables were created
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 5. Allow authenticated users to update flights (so they can decrease available_seats when booking)
DROP POLICY IF EXISTS "Admins can update flights" ON public.flights;
DROP POLICY IF EXISTS "Authenticated users can update flights" ON public.flights;

CREATE POLICY "Authenticated users can update flights"
  ON public.flights FOR UPDATE
  USING (auth.uid() IS NOT NULL);
