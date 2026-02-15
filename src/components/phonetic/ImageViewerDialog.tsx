import { Download, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
}

export const ImageViewerDialog = ({ open, onOpenChange, src, alt }: ImageViewerDialogProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "pinyin-zhuyin-chart.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 flex flex-col items-center gap-2">
        <VisuallyHidden>
          <DialogTitle>Image Viewer</DialogTitle>
        </VisuallyHidden>
        <div className="flex justify-end w-full gap-2 pr-8">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download PNG
          </Button>
        </div>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain rounded"
        />
      </DialogContent>
    </Dialog>
  );
};
