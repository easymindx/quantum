export const calculatePositions = (collection, radius, insetFactor = 2) => {
  const count = collection.length;
  const constant = (2 * Math.PI) / count;

  let output = [];

  for (let i = 0; i < count; i++) {
    const rotation = i * constant;
    output.push({
      x: radius * Math.sin(rotation),
      y: 0,
      z: radius * Math.cos(rotation),
      rotation: rotation + Math.PI,
      url: collection[i]?.url,
      title: collection[i]?.title || '',
      description: collection[i]?.description || '',
      externalLink: collection[i]?.externalLink || '',
      type: collection[i]?.type || 'image',
      activeX: (radius - insetFactor) * Math.sin(rotation),
      activeY: 0.25,
      activeZ: (radius - insetFactor) * Math.cos(rotation),
    });
  }

  return output;
};
