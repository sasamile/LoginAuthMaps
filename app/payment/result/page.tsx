export default function PaymentResult({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resultado del Pago</h1>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}
