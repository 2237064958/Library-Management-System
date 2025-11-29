import { GoogleGenAI } from "@google/genai";
import { Book } from "../types";

// 初始化 Gemini 客户端
// ⚠️ 注意: API Key 必须通过 process.env.API_KEY 获取
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * 智能图书推荐
 * 根据用户的查询和当前馆藏书籍，提供推荐建议
 */
export const getBookRecommendation = async (
  query: string,
  inventory: Book[]
): Promise<string> => {
  try {
    // 构建上下文，仅发送必要的字段以节省 Token
    const inventoryContext = inventory.map(b => ({
      title: b.title,
      author: b.author,
      category: b.category,
      description: b.description,
      status: b.status
    }));

    const prompt = `
    你是一个专业的图书馆管理员。这是目前的馆藏书目（JSON格式）：
    ${JSON.stringify(inventoryContext).slice(0, 10000)}... (截断以适应上下文窗口)
    
    用户查询： "${query}"
    
    请根据用户的查询和现有馆藏，推荐1-3本最相关的书籍。
    如果是特定领域的查询，请解释为什么推荐这几本书。
    如果馆藏中没有完全匹配的书，请推荐最接近的。
    请用亲切、专业的语气回答。回答不要太长，控制在200字以内。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "抱歉，我现在无法提供推荐。";
  } catch (error) {
    console.error("Gemini AI Recommendation Error:", error);
    return "智能馆员暂时离线，请稍后再试。";
  }
};

/**
 * 生成图书摘要
 */
export const getBookSummary = async (bookTitle: string, author: string): Promise<string> => {
  try {
    const prompt = `请为书籍《${bookTitle}》（作者：${author}）生成一个简短的摘要（约100字），用于图书馆的展示介绍。重点介绍核心内容和适合的读者群体。`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "无法生成摘要。";
  } catch (error) {
    console.error("Gemini AI Summary Error:", error);
    return "摘要生成失败。";
  }
}
