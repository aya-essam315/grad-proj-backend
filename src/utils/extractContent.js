export const  extractJson=(text) =>{
    try {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        const jsonString = match[1].trim(); // إزالة المسافات البيضاء الزائدة
        return JSON.parse(jsonString); // تحويل النص إلى كائن JSON
      }
      return { error: "❌ no json found" };
    } catch (error) {
      return { error: "❌error in extracting", details: error.message };
    }
  }
  