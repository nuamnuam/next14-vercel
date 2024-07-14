const externalData = (() => {
  let data: any;

  return {
    get() {
      if (!data) return undefined;

      let clonedData;
      if (typeof data === 'function' || typeof data === 'object') {
        clonedData = { ...(data as object) };
      } else {
        clonedData = data;
      }
      // data = undefined;
      return clonedData;
    },
    set(newData: any) {
      data = newData;
    },
  };
})();

export default externalData;
