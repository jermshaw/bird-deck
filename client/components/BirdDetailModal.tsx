import { useState } from 'react';
import { Bird, sizeIcons } from '@shared/birds';
import { useCollection } from '@/hooks/use-collection';
import { useHolographicCard } from '@/hooks/use-holographic-card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BirdPhotoCarousel } from '@/components/BirdPhotoCarousel';
import { cn } from '@/lib/utils';
import { Plus, Check, X } from 'lucide-react';

interface BirdDetailModalProps {
  bird: Bird | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BirdDetailModal({ bird, open, onOpenChange }: BirdDetailModalProps) {
  const { isInCollection, addToCollection, removeFromCollection } = useCollection();
  const { cardProps, glareProps, shineProps, isHovered } = useHolographicCard({
    maxTilt: 18,
    scale: 1.1,
    speed: 150,
    glareIntensity: 0.6,
    shineIntensity: 0.8
  });


  const isCollected = bird ? isInCollection(bird.id) : false;


  const handleCollectionToggle = () => {
    if (!bird) return;
    if (isCollected) {
      removeFromCollection(bird.id);
    } else {
      addToCollection(bird.id);
    }
  };

  const sizeComparisonIcons = [
    { size: 'tiny', active: bird?.size === 'tiny' },
    { size: 'small', active: bird?.size === 'small' },
    { size: 'medium', active: bird?.size === 'medium' },
    { size: 'large', active: bird?.size === 'large' },
    { size: 'enormous', active: bird?.size === 'enormous' }
  ];

  return (
    <Dialog open={open && bird !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none max-h-none w-full h-full p-0 bg-transparent border-none overflow-hidden">
        <DialogTitle className="sr-only">
          {bird?.name || 'Bird'} - Bird Details
        </DialogTitle>
        {bird && (
        <div className="min-h-screen w-full relative font-rubik overflow-y-auto">
          {/* Blurred Background - Fixed */}
          <div
            className="fixed inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${bird.imageUrl})`,
              filter: 'blur(150px)',
              backgroundColor: '#EEE'
            }}
          />

          {/* Background Overlay for Text Legibility - Fixed */}
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundColor: 'rgba(238, 238, 238, 0.5)'
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col w-full max-w-sm mx-auto px-6 py-16 sm:py-20">



            {/* Main Bird Card */}
            <div
              {...cardProps}
              className={`bg-white rounded-2xl overflow-hidden mb-20 gpu-accelerated transition-shadow duration-150 relative ${
                isHovered
                  ? 'shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(255,255,255,0.15),inset_0_2px_0_rgba(255,255,255,0.7)]'
                  : 'shadow-lg'
              }`}
            >
              {/* Holographic Glare Effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                {...glareProps}
              />

              {/* Holographic Shine Effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                {...shineProps}
              />
              {/* Card Content */}
              <div className="relative p-1 z-0">
                {/* Bird Image */}
                <div className="relative aspect-[35/52] rounded-xl overflow-hidden border border-black">
                  <img
                    src={bird.imageUrl}
                    alt={bird.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      !isCollected ? 'grayscale' : ''
                    }`}
                  />

                  {/* Rarity Badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#F3F3F3] border border-[#2C2C2C] rounded-full flex items-center justify-center">
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 8 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-2.5 fill-[#2C2C2C] transform rotate-[-23.972deg]"
                    >
                      <path d="M6.80255 0.39989C7.2046 0.0565747 7.79657 0.141577 7.82664 0.549448C7.87776 0.948024 7.90655 1.46684 7.87151 2.06849C7.81534 3.24752 6.58006 5.15219 5.30671 5.97482L7.38227 5.05195C7.20793 5.62405 6.9769 6.23934 6.66944 6.85232C6.30497 7.5639 5.934 8.26036 5.53553 8.89549L4.38439 9.75574L4.9811 9.74692C3.73732 11.6006 2.84391 12.1447 2.03342 12.1936C2.55555 9.96461 2.78201 8.95583 4.46463 6.88361C2.91991 8.70524 2.25359 10.0244 1.62073 12.1741C1.74943 12.1982 1.86808 12.1976 2.00526 12.188C1.74894 13.1996 1.67207 13.8202 1.65036 13.8848C1.62797 14.0046 1.50066 14.1164 1.35393 14.1267C1.20719 14.137 1.11769 14.0477 1.119 13.9372L1.11225 13.9221C1.13426 13.8556 1.25174 13.2748 1.5899 12.1792C1.57575 12.1786 1.56048 12.1757 1.54518 12.1724C0.220929 11.9735 0.155025 9.84108 2.12819 5.94103L2.91001 6.43985C2.87025 5.66976 3.03111 5.19109 3.36163 4.40293C3.69894 3.63018 4.1965 2.87754 4.86803 2.17597C4.88904 2.16658 4.90361 2.14198 4.92464 2.13263C5.25854 2.82686 5.54558 2.99795 5.54558 2.99795L6.01943 1.07834C6.30873 0.821472 6.56282 0.598078 6.80255 0.39989Z" fill="#2C2C2C"/>
                    </svg>
                  </div>

                  {/* Name Box - positioned at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="bg-white/70 backdrop-blur-sm border-t border-black mx-[-1px] rounded-b-xl">
                      <div className="px-4 py-2 text-center flex flex-col justify-center items-center ml-0.5">
                        <h3 className="text-[#2C2C2C] font-rubik font-bold text-sm uppercase leading-tight">
                          {bird.name}
                        </h3>
                        <p className="text-[#2C2C2C]/50 font-rubik text-xs italic mt-1">
                          {bird.ability}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Content Sections */}
            <div className="space-y-10">
              
              {/* About Section */}
              <div className="space-y-3">
                <h3 className="text-base font-bold uppercase tracking-widest text-gray-800">
                  About
                </h3>
                <p className="text-base leading-6 text-gray-500">
                  {bird.description}
                </p>
              </div>

              {/* Odd Facts Section */}
              <div className="space-y-3">
                <h3 className="text-base font-bold uppercase tracking-widest text-gray-800">
                  Odd Facts
                </h3>
                <p className="text-base leading-6 text-gray-500">
                  {bird.funFact}
                </p>
              </div>

              {/* Photos Section */}
              {bird.additionalImages && bird.additionalImages.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-base font-bold uppercase tracking-widest text-gray-800">
                    Photos
                  </h3>
                  <BirdPhotoCarousel
                    images={bird.additionalImages}
                    birdName={bird.name}
                    isCollected={isCollected}
                  />
                </div>
              )}

              {/* Size Section */}
              <div className="space-y-7">
                <h3 className="text-base font-bold uppercase tracking-widest text-gray-800">
                  Size
                </h3>
                
                {/* Size Comparison Icons */}
                <div className="flex items-end justify-center gap-4 px-4">
                  {/* S - Tiny */}
                  <div className="flex flex-col items-center">
                    <svg
                      className={`w-8 h-8 transition-colors duration-200 ${bird.size === 'tiny' ? 'fill-white' : 'fill-white/40'}`}
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M34.8685 52.5194C35.5217 52.6875 36.5538 52.8283 37.8325 52.592C38.0243 52.5557 38.2299 52.5784 38.4217 52.6511C38.9846 52.8976 40.9415 53.0896 42.0159 52.9511C42.171 52.9327 42.3217 52.91 42.4679 52.8827C42.8195 54.1052 42.8789 55.7861 42.1208 57.3945C41.198 59.5698 38.3883 61.2783 35.6264 61.7565L36.5204 63.09H39.6444C40.2495 63.1025 40.2404 63.9873 39.6444 63.9987H36.2889C36.2787 64.0009 36.2684 63.9998 36.2581 63.9987H32.8544C32.8442 64.0009 32.8339 63.9998 32.8236 63.9987H29.2592C29.0068 63.9987 28.8025 63.7953 28.8025 63.5443C28.8025 63.2933 29.0068 63.09 29.2592 63.09H31.9856C31.9571 63.0241 30.8336 61.435 30.9044 61.4111C29.8449 61.0113 29.0228 60.4433 28.42 59.9208C28.0364 59.939 27.6573 59.9526 27.2919 59.9526C22.4967 59.9129 18.1876 58.092 19.1307 57.6217L21.6836 56.8267C21.3914 56.5768 21.0443 56.1405 20.9712 55.4772C20.9621 55.3681 21.0306 55.2636 21.1402 55.2363C21.2451 55.2091 23.4739 54.6184 25.1226 55.3408C24.8029 56.1246 24.5414 56.8845 24.3325 57.7262C24.2594 58.0011 24.4923 58.2987 24.7755 58.2942C25.3247 58.4091 34.9164 57.8322 34.8685 52.5194ZM32.206 61.7792L33.0863 63.09H35.4201L34.6357 61.9246L34.0372 61.9248C33.4188 61.9254 32.7575 61.9146 32.206 61.7792ZM26.6162 54.3643C27.8014 54.9254 31.1283 55.123 33.1058 54.6414C31.2015 56.8312 26.9541 57.2719 25.3785 57.3628C25.7119 56.227 26.1367 55.2321 26.6162 54.3643ZM31.375 49.4436L32.9095 50.5886C33.8286 51.2769 34.2259 52.5105 33.7772 53.5646C30.3198 54.3962 28.0227 53.8737 27.0956 53.5647C28.7261 51.0248 30.7082 49.8071 31.375 49.4436ZM36.9513 44C40.646 44.0047 41.8791 46.8989 42.0891 47.4714L44.8841 49.0026C45.0554 49.0866 45.0302 49.3535 44.8521 49.416C44.8339 49.4251 43.482 49.9022 42.5275 50.402C42.6463 51.0244 42.5549 51.5878 42.4408 51.9695C41.2785 52.2228 39.293 52.024 38.7506 51.8059C38.399 51.6696 38.0199 51.6333 37.6637 51.7014C36.7778 51.9309 35.1474 51.7435 34.6724 51.5106C34.4486 50.8745 34.0331 50.2975 33.4576 49.8658L31.777 48.6072C31.6582 48.5027 31.4995 48.4277 31.3431 48.4618C31.5532 47.9347 32.0144 46.9443 32.7954 46.031C32.905 46.1173 33.0238 46.2127 33.1562 46.3081C34.1883 47.0805 35.8872 48.1256 37.6089 48.1937C37.7505 48.7117 38.23 49.0889 38.7918 49.0889C40.4096 49.0468 40.4142 46.6887 38.7918 46.6444C38.3305 46.6444 37.924 46.9034 37.7094 47.2805C36.2753 47.2578 34.7682 46.3536 33.8091 45.6493C33.6721 45.5539 33.5488 45.4631 33.4392 45.3722C34.307 44.5941 35.4625 43.9989 36.9513 44ZM39.1068 47.8668C39.108 48.2769 38.4788 48.2769 38.4766 47.8668C38.4788 47.4568 39.1079 47.4568 39.1068 47.8668Z"/>
                    </svg>
                  </div>

                  {/* M - Small */}
                  <div className="flex flex-col items-center">
                    <svg
                      className={`w-8 h-8 transition-colors duration-200 ${bird.size === 'small' ? 'fill-white' : 'fill-white/40'}`}
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(13, 34)">
                        <path d="M31.7539 10.3888C33.8285 17.7188 22.0538 18.762 16.5283 18.8664C13.9472 18.904 11.2802 18.7418 9.41897 18.5382C7.60361 20.0693 3.1419 22.919 0.16018 24.6896C-0.133906 24.8505 0.00705437 25.34 0.338891 25.3263C2.72318 24.9517 4.91794 24.3638 6.84573 23.7121C4.47849 25.5133 2.26745 27.3277 2.22073 27.3585C1.95044 27.5655 2.17257 28.0141 2.49416 27.9611C8.66787 26.9087 12.3721 24.3617 15.7696 22.2267C16.6145 22.5825 17.4303 22.8718 18.2188 23.089C18.3796 23.8246 18.9615 24.8557 19.9707 25.4767L20.8125 28.3566H16.2002C15.3007 28.3739 15.3007 29.7074 16.2002 29.7248C20.4731 29.723 26.4711 29.7265 30.7188 29.7248C31.6255 29.7111 31.6083 28.3669 30.7188 28.3566H27.5323L26.7041 25.6144C28.0382 25.0671 28.5173 23.3976 28.6406 22.8293C28.6612 22.7334 28.6407 22.6369 28.586 22.5617C34.0037 19.9594 35.6225 16.8426 35.9424 11.9552C34.6714 11.2932 32.8454 10.4692 31.7539 10.3888ZM23.3096 24.4777C23.7269 25.0114 24.3909 25.6131 25.3145 25.757L26.1084 28.3556H22.2422L21.4414 25.6408C22.2283 25.5108 22.858 24.984 23.3096 24.4777ZM23.166 5.58413C22.4133 6.48739 21.5783 7.32955 20.5176 7.97281C15.2628 11.1612 11.6568 15.6495 10.4658 17.258C14.321 17.6499 33.8387 18.4795 30.1045 9.87515C29.1292 7.59825 26.288 5.42175 23.166 5.58413ZM30.3448 0.00796264C27.3545 0.151648 25.8551 2.10846 24.2676 4.18863C24.182 4.33061 24.8119 4.2801 24.9932 4.3605C27.9288 4.9147 30.1327 6.89161 31.2207 9.02652C32.3361 8.90357 33.9647 9.49866 35.2852 10.1007C35.5247 10.2171 35.7576 10.3272 35.9766 10.4367C35.9561 8.48646 35.716 6.81629 35.5996 6.09097C36.3523 5.91991 37.3788 5.69437 38.6035 5.88589C38.9027 5.9389 39.1271 5.55804 38.919 5.33218C38.6863 5.0516 36.8316 2.855 35.333 2.62906C34.97 1.87635 33.6563 -0.14236 30.3448 0.00796264ZM31.083 2.12222C32.1711 2.1393 32.1711 3.76136 31.083 3.77847C29.9954 3.76109 29.9954 2.13963 31.083 2.12222Z"/>
                      </g>
                    </svg>
                  </div>

                  {/* Medium Bird */}
                  <div className="flex flex-col items-center">
                    <svg className={`w-9 h-10 ${bird.size === 'medium' ? 'fill-gray-800' : 'fill-gray-400'}`} viewBox="0 0 35 40">
                      <path d="M17.2884 8.60786C16.9826 9.58865 16.4049 10.3676 15.6302 10.8685C14.1692 11.8144 12.8372 13.2474 11.4033 15.5012C11.9062 15.1325 12.4023 14.8195 12.8916 14.5551C14.6043 13.623 16.2013 13.2474 17.5196 13.2891C19.6533 13.3726 21.291 14.5203 22.0249 16.4401C22.4599 17.5807 22.1541 19.278 21.1891 21.1075C19.9182 23.4933 17.3426 26.3035 13.7341 27.4304C13.1225 28.3207 12.2798 29.232 11.308 30.1293C11.1382 30.2893 10.9683 30.4493 10.7848 30.6024C11.2605 31.5206 12.1303 33.176 12.9798 34.5602C13.1769 34.8733 13.4623 35.1098 13.8089 35.2211L15.0321 38.6087H11.5273C10.6269 38.6313 10.6387 39.9773 11.5273 39.9999H27.2662C28.1633 39.9895 28.1531 38.6157 27.2662 38.6087H22.4599L20.8222 34.2613C22.3716 31.9032 22.6026 29.3921 22.6366 28.6617C25.5519 26.5729 28.1648 23.6863 29.5001 20.7944C31.3417 16.7739 30.127 13.6559 30.0166 10.4091C30.037 10.1657 30.1593 10.0249 30.3156 9.85969C31.0767 9.05628 31.8072 9.34666 32.3968 9.59186C32.9286 9.7901 33.0815 10.35 33.1222 10.8752C33.1511 11.1639 33.5283 11.2909 33.7135 11.0631C34.3591 10.4113 36.0682 7.63733 34.0329 5.89484C33.972 4.99067 33.4079 0.664071 28.4741 0.0728213C23.3434 -0.532189 19.164 2.66065 17.2884 8.60786Z" fillOpacity="0.2"/>
                    </svg>
                  </div>

                  {/* Large Bird */}
                  <div className="flex flex-col items-center">
                    <svg className={`w-11 h-13 ${bird.size === 'large' ? 'fill-gray-800' : 'fill-gray-400'}`} viewBox="0 0 44 53">
                      <path d="M43.6494 7.44557C43.6217 7.43635 40.3007 6.62516 38.7601 3.93361C36.267 -0.149828 30.8705 -2.23524 27.4503 3.63869C24.655 8.32126 25.2916 15.9535 25.9189 20.083C26.0665 21.0509 25.5868 22.0002 24.7196 22.4335C23.3635 23.1248 22.1643 23.7792 21.1034 24.4153C22.3811 24.1618 23.7279 24.0973 25.0609 24.2033C25.5683 24.2401 25.9373 24.6919 25.9004 25.1989C25.8543 25.7058 25.4115 26.0837 24.8949 26.0376C16.8045 25.3371 10.9371 33.1722 9.16585 35.8823C10.0976 36.1589 11.5829 36.3709 12.9113 35.5597C13.5547 35.1288 14.4473 35.7326 14.3043 36.4907C14.2951 36.5553 14.1382 37.4586 13.594 38.4634C15.9833 38.0209 19.4611 36.9609 20.7155 34.4998C21.2067 33.4928 22.7588 34.1287 22.4129 35.1911L21.269 38.8412C23.483 38.0393 27.339 36.2972 28.9903 33.4029C29.8391 31.928 29.9959 30.361 29.4793 28.6096C29.1495 27.4505 30.8907 26.9274 31.2505 28.0842C33.9027 36.348 22.7173 40.6108 20.0788 41.1459C19.41 41.3326 18.7481 40.6458 18.981 39.9752L19.516 38.2699C16.1396 40.3623 11.5178 40.602 11.2598 40.6205C10.3373 40.6574 9.91523 39.3738 10.7524 38.8967C11.186 38.6479 11.5273 38.2792 11.7764 37.9013C9.47934 38.27 7.46823 37.21 7.35753 37.1547C6.91933 36.9196 6.73713 36.3182 6.98853 35.8919C7.07155 35.7536 7.63432 34.7488 8.63985 33.3938C8.8797 33.062 9.14723 32.7117 9.44244 32.343C6.17908 32.9399 3.61446 31.8107 3.30751 28.4256C3.27522 27.9854 2.61561 27.8495 2.43111 28.2597C2.40343 28.3242 -0.677747 34.5648 3.26134 38.9616C2.61555 39.1551 1.58234 39.321 0.71521 38.7495C0.539929 38.6389 0.318522 38.6482 0.161698 38.7772C0.0140958 38.9063 -0.0412536 39.1183 0.0325474 39.3026C0.987355 42.0126 6.95627 47.6513 18.5566 46.1328C19.2277 47.2298 20.4131 48.3957 21.9884 48.299L22.7356 51.1565H19.2461C18.7365 51.1565 18.3236 51.569 18.3236 52.0783C18.3236 52.5875 18.7365 53 19.2461 53H23.9302H28.6166H36.1006C37.3068 52.9724 37.3206 51.1819 36.1006 51.1565H29.3593L28.28 46.3541C29.5761 45.7389 29.9313 44.0175 29.7929 42.8237C33.3169 40.8696 35.808 38.2056 36.8872 35.1269C38.6677 30.1217 37.2563 22.8764 34.9407 18.3045C33.5985 15.6267 31.1285 11.6423 31.878 9.62123C32.0809 9.00363 32.5514 8.53356 33.2986 8.19252C34.3042 7.72242 35.2451 8.13722 36.4444 8.66262C38.2802 9.47378 40.568 10.4878 43.8062 8.27553C44.1221 8.06814 44.0392 7.51465 43.6494 7.44557Z" fillOpacity="0.2"/>
                    </svg>
                  </div>

                  {/* Enormous Bird */}
                  <div className="flex flex-col items-center">
                    <svg className={`w-15 h-14 ${bird.size === 'enormous' ? 'fill-gray-800' : 'fill-gray-400'}`} viewBox="0 0 59 56">
                      <path d="M56.342 11.8767C54.3406 11.0992 52.9534 9.09916 52.9125 7.71297C53.9695 7.18868 55.0086 6.00451 56.1475 5.98409C56.6031 6.00455 56.8386 5.37805 56.4854 5.08394C56.2294 4.84864 54.3458 3.31413 52.5746 2.96627C51.7966 2.0456 47.8449 -2.06693 43.1765 1.30904C39.2145 4.18369 41.948 9.50357 44.1388 13.7691C45.421 16.3471 47.2714 19.5132 45.8075 20.4086C45.1114 20.5723 43.586 19.6005 41.989 18.5571C36.622 14.7975 29.1333 11.4677 21.7185 17.6977C19.2205 12.3474 13.5691 1.38064 8.91132 1.14559C5.55599 0.823339 2.69459 4.73891 4.76515 7.63143C1.35864 7.99715 -0.440597 12.7363 2.66648 15.0587C0.191603 16.1686 -1.46179 20.5215 1.87821 22.3012C0.626654 23.5825 -0.338171 28.7948 3.36265 29.7592C3.12718 30.5367 2.74838 32.5419 4.48878 34.4549C5.00065 35.0176 5.66611 35.2426 6.44416 35.2426C9.45139 35.0943 13.0191 32.882 16.2721 32.9613C17.731 40.033 23.3489 45.8155 33.0616 47.7948V53.9482H28.5929C27.2569 53.9559 27.2441 55.9789 28.5929 55.9942C34.8634 56.0121 43.8492 55.9814 50.1581 55.9942C51.4992 55.961 51.5095 53.9789 50.1581 53.9482H41.9092V47.8228C51.6297 46.8254 56.3668 40.4598 57.7027 34.5339C59.0233 29.2142 58.2351 23.3525 55.9111 20.0173C55.5887 19.5467 55.2329 19.1528 54.8464 18.7794C50.9664 15.1707 50.7566 10.6798 51.2761 8.61348C51.573 10.9152 53.3979 14.7311 57.5184 16.7746C60.2672 16.4728 58.7904 12.6723 56.3411 11.8743L56.342 11.8767Z" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
                
                {/* Size Label */}
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    {bird.size}
                  </span>
                </div>
              </div>

              {/* Add bottom padding to prevent content being hidden behind sticky button */}
              <div className="pb-32"></div>
            </div>

            {/* Sticky Collection Button */}
            <div className="fixed bottom-0 left-0 right-0 z-20 p-6" style={{ marginBottom: '30px' }}>
              <div className="max-w-sm mx-auto">
                {isCollected ? (
                  <Button
                    variant="outline"
                    onClick={handleCollectionToggle}
                    className="w-full bg-white/90 backdrop-blur-sm hover:bg-white/80"
                  >
                    Remove from Collection
                  </Button>
                ) : (
                  <Button
                    onClick={handleCollectionToggle}
                    className="w-full bg-white hover:bg-gray-100 text-black shadow-lg"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Collection
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
