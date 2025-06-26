// export const extractJson = (text) => {
//   try {
//     const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
//     if (match && match[1]) {
//       const jsonString = match[1].trim(); // إزالة المسافات البيضاء الزائدة
//       return JSON.parse(jsonString); // تحويل النص إلى كائن JSON
//     }
//     return { error: "❌ no json found" };
//   } catch (error) {
//     return { error: "❌error in extracting", details: error.message };
//   }
// };

export const extractJson = (text) => {
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
    if (!match || !match[1]) {
      return { error: "❌ no json found" };
    }

    const jsonString = match[1].trim();
    const parsedJson = JSON.parse(jsonString);

    // ✅ لو فيه teachingPlan، ننظف المفاتيح
    if (Array.isArray(parsedJson.teachingPlan)) {
      const cleanedPlan = parsedJson.teachingPlan.map((item) => {
        const newItem = {};
        for (const key in item) {
          if (/lecture\s*\d+/i.test(key)) {
            newItem["LectureName"] = item[key]; // نحذف الرقم ونحفظ تحت نفس المفتاح
          } else {
            newItem[key] = item[key];
          }
        }
        return newItem;
      });

      parsedJson.teachingPlan = cleanedPlan;
    }

    return parsedJson;
  } catch (error) {
    return {
      error: "❌ error in extracting or parsing",
      details: error.message,
    };
  }
};
