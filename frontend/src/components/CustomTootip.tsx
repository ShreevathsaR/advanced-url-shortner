const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, dataKey } = payload[0];

    return (
      <div className="bg-[#1a1a2e] border border-[#303052] p-3 rounded-lg shadow-lg">
        <p className="text-[#e2e2f5] font-[SF-Pro-Bold]">{name}</p>
        <p className="text-[#e2e2f5] font-[SF-Pro-Regular] text-sm">
          {`${dataKey}: ${value}`}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip