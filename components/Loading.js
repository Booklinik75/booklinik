import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 w-screen h-screen flex-col bg-white flex items-center justify-center z-40"
    >
      <div className="flex flex-col items-center">
        {/* <div className="loading-animation m-auto">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div> */}
        <div className="relative">
          <svg
            width="185"
            height="45"
            viewBox="0 0 125 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5_2)">
              <path
                d="M3.164 26V24.18C3.61047 24.8791 4.23458 25.447 4.97251 25.8258C5.71044 26.2046 6.53573 26.3807 7.364 26.336C11.34 26.336 13.776 23.228 13.776 19.112C13.776 15.112 11.564 12 7.476 12C6.64744 11.9514 5.82005 12.1133 5.07096 12.4707C4.32187 12.8281 3.67546 13.3694 3.192 14.044V5.728H0V26H3.164ZM10.5 19.14C10.5 21.828 8.96 23.452 6.832 23.452C4.76 23.452 3.164 21.828 3.164 19.14C3.164 16.424 4.764 14.884 6.832 14.884C8.988 14.884 10.5 16.424 10.5 19.14ZM22.624 23.508C20.636 23.508 18.816 21.996 18.816 19.168C18.816 16.34 20.636 14.884 22.624 14.884C24.64 14.884 26.432 16.34 26.432 19.168C26.432 22.024 24.64 23.508 22.624 23.508ZM22.624 11.944C21.6782 11.9262 20.7388 12.1022 19.8635 12.4612C18.9883 12.8201 18.1958 13.3544 17.5348 14.0311C16.8738 14.7078 16.3583 15.5127 16.0201 16.3961C15.6818 17.2796 15.528 18.2229 15.568 19.168C15.5251 20.1152 15.6767 21.0611 16.0136 21.9474C16.3504 22.8336 16.8653 23.6415 17.5265 24.3211C18.1877 25.0006 18.9812 25.5375 19.8579 25.8985C20.7346 26.2595 21.676 26.437 22.624 26.42C23.5741 26.44 24.5181 26.2647 25.3978 25.9051C26.2774 25.5456 27.0739 25.0093 27.7379 24.3295C28.402 23.6497 28.9194 22.8409 29.2583 21.9531C29.5972 21.0653 29.7502 20.1173 29.708 19.168C29.7473 18.2207 29.592 17.2754 29.2518 16.3904C28.9115 15.5054 28.3935 14.6996 27.7296 14.0227C27.0658 13.3457 26.2703 12.812 25.3921 12.4545C24.514 12.097 23.5719 11.9232 22.624 11.944V11.944ZM38.556 23.508C36.568 23.508 34.748 21.996 34.748 19.168C34.748 16.34 36.568 14.884 38.556 14.884C40.572 14.884 42.364 16.34 42.364 19.168C42.364 22.024 40.572 23.508 38.556 23.508ZM38.556 11.944C37.6102 11.9262 36.6708 12.1022 35.7955 12.4612C34.9203 12.8201 34.1278 13.3544 33.4668 14.0311C32.8058 14.7078 32.2903 15.5127 31.9521 16.3961C31.6138 17.2796 31.46 18.2229 31.5 19.168C31.4571 20.1152 31.6087 21.0611 31.9456 21.9474C32.2824 22.8336 32.7973 23.6415 33.4585 24.3211C34.1197 25.0006 34.9132 25.5375 35.7899 25.8985C36.6666 26.2595 37.608 26.437 38.556 26.42C39.5061 26.44 40.4501 26.2647 41.3298 25.9051C42.2094 25.5456 43.0059 25.0093 43.6699 24.3295C44.334 23.6497 44.8514 22.8409 45.1903 21.9531C45.5292 21.0653 45.6822 20.1173 45.64 19.168C45.6793 18.2207 45.524 17.2754 45.1838 16.3904C44.8435 15.5054 44.3255 14.6996 43.6616 14.0227C42.9978 13.3457 42.2023 12.812 41.3241 12.4545C40.446 12.097 39.5039 11.9232 38.556 11.944V11.944ZM61.264 12.364H56.952L51.716 17.88V5.728H48.5V26H51.72V22.192L53.4 20.428L57.4 26H61.376L55.664 18.132L61.264 12.364ZM66.7 26V5.728H63.448V26H66.7ZM73.84 26V12.364H70.62V26H73.84ZM70.112 7.576C70.112 8.13295 70.3332 8.6671 70.7271 9.06092C71.1209 9.45475 71.655 9.676 72.212 9.676C72.4901 9.67971 72.7662 9.62813 73.0242 9.52425C73.2823 9.42038 73.5171 9.26628 73.7151 9.07091C73.913 8.87554 74.0702 8.64278 74.1775 8.38615C74.2848 8.12953 74.34 7.85415 74.34 7.576C74.3401 7.29651 74.2852 7.01973 74.1783 6.76149C74.0714 6.50325 73.9146 6.26861 73.717 6.07098C73.5194 5.87335 73.2847 5.71661 73.0265 5.60971C72.7683 5.50282 72.4915 5.44787 72.212 5.448C71.6519 5.45354 71.1168 5.68041 70.7233 6.07909C70.3299 6.47776 70.1101 7.01588 70.112 7.576V7.576ZM81 18.132C81 16.34 81.98 14.912 83.828 14.912C85.872 14.912 86.628 16.256 86.628 17.936V26H89.88V17.376C89.88 14.376 88.28 11.976 84.952 11.976C84.1436 11.951 83.3433 12.143 82.6343 12.532C81.9252 12.921 81.3333 13.4928 80.92 14.188V12.368H77.756V26H81V18.132ZM96.768 26V12.364H93.548V26H96.768ZM93.044 7.576C93.044 8.13295 93.2653 8.6671 93.6591 9.06092C94.0529 9.45475 94.5871 9.676 95.144 9.676C95.4221 9.67971 95.6982 9.62813 95.9562 9.52425C96.2143 9.42038 96.4491 9.26628 96.6471 9.07091C96.845 8.87554 97.0022 8.64278 97.1095 8.38615C97.2168 8.12953 97.272 7.85415 97.272 7.576C97.2721 7.29651 97.2172 7.01973 97.1103 6.76149C97.0034 6.50325 96.8466 6.26861 96.649 6.07098C96.4514 5.87335 96.2167 5.71661 95.9585 5.60971C95.7003 5.50282 95.4235 5.44787 95.144 5.448C94.5839 5.45354 94.0488 5.68041 93.6553 6.07909C93.2619 6.47776 93.0421 7.01588 93.044 7.576V7.576ZM113.456 12.364H109.144L103.908 17.88V5.728H100.688V26H103.908V22.192L105.588 20.428L109.588 26H113.564L107.852 18.132L113.456 12.364Z"
                fill="#485363"
              />
            </g>
            <defs>
              <clipPath id="clip0_5_2">
                <rect width="124.773" height="26.42" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div className="loading__plusAnimation absolute top-0 right-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 1.5V11"
                stroke="#33C783"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M2 6.25L11.5 6.25"
                stroke="#33C783"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <p className="mt-3 font-bold text-xl tracking-wide">
          Patientez s{"'"}il-vous-plait...
        </p>
      </div>
    </div>
  );
}
