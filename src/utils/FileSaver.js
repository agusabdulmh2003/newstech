import { saveAs } from 'file-saver';

const exportToCSV = () => {
  const csvContent = "Title,Description,URL,Category,Status\n" +
    articles.map(article =>
      `"${article.title}","${article.description}","${article.url}","${article.category}","${article.status}"`
    ).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "articles.csv");
};
export { saveAs };

