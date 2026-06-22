// Force dynamic rendering for booking pages (they require auth + dynamic params)
export const dynamic = 'force-dynamic';

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
