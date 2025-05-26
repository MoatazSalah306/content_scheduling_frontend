
import React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  images: File[];
  onRemove: (index: number) => void;
  onAdd: () => void;
  maxImages?: number;
}

export function ImagePreview({ images, onRemove, onAdd, maxImages = 4 }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Images ({images.length}/{maxImages})</h3>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Add Image
          </Button>
        )}
      </div>

      {images.length === 0 ? (
        <div
          onClick={onAdd}
          className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 cursor-pointer hover:border-muted-foreground/50 transition-colors"
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Click to upload images for your post
          </p>
          <p className="text-xs text-muted-foreground/75 mt-1">
            Supports JPG, PNG, GIF up to 10MB
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                  {image.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
