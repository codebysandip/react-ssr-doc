export const removeSysAndMetaData = (entry: Record<string, any>) => {
  if (typeof entry === "object") {
    Object.keys(entry).forEach((key) => {
      if (key === "sys" || key === "metadata") {
        delete entry[key];
        return;
      }
      if (Array.isArray(entry[key])) {
        entry[key].forEach((item: any) => removeSysAndMetaData(item));
        return;
      }

      if (typeof entry[key] === "object") {
        removeSysAndMetaData(entry[key]);
      }
    });
  }
};

export const removeFieldsKey = (entry: Record<string, any>) => {
  const removeKey = (newEntry: Record<string, any>) => {
    const keys = Object.keys(newEntry);
    let index = 0;
    for (index = 0; index < keys.length; index++) {
      const element = newEntry[keys[index]];
      if (keys[index] === "fields") {
        newEntry = element;
        break;
      } else if (Array.isArray(element)) {
        newEntry[keys[index]] = element.map((item: Record<string, any>) => {
          return removeKey(item);
        });
      } else if (typeof element === "object") {
        newEntry[keys[index]] = removeKey(newEntry[keys[index]]);
      }
    }
    if (index < keys.length) {
      removeKey(newEntry);
    }
    return newEntry;
  };
  return removeKey(JSON.parse(JSON.stringify(entry.fields || entry)));
};
