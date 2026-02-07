import { Editor } from "@/features/editor/components/editor";

interface EditorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ width?: string; height?: string }>;
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const { id } = await params;
  const { width, height } = await searchParams;
  
  const initialWidth = width ? parseInt(width) : 1080;
  const initialHeight = height ? parseInt(height) : 1080;
  
  return (
    <Editor 
      initialData={{
        id,
        width: initialWidth,
        height: initialHeight,
        json: "",
        name: "",
        updatedAt: "",
      }} 
    />
  );
}
