const PinMap = () => {
  return (
    <div
      style={{
        height: '100px',
        width: '100px',
        background: 'rgba(255, 120, 33, 0.2)',
        border: '1px solid #FF7821',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        position: 'absolute',
        transform: 'translate(-50%, -50%)'
      }}>
      <div
        style={{
          height: '16px',
          width: '16px',
          background: '#FF7821',
          border: '4px solid #FCFCFC',
          borderRadius: '50%',
          boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 10
        }}></div>
    </div>
  );
};

export default PinMap;
