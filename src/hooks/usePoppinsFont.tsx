
import { useEffect } from "react";

export const usePoppinsFont = () => {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Poppins',
        'url(https://fonts.googleapis.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('Poppins font loaded successfully');
      } catch (error) {
        console.error('Error loading Poppins font:', error);
      }
    };

    loadFont();
  }, []);
};
