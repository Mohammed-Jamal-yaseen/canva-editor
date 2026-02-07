import { create } from 'zustand';
import * as fabric from 'fabric';

interface EditorState {
  activeObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  history: string[]; // JSON representation of canvas state
  historyIndex: number;
  layers: fabric.Object[];
  
  setActiveObject: (object: fabric.Object | null) => void;
  setCanvas: (canvas: fabric.Canvas) => void;
  setLayers: (layers: fabric.Object[]) => void;
  addToHistory: (json: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeObject: null,
  canvas: null,
  history: [],
  historyIndex: -1,
  layers: [],

  setActiveObject: (object) => set({ activeObject: object }),
  
  setCanvas: (canvas) => set({ canvas }),
  setLayers: (layers) => set({ layers }),

  addToHistory: (json) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, historyIndex, canvas } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevJson = history[prevIndex];
      
      if (canvas && prevJson) {
        canvas.loadFromJSON(JSON.parse(prevJson), () => {
          canvas.renderAll();
          set({ historyIndex: prevIndex });
        });
      }
    }
  },

  redo: () => {
    const { history, historyIndex, canvas } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextJson = history[nextIndex];

      if (canvas && nextJson) {
        canvas.loadFromJSON(JSON.parse(nextJson), () => {
          canvas.renderAll();
          set({ historyIndex: nextIndex });
        });
      }
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  }
}));
