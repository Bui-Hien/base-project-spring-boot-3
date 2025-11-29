const LocalStorageService = {
  setItem:(key, value) => {
    try {
      const data = typeof value === "string"? value : JSON.stringify (value);
      localStorage.setItem (key, data);
    } catch (error) {
      console.error (`LocalStorageService.setItem error: ${error}`);
    }
  },

  getItem:(key, defaultValue = null) => {
    try {
      const value = localStorage.getItem (key);
      if (value === null) return defaultValue;

      // Try parse JSON nếu có thể
      try {
        return JSON.parse (value);
      } catch {
        return value; // trường hợp là string đơn giản
      }
    } catch (error) {
      console.error (`LocalStorageService.getItem error: ${error}`);
      return defaultValue;
    }
  },

  updateItem:(key, newValue) => {
    try {
      const oldValue = LocalStorageService.getItem (key);
      let updatedValue;

      if (typeof oldValue === "object" && typeof newValue === "object") {
        updatedValue = {... oldValue, ... newValue};
      } else {
        updatedValue = newValue;
      }

      LocalStorageService.setItem (key, updatedValue);
      return updatedValue;
    } catch (error) {
      console.error (`LocalStorageService.updateItem error: ${error}`);
    }
  },

  removeItem:(key) => {
    try {
      localStorage.removeItem (key);
    } catch (error) {
      console.error (`LocalStorageService.removeItem error: ${error}`);
    }
  },

  clearAll:() => {
    try {
      localStorage.clear ();
    } catch (error) {
      console.error (`LocalStorageService.clearAll error: ${error}`);
    }
  },

  getAllKeys:() => {
    try {
      return Object.keys (localStorage);
    } catch (error) {
      console.error (`LocalStorageService.getAllKeys error: ${error}`);
      return [];
    }
  },
  getConfig:(key, defaultValue = null) => {
    const config = LocalStorageService.getItem ("sysConfig") || {};
    return config[key] !== undefined? config[key] : defaultValue;
  },
};

export default LocalStorageService;
