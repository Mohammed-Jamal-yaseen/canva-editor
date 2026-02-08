
import * as fabric from "fabric";

export const alignObjects = (
  activeObject: fabric.Object,
  workspace: fabric.Object,
  position: "left" | "center" | "right" | "top" | "middle" | "bottom" | "distribute-horizontal" | "distribute-vertical"
) => {
  const workspaceRect = workspace.getBoundingRect();
  const objectRect = activeObject.getBoundingRect();

  // If object is inside an active selection, we need to handle it differently
  // But usually we align the selection itself or the single object.
  // getBoundingRect returns absolute coordinates (if not group).

  switch (position) {
    case "left":
      activeObject.setX(workspaceRect.left + (activeObject.left - objectRect.left));
      break;
    case "right":
        // The right edge of object should be at workspaceRect.left + workspaceRect.width
        // objectRect.left + objectRect.width = workspaceRect.left + workspaceRect.width
        // objectRect.left = workspaceRect.left + workspaceRect.width - objectRect.width
        // We need to shift the object.left by the difference
        const currentRight = objectRect.left + objectRect.width;
        const targetRight = workspaceRect.left + workspaceRect.width;
        activeObject.setX(activeObject.left + (targetRight - currentRight));
      break;
    case "center":
        // Centers text horizontal
        const currentCenter = objectRect.left + objectRect.width / 2;
        const targetCenter = workspaceRect.left + workspaceRect.width / 2;
        activeObject.setX(activeObject.left + (targetCenter - currentCenter));
      break;
    case "top":
      activeObject.setY(workspaceRect.top + (activeObject.top - objectRect.top));
      break;
    case "bottom":
      const currentBottom = objectRect.top + objectRect.height;
      const targetBottom = workspaceRect.top + workspaceRect.height;
      activeObject.setY(activeObject.top + (targetBottom - currentBottom));
      break;
    case "middle":
      const currentMiddle = objectRect.top + objectRect.height / 2;
      const targetMiddle = workspaceRect.top + workspaceRect.height / 2;
      activeObject.setY(activeObject.top + (targetMiddle - currentMiddle));
      break;
    case "distribute-horizontal":
        if (activeObject.type === "activeSelection") {
            const selection = activeObject as fabric.ActiveSelection;
            const objects = selection.getObjects();
            
            // Sort by visual left position
            objects.sort((a, b) => a.getBoundingRect().left - b.getBoundingRect().left);

            if (objects.length > 2) {
                const first = objects[0];
                const last = objects[objects.length - 1];
                const firstRect = first.getBoundingRect();
                const lastRect = last.getBoundingRect();
                
                // Total available span for gaps
                // Distance between First's Left and Last's Right
                const totalSpan = (lastRect.left + lastRect.width) - firstRect.left;
                
                // Sum of widths of all objects
                const totalWidths = objects.reduce((sum, obj) => sum + obj.getBoundingRect().width, 0);
                
                // Total gap space
                const totalGap = totalSpan - totalWidths;
                
                // Gap per interval
                // With N objects, there are N-1 intervals
                // Wait, typically distribute means "equal spacing between centers" OR "equal gaps between edges".
                // Figma does "Tidy Up" (equal gaps).
                // "Distribute Horizontal Centers" makes centers equidistant.
                // "Distribute Horizontal Spacing" makes gaps equidistant.
                // Let's implement "Distribute Horizontal Spacing" (usually what users want for boxes).

                // BUT standard fabric behavior usually distributes CENTERS if the command is "distribute-horizontal".
                // Let's stick to Space Between (Gaps) as it's cleaner for layout.
                
                // Although, if totalGap is negative (overlap), it distributes overlap equally.
                
                // Actually, let's stick to simplified Center Distribution if Gaps are hard to perfectly calculate with mixed logic.
                // Re-reading user request: "alignment... work correct".
                
                // Let's try to do Centers first, it's safer.
                // Center of First to Center of Last.
                // Range = LastCenter - FirstCenter.
                // Step = Range / (N-1).
                
                const firstCenter = firstRect.left + firstRect.width / 2;
                const lastCenter = lastRect.left + lastRect.width / 2;
                const range = lastCenter - firstCenter;
                const step = range / (objects.length - 1);
                
                let currentTargetCenter = firstCenter;
                
                objects.forEach((obj, index) => {
                   // First and last stay put
                   if (index > 0 && index < objects.length - 1) {
                       currentTargetCenter += step;
                       const objRect = obj.getBoundingRect();
                       const currentObjCenter = objRect.left + objRect.width / 2;
                       const diff = currentTargetCenter - currentObjCenter;
                       obj.setX(obj.left + diff);
                   }
                });
            }
        }
        break;
     case "distribute-vertical":
        if (activeObject.type === "activeSelection") {
            const selection = activeObject as fabric.ActiveSelection;
            const objects = selection.getObjects();
            objects.sort((a, b) => a.getBoundingRect().top - b.getBoundingRect().top);

            if (objects.length > 2) {
                const first = objects[0];
                const last = objects[objects.length - 1];
                const firstRect = first.getBoundingRect();
                const lastRect = last.getBoundingRect();
                
                const firstCenter = firstRect.top + firstRect.height / 2;
                const lastCenter = lastRect.top + lastRect.height / 2;
                const range = lastCenter - firstCenter;
                const step = range / (objects.length - 1);
                
                let currentTargetCenter = firstCenter;
                
                objects.forEach((obj, index) => {
                   if (index > 0 && index < objects.length - 1) {
                       currentTargetCenter += step;
                       const objRect = obj.getBoundingRect();
                       const currentObjCenter = objRect.top + objRect.height / 2;
                       const diff = currentTargetCenter - currentObjCenter;
                       obj.setY(obj.top + diff);
                   }
                });
            }
        }
        break;
  }
}
