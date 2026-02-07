export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-background">
      {children}
    </div>
  );
}
