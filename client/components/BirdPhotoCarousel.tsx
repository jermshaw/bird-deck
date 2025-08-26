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

  const formatImageCaption = (imageUrl: string): string => {
    // Extract filename from URL and remove extension
    const filename = imageUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';

    // Capitalize first letter and return
    return filename.charAt(0).toUpperCase() + filename.slice(1);
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
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer transition-transform duration-200 active:scale-95 hover:scale-105 relative"
                  onClick={() => openImageModal(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`${birdName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16"
                    style={{ background: 'linear-gradient(196deg, rgba(0, 0, 0, 0.00) 41.39%, #000 107.79%)' }}
                  />
                  {/* Caption */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-base italic font-medium text-white/80 font-work-sans">
                      {formatImageCaption(imageUrl)}
                    </span>
                  </div>
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
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={currentImage}
                    alt={`${birdName} - Photo ${selectedImageIndex! + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  {/* Gradient Overlay for full-screen */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20"
                    style={{ background: 'linear-gradient(196deg, rgba(0, 0, 0, 0.00) 41.39%, #000 107.79%)' }}
                  />
                  {/* Caption for full-screen */}
                  <div className="absolute bottom-6 left-6">
                    <span className="text-xl italic font-medium text-white/80 font-work-sans">
                      {formatImageCaption(currentImage)}
                    </span>
                  </div>
                </div>
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
