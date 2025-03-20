export const fetchNews = async (category = '') => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&category=${category}&apiKey=${apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();
    return data.articles;
};
