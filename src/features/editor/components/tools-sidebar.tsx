import { MousePointer2, Square, Circle, Type, Layers, Image as ImageIcon } from 'lucide-react'
interface ToolsSidebarProps {
    onAddRectangle: () => void;
    onAddCircle: () => void;
    onAddText: () => void;
    onAddImage: () => void;
}

export const ToolsSidebar = ({ onAddRectangle, onAddCircle, onAddText, onAddImage }: ToolsSidebarProps) => {
  return (
    <aside className="border-e bg-background flex flex-col items-center py-4 gap-4 w-[80px] sm:w-full lg:w-[300px] transition-all">
       <div className="flex flex-col gap-2 w-full px-2 sm:px-4">
          <ToolButton icon={MousePointer2} label="تحديد" onClick={() => {}} isActive />
          <ToolButton icon={Square} label="مربع" onClick={onAddRectangle} />
          <ToolButton icon={Circle} label="دائرة" onClick={onAddCircle} />
          <ToolButton icon={Type} label="نص" onClick={onAddText} />
          <ToolButton icon={ImageIcon} label="صورة" onClick={onAddImage} />
          <ToolButton icon={Layers} label="طبقات" onClick={() => {}} />
       </div>
    </aside>
  );
};

interface ToolButtonProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isActive?: boolean;
}

function ToolButton({ icon: Icon, label, onClick, isActive }: ToolButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col sm:flex-row items-center sm:gap-3 p-2 rounded-lg hover:bg-muted transition-colors ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
        >
            <Icon className="h-5 w-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{label}</span>
        </button>
    )
}
