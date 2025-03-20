"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchNews } from "../utils/fetchNews"; // Pastikan jalur ini benar

export default function Admin() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const response = await fetchNews(); // Memanggil fungsi fetchNews
        setArticles(response);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setMessage("Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();
    const newArticle = { title, description, url };
    try {
      await axios.post("https://api.example.com/articles", newArticle); // Ganti dengan API Anda
      setArticles([...articles, newArticle]);
      setMessage("Artikel berhasil ditambahkan!");
      resetForm();
    } catch (error) {
      console.error("Error adding article:", error);
      setMessage("Gagal menambahkan artikel.");
    }
  };

  const handleEditArticle = (article) => {
    setTitle(article.title);
    setDescription(article.description);
    setUrl(article.url);
    setIsEditing(true);
    setCurrentArticleId(article.id); // Ganti dengan ID artikel yang sesuai
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    const updatedArticle = { title, description, url };
    try {
      await axios.put(`https://api.example.com/articles/${currentArticleId}`, updatedArticle); // Ganti dengan API Anda
      setArticles(articles.map((article) => (article.id === currentArticleId ? updatedArticle : article)));
      setMessage("Artikel berhasil diperbarui!");
      resetForm();
    } catch (error) {
      console.error("Error updating article:", error);
      setMessage("Gagal memperbarui artikel.");
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await axios.delete(`https://api.example.com/articles/${id}`); // Ganti dengan API Anda
      setArticles(articles.filter((article) => article.id !== id));
      setMessage("Artikel berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting article:", error);
      setMessage("Gagal menghapus artikel.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setIsEditing(false);
    setCurrentArticleId(null);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Admin Berita</h1>

      {message && <div className="mb-4 text-green-500">{message}</div>}

      <input
        type="text"
        placeholder="Cari artikel..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <form onSubmit={isEditing ? handleUpdateArticle : handleAddArticle} className="mb-6">
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
                <input
          type="url"
          placeholder="URL Gambar"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isEditing ? "Perbarui Artikel" : "Tambah Artikel"}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded ml-2">
            Batal
          </button>
        )}
      </form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-200">{article.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block hover:underline">
                Baca Selengkapnya →
              </a>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditArticle(article)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArticle(article.id)} // Ganti dengan ID artikel yang sesuai
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}