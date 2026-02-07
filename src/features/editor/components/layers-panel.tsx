import { useEditorStore } from '../store/use-editor-store';
import { Layers, Square, Circle, Type, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const LayersPanel = () => {
    const { layers, setActiveObject, activeObject } = useEditorStore();

    // Reverse layers to show top-most first
    const reversedLayers = [...layers].reverse();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <h3 className="font-semibold text-sm">الطبقات</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                 {reversedLayers.length === 0 ? (
                    <div className="text-center text-muted-foreground text-xs py-4">
                        لا توجد طبقات
                    </div>
                 ) : (
                    <div className="flex flex-col gap-1">
                        {reversedLayers.map((layer, index) => {
                            // Fabric doesn't give a stable ID by default unless we set it. 
                            // Using index for now, but in prod should use layer.id or generated UUID.
                            // However, since we reversed, the real index is length - 1 - index
                            const isActive = activeObject === layer;
                            
                            let Icon = Square;
                            if (layer.type === 'circle') Icon = Circle;
                            if (layer.type === 'textbox' || layer.type === 'text') Icon = Type;
                            if (layer.type === 'image') Icon = ImageIcon;

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        // We need to access the canvas to set active object properly
                                        // But store.setActiveObject just updates state.
                                        // To truly select, we should probably expose a selectObject method in store or hook
                                        // For now, let's just use the canvas reference from store if available
                                        const canvas = useEditorStore.getState().canvas;
                                        if(canvas) {
                                            canvas.setActiveObject(layer);
                                            canvas.requestRenderAll();
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 p-2 rounded text-sm transition-colors",
                                        isActive ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="capitalize truncate">
                                        {layer.type === 'textbox' ? (layer as any).text : layer.type}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                 )}
            </div>
        </div>
    )
}
