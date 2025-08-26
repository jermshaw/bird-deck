import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BirdPhotoCarouselProps {
  images: string[];
  birdName: string;
  isCollected: boolean;
}

export function BirdPhotoCarousel({ images, birdName, isCollected }: BirdPhotoCarouselProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const currentImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <>
      {/* Image Carousel */}
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((imageUrl, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                <div 
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer transition-transform duration-200 active:scale-95 hover:scale-105"
                  onClick={() => openImageModal(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`${birdName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 2 && (
            <>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </>
          )}
        </Carousel>
      </div>

      {/* Full Screen Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-none max-h-none w-full h-full p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">
            {birdName} - Photo {selectedImageIndex !== null ? selectedImageIndex + 1 : ''}
          </DialogTitle>
          
          {currentImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Image */}
              <div className="relative max-w-full max-h-full p-4">
                <img
                  src={currentImage}
                  alt={`${birdName} - Photo ${selectedImageIndex! + 1}`}
                  className={cn(
                    "max-w-full max-h-full object-contain rounded-lg",
                    !isCollected && "grayscale"
                  )}
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  {selectedImageIndex! > 0 && (
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200 z-10"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                  )}
                  
                  {selectedImageIndex! < images.length - 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200 z-10"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  )}
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                  {selectedImageIndex! + 1} of {images.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
