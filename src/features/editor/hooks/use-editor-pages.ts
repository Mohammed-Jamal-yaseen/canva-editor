
import * as fabric from "fabric";
import { useCallback } from "react";
import { WORKSPACE_DEFAULTS } from "@/features/editor/utils/constants";
import { getWorkspace } from "@/features/editor/utils/editor-actions";
import {JSON_KEYS} from '@/features/editor/types'
interface UseEditorPagesProps {
  canvas: fabric.Canvas | null;
  pages: string[];
  setPages: (pages: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  autoZoom: () => void;
  save: () => void;
}

export const useEditorPages = ({
  canvas,
  pages,
  setPages,
  currentPage,
  setCurrentPage,
  autoZoom,
  save,
}: UseEditorPagesProps) => {

  const saveCurrentPage = useCallback(() => {
    if (!canvas) return;
    // @ts-expect-error - Fabric 7 type mismatch
    const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
    const updatedPages = [...pages];
    updatedPages[currentPage] = currentState;
    setPages(updatedPages);
    return updatedPages;
  }, [canvas, pages, currentPage, setPages]);

  const clearCanvasExceptClip = useCallback(() => {
    if (!canvas) return;
    canvas.getObjects().forEach((object) => {
      if ((object as any).name !== "clip") {
        canvas.remove(object);
      }
    });
  }, [canvas]);

  const loadPage = useCallback((pageDataString: string) => {
    if (!canvas) return;
    try {
        if (pageDataString && pageDataString !== "") {
            const pageData = JSON.parse(pageDataString);
            canvas.loadFromJSON(pageData).then(() => {
                canvas.renderAll();
                autoZoom();
            });
        } else {
            canvas.renderAll();
            autoZoom();
        }
    } catch (error) {
      console.error("Error loading page:", error);
    }
  }, [canvas, autoZoom]);

  const addPage = useCallback((options?: { width: number; height: number }) => {
    if (!canvas) return;
    
    const workspace = getWorkspace(canvas);
    const pageWidth = options?.width || workspace?.width || WORKSPACE_DEFAULTS.width;
    const pageHeight = options?.height || workspace?.height || WORKSPACE_DEFAULTS.height;
    
    const currentPages = saveCurrentPage();
    if (!currentPages) return; // Should not happen

    // Add new empty page
    const newPages = [...currentPages, ""];
    setPages(newPages);
    setCurrentPage(newPages.length - 1);
    
    clearCanvasExceptClip();
    
    // Update or create workspace with new dimensions
    if (workspace) {
      workspace.set({ width: pageWidth, height: pageHeight });
      canvas.centerObject(workspace);
    } else {
      const newWorkspace = new fabric.Rect({
        width: pageWidth,
        height: pageHeight,
        fill: WORKSPACE_DEFAULTS.fill,
        name: "clip",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
            color: WORKSPACE_DEFAULTS.shadowColor,
            blur: WORKSPACE_DEFAULTS.shadowBlur,
        }),
      });
      
      canvas.add(newWorkspace);
      canvas.centerObject(newWorkspace);
      canvas.clipPath = newWorkspace;
    }
    
    canvas.renderAll();
    autoZoom();
    save();
  }, [canvas, saveCurrentPage, setPages, setCurrentPage, clearCanvasExceptClip, autoZoom, save]);

  const deletePage = useCallback(() => {
    if (!canvas) return;

    if (pages.length <= 1) {
      clearCanvasExceptClip();
      canvas.discardActiveObject();
      canvas.renderAll();
      save();
      return;
    }
    
    const updatedPages = pages.filter((_, index) => index !== currentPage);
    setPages(updatedPages);
    
    const newCurrentPage = currentPage > 0 ? currentPage - 1 : 0;
    setCurrentPage(newCurrentPage);
    
    clearCanvasExceptClip();
    
    if (updatedPages[newCurrentPage]) {
        loadPage(updatedPages[newCurrentPage]);
    } else {
        canvas.discardActiveObject();
        canvas.renderAll();
    }
    
    save();
  }, [canvas, pages, currentPage, clearCanvasExceptClip, setPages, setCurrentPage, loadPage, save]);

  const nextPage = useCallback(() => {
    if (!canvas) return;
    if (currentPage >= pages.length - 1) return;
    
    saveCurrentPage();
    
    const nextPageIndex = currentPage + 1;
    setCurrentPage(nextPageIndex);
    
    clearCanvasExceptClip();
    loadPage(pages[nextPageIndex] || "");
  }, [canvas, currentPage, pages, saveCurrentPage, setCurrentPage, clearCanvasExceptClip, loadPage]);

  const prevPage = useCallback(() => {
    if (!canvas) return;
    if (currentPage <= 0) return;
    
    saveCurrentPage();
    
    const prevPageIndex = currentPage - 1;
    setCurrentPage(prevPageIndex);
    
    clearCanvasExceptClip();
    loadPage(pages[prevPageIndex] || "");
  }, [canvas, currentPage, saveCurrentPage, setCurrentPage, clearCanvasExceptClip, loadPage, pages]);

  const goToPage = useCallback((index: number) => {
    if (!canvas) return;
    if (index < 0 || index >= pages.length) return;
    if (index === currentPage) return;
    
    saveCurrentPage();
    setCurrentPage(index);
    
    clearCanvasExceptClip();
    loadPage(pages[index] || "");
  }, [canvas, pages, currentPage, saveCurrentPage, setCurrentPage, clearCanvasExceptClip, loadPage]);

  const duplicatePage = useCallback(() => {
    if (!canvas) return;
    
    // Save current page first to ensure we have the latest state
    const currentPages = saveCurrentPage();
    if (!currentPages) return;

    const currentPageData = currentPages[currentPage];
    const newPages = [...currentPages];
    
    // Insert duplicate after current page
    newPages.splice(currentPage + 1, 0, currentPageData);
    
    setPages(newPages);
    setCurrentPage(currentPage + 1);
    
    // Since we are duplicating, the canvas state is technically correct (same visuals)
    // But we trigger save to persist the change
    save();
  }, [canvas, currentPage, saveCurrentPage, setPages, setCurrentPage, save]);

  return {
    addPage,
    deletePage,
    nextPage,
    prevPage,
    goToPage,
    duplicatePage,
  };
};
