  const CustomTooltip1 = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-[#303052] p-3 rounded-lg shadow-lg">
          <p className="text-[#e2e2f5] font-[SF-Pro-Bold]">{`${label}`}</p>
          {payload.map((entry: any, index: any) => (
            <p
              key={index}
              className="text-[#e2e2f5] font-[SF-Pro-Regular] text-sm"
            >
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

export default CustomTooltip1