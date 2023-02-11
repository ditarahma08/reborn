const PinShop = ({ text, onClick }) => {
  return (
    <div
      data-tip={text}
      onClick={onClick}
      style={{ width: '100px', cursor: 'pointer', paddingLeft: '40px', marginLeft: '-40px' }}>
      <div style={{ width: '100px', paddingLeft: '40px', marginLeft: '-40px' }}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.47607 13.2306C4.47607 11.1904 5.43883 9.28641 7.03929 8.16139L10.8488 5.48355C12.7597 4.14035 15.2401 4.14035 17.151 5.48355L20.9605 8.16139C22.5609 9.28641 23.5237 11.1904 23.5237 13.2306V17.4472C23.5237 20.8032 20.9653 23.5238 17.8094 23.5238H10.1904C7.03445 23.5238 4.47607 20.8032 4.47607 17.4472V13.2306Z"
            fill="#FF6400"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.3332 13.2443V17.3859C27.3332 22.8797 23.0692 27.3333 17.8094 27.3333H10.1903C4.93046 27.3333 0.666504 22.8797 0.666504 17.3859V13.2443C0.666504 9.90453 2.27109 6.78766 4.93852 4.94599L8.74805 2.31579C11.9328 0.116956 16.0669 0.116955 19.2516 2.31579L23.0612 4.94599C25.7286 6.78766 27.3332 9.90453 27.3332 13.2443ZM7.03924 8.26531C5.43878 9.37031 4.47603 11.2404 4.47603 13.2443V17.3859C4.47603 20.6822 7.0344 23.3544 10.1903 23.3544H17.8094C20.9653 23.3544 23.5236 20.6822 23.5236 17.3859V13.2443C23.5236 11.2404 22.5609 9.37031 20.9604 8.26531L17.1509 5.63511C15.2401 4.31581 12.7596 4.31581 10.8488 5.63511L7.03924 8.26531Z"
            fill="white"
          />
          <path
            d="M15.3217 11.6428C15.2115 11.7552 15.1498 11.9064 15.1498 12.0638C15.1498 12.2212 15.2115 12.3723 15.3217 12.4847L16.2839 13.4469C16.3963 13.5571 16.5474 13.6188 16.7048 13.6188C16.8622 13.6188 17.0133 13.5571 17.1257 13.4469L19.3928 11.1798C19.6952 11.848 19.7868 12.5925 19.6553 13.3141C19.5238 14.0356 19.1756 14.7 18.6569 15.2186C18.1383 15.7372 17.474 16.0855 16.7524 16.217C16.0308 16.3484 15.2863 16.2569 14.6181 15.9545L10.4628 20.1098C10.2236 20.349 9.89913 20.4834 9.56081 20.4834C9.22248 20.4834 8.89802 20.349 8.65879 20.1098C8.41955 19.8706 8.28516 19.5461 8.28516 19.2078C8.28516 18.8695 8.41955 18.545 8.65879 18.3058L12.8141 14.1505C12.5117 13.4822 12.4202 12.7377 12.5516 12.0162C12.6831 11.2946 13.0313 10.6303 13.55 10.1116C14.0686 9.59302 14.733 9.24477 15.4545 9.1133C16.1761 8.98183 16.9206 9.07338 17.5888 9.37576L15.3277 11.6368L15.3217 11.6428Z"
            fill="#FCFCFC"
          />
        </svg>
      </div>

      <div style={{ width: '100px', textAlign: 'center', position: 'absolute', left: '-35px' }}>
        {text}
      </div>
    </div>
  );
};

export default PinShop;